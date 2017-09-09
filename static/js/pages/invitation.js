define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var E = require("mod/common/event")
    var util = require("mod/common/util");
    var layer = require("mod/common/layer");
    var LS = require("mod/common/localStorage");
    var sms_captcha = require("mod/common/sms_captchainvitation")
    //邀请好友注册
    function register(form) {
        var APIData = API.User.register;
        var params = util.toQueryParams();
        var inviter = params.inviter;

        var successFn = function(res) {
            LS.clear();
            LS.set("userId",res.user.id);
            LS.set("_vt",res.token);
            LS.set("user",JSON.stringify(res.user));
            window.location.href = "./invitation_result1.html?f=invit";            
        }

        var form = $("[name='" + form + "']");
        var formObj = util.fromDataToJSON(form,true); 
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
            cooperation:cooperation,
            inviter:inviter
        };        
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }
        ajax(obj);
    }
    // 应援活动注册
    function register_supprot(form) {
        var APIData = API.User.register;
        var params = util.toQueryParams();
        var support_id = params.id;

        var successFn = function(res) {
            LS.clear();
            LS.set("userId",res.user.id);
            LS.set("_vt",res.token);
            LS.set("user",JSON.stringify(res.user));
            window.location.href = "./supprot_ok.html";            
        }

        var form = $("[name='" + form + "']");
        var formObj = util.fromDataToJSON(form,true); 
        var user_name = $("#registerForm_sup [name=user_name]").val();
        var captcha = $("#registerForm_sup [name=captcha]").val();
        var pass_word = $("#registerForm_sup [name=pass_word]").val();
        var register_source = "h5";
        var cooperation = $("#registerForm_sup [name=cooperation]").val();

        var data = {
            user_name:user_name,
            captcha:captcha,
            pass_word:pass_word,
            register_source:register_source,
            cooperation:cooperation,
            param:support_id
        };        
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }
        ajax(obj);
    }

    function bindEvent() {
        var params = util.toQueryParams();
        var inviter = params.inviter;
        var eventsObj = {
			"getCoup":function(){
                window.location.href = "./invitation_reg.html?inviter=" + inviter;
            }
        }
        E.actionMap("body", eventsObj);
    }
    function init() {
        var fileds = [{
            name: 'user_name',
            rules: 'required|mobile'
        }, {
            name:'captcha',
            rules:'required|captcha'
        }, {
            name: 'pass_word',
            rules: 'required|password'
        }];

        validatorForm('registerForm',fileds,register);        
        validatorForm('registerForm_sup',fileds,register_supprot);        
        sms_captcha(0);
		bindEvent();
    }    
    init();
})