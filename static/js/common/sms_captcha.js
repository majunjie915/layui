define(function(require, exports) {
    var $ = require("jquery");
    var layer = require("mod/common/layer");
    var ajax = require("mod/common/ajax");
    var API = require("site/config");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    var Encrypt = require("mod/common/encrypt");

    var is_tangkuang = false;
    var isSendSms = false;
    var $sendBtn = $(".getCode");

    function getMobileRegCode(mobile, type) {
        var APIData = API.User.sms_captcha;
        var data = {
            phone: mobile,
            mode: type,
        };
        function successFn(res) {
        	// LS.set("smsCaptcha"+type,res.captcha);
        	isSendSms = true;
        	mmobilelogincountresent(60)
        }       
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }
    //倒计时
    function mmobilelogincountresent(resendtime) {
        var sel = setInterval(function() {
            resendtime--;
            if (resendtime == 0) {

                // $sendBtn.removeAttr("disabled").removeClass("countdown");
                $sendBtn.text("获取验证码");
                
                isSendSms = false;
                clearInterval(sel);
                return;
            }
            $sendBtn.attr("disabled", "disabled").addClass("countdown");
            $sendBtn.text(resendtime + "秒");
            
            
            
        }, 1000);
    }
    function init(type) {
        var eventsObj = {
            sendSms: function() {
                var mobile = $("[name=user_name]").val();
                if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/.test(mobile)) {
                    layer.open({
                        content: "填写正确的手机号码",
                        style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                        time:1
                    })
                    return false;
                }
                if(isSendSms) return;
                getMobileRegCode(mobile, type);
            }
        }
        E.actionMap("body", eventsObj);
    }    
    //init();
    return init;
})