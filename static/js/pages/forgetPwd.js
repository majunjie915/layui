define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var E = require("mod/common/event");
    var util = require("mod/common/util");
    var LS = require("mod/common/localStorage");
    var layer = require("mod/common/layer");
    var sms_captcha = require("mod/common/sms_captcha")
    // var Encrypt = require("mod/common/encrypt");

    function forgetPwd(form) {
        var form = $("[name='" + form + "']");
        var formObj = util.fromDataToJSON(form,true);

        // var smsCaptcha = LS.get("smsCaptcha1");
        // if(formObj.captcha!=smsCaptcha){
        //     layer.open({
        //         content: "验证码不正确",
        //         style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
        //         time:1
        //     })
        //     return;
        // }
        
        LS.set("changePassUsername",formObj.user_name);
        LS.set("changeCaptchaCode",formObj.captcha);

        window.location.href = "./editPwd.html";
    }

    function bindEvent() {
        var eventsObj = {}
        E.actionMap("body", eventsObj);
    }

    function init() {
        var fileds = [{
            name: 'user_name',
            rules: 'required|mobile'
        }, {
            name: 'captcha',
            rules: 'required|captcha'
        }];
        validatorForm('forgetForm', fileds, forgetPwd);
        sms_captcha(1);
        bindEvent();
    }

    init();
})