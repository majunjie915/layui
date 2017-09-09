define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var util = require("mod/common/util");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    // var Encrypt = require("mod/common/encrypt");
    var params = util.toQueryParams();

    function logon(form) {
        var APIData = API.User.login;
        var locurl = window.location.href;

        var successFn = function(res) {
            LS.set("_vt",res.token);
            LS.set("userId",res.user.id);
            LS.set("user",JSON.stringify(res.user));          

            if (locurl.indexOf("logon2")>=0) {//转盘活动跳转页面
                window.location.href="/activity/rotate2/rotate.html";
            }else if (locurl.indexOf("/logon.html?r=1111")>=0) {//双十一活动跳转页面
                window.location.href="/dist/activity/1111/index.php";
            }else if (locurl.indexOf("/logon.html?r=thanksgiving")>=0) {//感恩节活动跳转页面
                window.location.href="/dist/activity/thanksgiving/index.php";
            }else if (locurl.indexOf("/logon.html?r=wangfei")>=0) {//王菲活动
                window.location.href="/dist/activity/wangfei/index.php";
            }else if (locurl.indexOf("/logon.html?r=teachyou")>=0) {//玩转唯票
                window.location.href="/dist/activity/teachyou/index.php";
            }else if (locurl.indexOf("/logon.html?r=lover")>=0) {//情人节活动
                window.location.href="/activity/valentinesDay/welfare.html";
            }else if (locurl.indexOf("reg_value=8")>=0) {//票选活动跳转页面
                window.location.href="/activity/votingActivities/voting.html";
            }else if (locurl.indexOf("reg_value=9")>=0) {//票选活动结果跳转页面
                window.location.href="/activity/votingActivities/activityResult.html";
            }else if (locurl.indexOf("reg_value=foolsDay")>=0) {//愚人节活动跳转页面
                window.location.href="/activity/foolDay/foolsDay.html";
            }else if (locurl.indexOf("r=10")>=0) {//幸运专区跳转页面
                window.location.href="./luckyInfo.html?id="+params["id"];
            }else if (LS.get("loginPage")) {//
                window.location.href=LS.get("loginPage");
                LS.remove("loginPage");
            }else{
                window.location.href="./index.html";
            }
            
        }        
        var form = $("[name='" + form + "']");
        var formObj = util.fromDataToJSON(form,true);
        var user_name = $("#logonForm [name=user_name]").val();
        var pass_word = $("#logonForm [name=pass_word]").val(); 
                
        var data = {
            user_name: user_name,
            pass_word:pass_word
        };
        var obj = { 
                url: APIData.url,
                type: APIData.type,
                data: data || APIData.data,
                successFn: successFn
            }
        ajax(obj);
    }

    function bindEvent() {
        var url=window.location.href;
        var eventsObj = {
            "goregister": function() {
                if (url.indexOf("r=lover")>=0) {//情人节活动跳转页面
                    window.location.href = "/register.html?r=lover";
                }else if (url.indexOf("reg_value=8")>=0){//票选活动跳转页面
                    window.location.href = "/reg_yiche.html?reg_value=8";
                }else if (url.indexOf("reg_value=9")>=0){//票选活动结果跳转页面
                    window.location.href = "/reg_yiche.html?reg_value=9";
                }else if (url.indexOf("reg_value=foolsDay")>=0){//愚人节活动跳转页面
                    window.location.href = "/register.html?reg_value=foolsDay";
                }else if (url.indexOf("r=10")>=0){//幸运专区跳转页面
                    window.location.href = "/register.html?r=10&id="+params["id"];
                }else{
                    window.location.href = "/register.html";
                }
            },            
        }
        E.actionMap("body",eventsObj);
        $("input").bind("keyup",function(){
            if($(this).val()){
                $(this).next().show();
            }else{
                $(this).next().hide();
            }
        })
        $(".cancelInput").bind("click",function(){
            $(this).prev().val("").end().hide();
        })
    }

    function init() {
        var fileds = [{
            name: 'user_name',
            rules: 'required|mobile'
        }, {
            name: 'pass_word',
            rules: 'required|password'
        }];
        validatorForm('logonForm', fileds, logon);
        bindEvent();
    }

    init();
})