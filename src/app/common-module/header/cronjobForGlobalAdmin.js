// Author - Manglesh Patel
// Date - 27 March 2020
// Description - Cronjob for global admin to store quarterly reports
var express = require('express');
var router = express.Router();
var async = require('async');
var env = require('./env');
var underscore = require('underscore');
var weberror = require('./weberror');
var connection = env.dbconnection;
const globalRegionalAdminService = require('./services/globalRegionalAdminService.js');
var CronJob = require('cron-job-manager');
// var job = new CronJob('global_admin_reports','*/05 * * * * *',function(){storeGlobalAdminQuarterlyReports(true);},{start:true});
var job = new CronJob('global_admin_reports',env.global_admin_quarterly_time,function(){storeGlobalAdminQuarterlyReports(false);},{start:true});
var job1 = new CronJob('global_admin_reports',env.global_admin_daily_time,function(){storeGlobalAdminQuarterlyReports(true);},{start:true});
// 55 23 30,31 3,6,9,12 *
// */10 * * * * *
// 02 0 1 1,4,7,10 *
function storeGlobalAdminQuarterlyReports(dailyCron)
{
    let body = {};
    let timebefore1day=60*60*24*1000;
    let todaydate=env.timestamp();
    // 1st apr - 1585714581803
    // 1st jan - 1577817000000
    // 1st oct - 1569868200000
    // check cron is daily or quarterly - if true then it is daily otherwise quarterly
    if(dailyCron){
      var databefore2days=todaydate;
      body.endDate = false;
    }else {
      var databefore2days=todaydate-(timebefore1day*2);
      body.endDate = true;
    }
    var quarterDetails = globalRegionalAdminService.configurePreviousQuarterVariables(databefore2days,false);
    var host_details = underscore.findWhere(env.msd_instances,{url:env.host});
    var instance_name = '';
    if(host_details){
      instance_name = host_details.name;
    }
    body.date = databefore2days;
    var company_types = [];
    if(instance_name == 'EU'){
      company_types = ['MER','EEMEA'];
    }else {
      company_types = [instance_name];
    }
    getOtherInstancesGlobalAdmins(body,function(error,globalResponse){
      if(error){
        console.log('Error:#0015 in cronjobForGlobalAdmin.js',error);
      }else {
        var globalAdminData = globalResponse.data;
        connection.getConnection(function(err,conn){
          conn.beginTransaction(function(err){
            if(err) throw err;

            async.eachSeries(company_types,function(company_type,cb1){
              body.company_type = company_type;
              globalRegionalAdminService.processCurrentQuarterAdoptionRegionData(body,function(error,response){
                if(error){
                  console.log('Error:#001 in cronjobForGlobalAdmin.js',error);
                  return cb1(error);
                }else {
                  var companyWiseData = response.data.companyData;
                  var businessUnitStatic = response.data.business_unit;
                  globalRegionalAdminService.processCurrentQuarterAdoptionRegionEndToEnd(body,function(error,response1){
                    if(error){
                      console.log('Error:#002 in cronjobForGlobalAdmin.js',error);
                      return cb1(error);
                    }else {
                      var surveyCompanyData = response1.data.surveyCompanyData;
                      var teamCompanyData = response1.data.teamCompanyData;
                      var insertQuery = "INSERT INTO `adoption_dashboard_data` (`company_id`, `instance_name`, `quarter`, `quarter_year`,";
                      insertQuery += " `allocated_licenses`, `active_users`, `utilization_rate`, `total_surveys`, `completed_surveys`, `total_accounts`, `available_unit`, `accepted_accounts`,";
                      insertQuery += " `company_utilization_pc`, `company_utilization_vac`, `company_utilization_hac`, `company_utilization_onco`, `company_utilization_others`,";
                      insertQuery += " `survey_close_pc`, `survey_close_vac`, `survey_close_hac`, `survey_close_onco`, `survey_close_others`,";
                      insertQuery += " `resource_pc`, `resource_vac`, `resource_hac`, `resource_onco`, `resource_others`,";
                      insertQuery += " `franchise_completion`, `survey_closed_completion`, `resource_completion`, `created_on`, `modified_on`) VALUES ";

                      var reportValues = [];
                      async.eachSeries(companyWiseData,function(single,cb){
                        var survey = underscore.findWhere(surveyCompanyData,{company_id:single.company_id});
                        var team = underscore.findWhere(teamCompanyData,{company_id:single.company_id});
                        var survey_completion = 0;
                        if(survey){
                          survey_completion = survey.completion_rate;
                        }
                        var resource_completion = 0;
                        if(team){
                          resource_completion = team.completion_rate;
                        }
                        var available_unit = '';
                        if(single.available_unit && single.available_unit.length>0){
                          available_unit = single.available_unit.join(',');
                        }
                        var franchise_completion =  0;
                        if(single.franchise_status == 'All'){
                          franchise_completion = 100;
                        }else if(single.franchise_status == 'N/A') {
                          franchise_completion = 'N/A';
                        }
                        var franchiseUtilization = generateSpecifiedFranchiseObject(single,businessUnitStatic,'company_utilization_','');
                        var surveyClosed = generateSpecifiedFranchiseObject(survey,businessUnitStatic,'survey_close_','_end_date');
                        var teamCreated = generateSpecifiedFranchiseObject(team,businessUnitStatic,'resource_','_end_date');
                        var temp_data = "("+single.company_id+","+connection.escape(single.company_type)+","+quarterDetails.quarter+","+quarterDetails.quarter_year+"";
                        temp_data += ","+single.licenses+","+single.utilization+","+single.utilization_rate+","+single.total_surveys+","+single.completed_surveys+","+single.total_customers+","+connection.escape(available_unit)+","+single.accepted_accounts+"";
                        temp_data += ","+connection.escape(franchiseUtilization.company_utilization_pc)+","+connection.escape(franchiseUtilization.company_utilization_vac)+","+connection.escape(franchiseUtilization.company_utilization_hac)+","+connection.escape(franchiseUtilization.company_utilization_onco)+","+connection.escape(franchiseUtilization.company_utilization_others)+"";
                        temp_data += ","+connection.escape(surveyClosed.survey_close_pc)+","+connection.escape(surveyClosed.survey_close_vac)+","+connection.escape(surveyClosed.survey_close_hac)+","+connection.escape(surveyClosed.survey_close_onco)+","+connection.escape(surveyClosed.survey_close_others)+"";
                        temp_data += ","+connection.escape(teamCreated.resource_pc)+","+connection.escape(teamCreated.resource_vac)+","+connection.escape(teamCreated.resource_hac)+","+connection.escape(teamCreated.resource_onco)+","+connection.escape(teamCreated.resource_others)+"";
                        temp_data += ","+connection.escape(franchise_completion)+","+connection.escape(survey_completion)+","+connection.escape(resource_completion)+","+env.timestamp()+","+env.timestamp()+")";
                        reportValues.push(temp_data);
                        cb();
                      },function(error){
                        if(reportValues.length>0){
                          var insertObj = {};
                          insertObj.quarter = quarterDetails.quarter;
                          insertObj.year = quarterDetails.quarter_year;
                          insertObj.instance_name = company_type;
                          insertObj.insert_string = insertQuery;
                          insertObj.insert_data = reportValues;
                          globalRegionalAdminService.processToInsertDashboardData(insertObj,conn,function(error,response){
                            if(error){
                              return cb1(error);
                            }else {
                              async.eachSeries(globalAdminData,function(admin,adminCallback){
                                insertObj.userid = admin.userid;
                                insertObj.user_type = 'globaladmin';
                                insertObj.company_id = admin.company_id ? admin.company_id : admin.xcellen_company_id;
                                globalRegionalAdminService.getOtherInstancesData(insertObj,'globalregionaladmin','insertGlobalAdminQuarterlyReports',admin.token,admin.instance,function(error,data_response){
                                  if(error){
                                    return adminCallback(error);
                                  }else {
                                    adminCallback();
                                  }
                                });
                              },function(error){
                                if(error){
                                  return cb1(error);
                                }else {
                                  cb1();
                                }
                              });
                            }
                          });
                        }else {
                          console.log('No data found in -',company_type);
                          cb1();
                        }
                      });
                    }
                  });
                }
              });
            },function(error){
              if(error){
                console.log('Error #0020 in cronjobForGlobalAdmin.js--',error);
                return conn.rollback(function() {
                  conn.release();
                });
              }else {
                conn.commit(function(err) {
                  if (err) {
                    console.log("Error#046 in 'cronjobForGlobalAdmin.js'",err);
                    return conn.rollback(function() {
                      conn.release();
                      throw err;
                    });
                  }else{
                    conn.release();
                    console.log('Quarterly reports added successfully!!');
                  }
                });
              }
            });
          });
        });
      }
    });
}

function getOtherInstancesGlobalAdmins(body,callback){
  var globalAdminData = [];
  if(env.msd_instances && env.msd_instances.length>0){
    var query = "select * from xcellen_user where xcellen_user_type = 'globaladmin' and email is not null";
    connection.query(query,function(error,result){
      if(error){
        console.log("Error#0017 in 'cronjobForGlobalAdmin.js'",error,query);
        callback(error,{status:false,message:"#0017:Error in getting global admin details!!",data:[],http_code:400});
      }else{
        if(result && result.length>0){
          var gadmin = result[0];
          gadmin.user_type = gadmin.xcellen_user_type;
          gadmin.company_id = gadmin.xcellen_company_id;
          gadmin.old_email_address = gadmin.email;
          async.eachSeries(env.msd_instances,function(single_instance,cb){
            var instance = single_instance.url;
            if(env.host!= instance){
              globalRegionalAdminService.loginGlobalAdminToOtherInstance(gadmin,instance,function(error,data_response){
                if(error){
                  console.log("Error#0016 in 'cronjobForGlobalAdmin.js'",error);
                  return cb(error);
                }else {
                  var globaladmin_details = data_response.data;
                  if(globaladmin_details && globaladmin_details.record){
                    globaladmin_details.record.token = globaladmin_details.token;
                    globaladmin_details.record.instance = instance;
                    globalAdminData.push(globaladmin_details.record);
                    cb();
                  }else {
                    cb();
                  }
                }
              });
            }else {
              cb();
            }
          },function(error){
            if(error){
              console.log("Error#0018 in 'cronjobForGlobalAdmin.js'",error);
              callback(error,{status:false,message:"#0018:Error in getting global admin details!!",data:[],http_code:400});
            }else{
              callback(null,{status:true,message:"global admin fetched successfully!!",data:globalAdminData,http_code:200});
            }
          });
        }else {
          callback(null,{status:true,message:"global admin not found!!",data:globalAdminData,http_code:200});
        }
      }
    });
  }else {
    callback(null,{status:true,message:"global admin not found!!",data:globalAdminData,http_code:200});
  }
}

function generateSpecifiedFranchiseObject(data,businessUnitStatic,prefix,postfix){
  var obj = {};
  businessUnitStatic.map(function(d){
    var lower = d.toLowerCase();
    if(data){
      if(data[d+postfix]==undefined){
        data[d+postfix] = 'N/A';
      }
      obj[prefix+lower] = data[d+postfix];
    }else {
      obj[prefix+lower] = 'N/A';
    }
  });
  return obj;
}

module.exports = router;
