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


    function postSub(form) {
        var APIData = API.Subscribe.postSubscribe;
        var data = {            
            star:$('#sel_mingxing').val(),
            city:$('#sel_city').val(),
            mobile:$("#tel").val(),
            price: $("#piaojia").val(),
        }

        var successFn = function(res) {

            if(res.is_register == 1){
                //return;
                window.location.href = "./reg_ok_app.html";
            }
            else{
                //return;
                window.location.href = "./reg.html?tel="+res.mobile;
            }            
        }

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
        E.actionMap("body", eventsObj);
    }

    function init() {
        var fileds = [{
            name: 'sel_mingxing',
            rules: 'required'
        }, {
            name: 'sel_city',
            rules: 'required'
        },{
            name: 'piaojia',
            rules: 'required|integer'
        },{
            name: 'user_name',
            rules: 'required|mobile'
        }];
        validatorForm('dingyueForm', fileds, postSub);
        bindEvent();       
    }
    init();
})