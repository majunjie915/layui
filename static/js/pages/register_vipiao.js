define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var E = require("mod/common/event")
    var util = require("mod/common/util");
    var Encrypt = require("mod/common/encrypt");
    var LS = require("mod/common/localStorage");
    var layer = require("mod/common/layer");
    var sms_captcha = require("mod/common/sms_captcha")
    var Encrypt = require("mod/common/encrypt");

    function get_user(userId) {
        var APIData = API.User.get_user_data;

        var successFn = function(res) {
            res.user.header = "http://static.vipiao.com/customer/header/" + res.user.id;
            $("#userName").text(res.user.nick_name);
            $("#userImg").attr("src",res.user.header);
        }

        if (!userId) {
            layer.open({
                content: "邀请人是谁？",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 2
            })
        }

        var formObj = {
            'user_id': userId,
            'is_rsa': false
        }

        var data = {
            rsa_str: Encrypt.encrypt(formObj)
        };
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

    function register(form) {
        var APIData = API.User.register;
        // cooperation代表的意义：
        // 0正常注册
        // 1明星衣橱
        // 2票务订阅活动
        // 4途牛
        // 5五月天
        // 6易车
        // 7美美理财
        // 10000校园推广活动  
        // 8票选活动   

        var successFn = function(res) {
            var url=window.location.href;
            LS.clear();
        	LS.set("userId",res.user.id);
            LS.set("_vt",res.token);
            LS.set("user",JSON.stringify(res.user));
            if(url.indexOf("reg_value=7")>=0){//register_vipiao.html?reg_value=7
                window.location.href = "./reg_s_ok.html?je=20";
            }else if (url.indexOf("reg_value=101")>=0) {//矿业大学迎新
                window.location.href = "/activity/ky/index.html";
            }else if (url.indexOf("register_vipiao")>=0) {//register_vipiao.html
                window.location.href = "./register_vipiao_ok.html";
            }else if (url.indexOf("register_c")>=0) {//校园活动register_c.html?reg_value=10001
                window.location.href = "./reg_v_ok.html";
            }else if (url.indexOf("reg_tuniu")>=0) {//途牛合作活动跳转页面
                window.location.href = "./reg_yiche_ok.html";
            }else if (url.indexOf("reg_yiche")>=0) {//易车合作活动跳转页面
                window.location.href = "/activity/rotate2/rotate.html";
            }else if (url.indexOf("reg_value=5")>=0) {//五月天合作活动跳转页面
                window.location.href = "./zhuce_ok.html";
            }else if (url.indexOf("reg_value=6")>=0) {//易车合作活动跳转页面
                window.location.href = "/activity/rotate2/rotate.html";
            }else if (url.indexOf("r=lover")>=0) {//情人节活动跳转页面
                window.location.href = "/dist/activity/valentinesDay/welfare.html";
            }else if (url.indexOf("reg_value=8")>=0) {//票选活动跳转页面
                window.location.href = "/activity/votingActivities/voting.html";
            }else if (url.indexOf("reg_value=9")>=0) {//票选活动结果跳转页面
                window.location.href = "/activity/votingActivities/activityResult.html";
            }else{
                window.location.href = "./reg_ok.html";
            }
            
        }

        // var smsCaptcha = LS.get("smsCaptcha0");

        var form = $("[name='" + form + "']");

        var formObj = util.fromDataToJSON(form,true);

        //formObj.is_rsa = false;

        var params = util.toQueryParams();

        formObj.invitation_activity_id = params.p||"";
        formObj.inviter_id = params.u||"";

        // if(formObj.captcha!=smsCaptcha){
        //     layer.open({
        //         content: "验证码不正确",
        //         style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
        //         time:1
        //     })
        //     return;
        // }

        var user_name = $("#registerForm [name=user_name]").val();
        var captcha = $("#registerForm [name=captcha]").val();
        var pass_word = $("#registerForm [name=pass_word]").val();
        var register_source = "h5";
        var cooperation = $("#registerForm [name=cooperation]").val();

        var data = {
            user_name:user_name,
            captcha:captcha,
            pass_word:pass_word,
            register_source:register_source,
            cooperation:cooperation
        };

        // var data = {
        //     rsa_str: Encrypt.encrypt(formObj)
        // };
        
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }
        ajax(obj);
    }

    function bindEvent() {
    	var eventsObj = {
    		
    	}
    	E.actionMap("body",eventsObj);
    }

    function init() {
        var tel_p = util.toQueryParams().tel;
        var reg_value = util.toQueryParams().reg_value;
        $("#user_name").attr("value",tel_p);
        if (reg_value && reg_value != 'undefined') {
            $("body").addClass("body"+reg_value); 
            $("#reg_value").attr("value",reg_value);
            $("#reg_img").attr('src','../static/images/activites/reg/reg_img'+reg_value+'.jpg'); 
        };

       var fileds = [{
            name: 'user_name',
            rules: 'required|mobile'
        }, {
            name:'captcha',
            rules:'required|captcha'
        }, {
            name: 'pass_word',
            rules: 'required|password'
        }, {
            name: 'read',
            rules: 'required'
        }];

        validatorForm('registerForm',fileds,register);
        
        sms_captcha(0);

        bindEvent();

        var params = util.toQueryParams();

        invitation_activity_id = params.p||"";
        inviter_id = params.u||"";

        if(inviter_id){
            get_user(inviter_id);
        }
    }

    init();
})