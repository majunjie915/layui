define(function(require, exports) {
    var $ = require("jquery");
    // var API = require("API");
    // var template = require("template");
    // var ajax = require("mod/common/ajax");
    // var validatorForm = require("mod/common/validatorForm");
    // var E = require("mod/common/event")
    var util = require("mod/common/util");
    // var Encrypt = require("mod/common/encrypt");
    var LS = require("mod/common/localStorage");
    // var layer = require("mod/common/layer");
    // var sms_captcha = require("mod/common/sms_captcha")
    // var Encrypt = require("mod/common/encrypt");
    // function bindEvent() {
    // 	var eventsObj = {    		
    // 	}
    // 	E.actionMap("body",eventsObj);
    // }
    function init() {
        var je = util.toQueryParams().je;        
        if (je && je != 'undefined') {            
            $("#je").html(je);            
        }else{
            $("#je").html("0"); 
        };
        // bindEvent();        
    }

    init();
})