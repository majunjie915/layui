define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var E = require("mod/common/event");
    var util = require("mod/common/util");
    var LS = require("mod/common/localStorage");
    // var Encrypt = require("mod/common/encrypt");

    function changePassWord(form) {
        var APIData = API.User.change_pass_word;

        var successFn = function(res) {
            if(res.user.id){
                LS.clear();
                LS.set("userId",res.user.id);
                LS.set("user",JSON.stringify(res.user));
            }
            
        	window.location.href = "./index.html";
        }

        var form = $("[name='" + form + "']");
        var formObj = util.fromDataToJSON(form,true);
       
        var user_name = LS.get("changePassUsername");        
        var captcha = LS.get("changeCaptchaCode");
        var pass_word = $("#registerForm [name=pass_word]").val();
        
        var data = {
            user_name:user_name,
            pass_word:pass_word,
            captcha:captcha
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
    	var eventsObj = {
    	}
    	E.actionMap("body",eventsObj);
    }

    function init() {
        var fileds = [{
            name: 'pass_word',
            rules: 'required|password'
        }, {
            name:'confirm',
            rules:'required|matches[pass_word]'
        }];

        validatorForm('registerForm',fileds,changePassWord);

        bindEvent();
    }

    init();
})