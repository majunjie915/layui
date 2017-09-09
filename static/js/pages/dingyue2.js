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
    // var Encrypt = require("mod/common/encrypt");
    function postSub(form) {
        var APIData = API.Subscribe.postSubscribe2;
        var data = {            
            activity_type:$('#activity_type').val(),
            date:$('#date').val(),
            position:$("#position").val(),
            price: $("#price").val(),
            travel_service:$('#travel_service').val(),
            support:$('#support').val(),
            lottery:$("#lottery").val(),
            other: $("#other").val(),
            mobile:$("#mobile").val(),
            wechat: $("#wechat").val(),
        }

        var successFn = function(res) {

            if(res.is_register == 1){
                window.location.href = "./reg_ok.html";
            }
            else{
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
            name: 'activity_type',
            rules: 'required'
        }, {
            name: 'position',
            rules: 'required'
        }, {
            name: 'travel_service',
            rules: 'required'
        }, {
            name: 'support',
            rules: 'required'
        }, {
            name: 'lottery',
            rules: 'required'
        }, {
            name: 'wechat',
            rules: 'required'
        },{
            name: 'price',
            rules: 'required'
        },{
            name: 'mobile',
            rules: 'required|mobile'
        }];
        validatorForm('dingyueForm', fileds, postSub);
        bindEvent();       
    }
    init();
})