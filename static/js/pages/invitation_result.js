define(function(require, exports) {    
    var $ = require("jquery");    
    var LS = require("mod/common/localStorage");    
    function init() {
        var user_tel =  JSON.parse(LS.get("user")).user_name;        
        $("#text").empty().append("优惠券已放入账号 <span>"+user_tel+"</span>"); 
    }    
    init();
})