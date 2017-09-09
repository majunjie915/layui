define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad"); 
    var layer = require("mod/common/layer"); 

    var get_supprot = function(data) {
        var APIData = API.support.get_support;
        data = data || {};
        var successFn = function(res) {
            // 调用倒计时函数
            timeStamp(res.support.remaining_time);
            //获取应援活动           
            var html = template('supprotInfoT', res.support);
            $("#supprotInfo").empty().append(html);
        }
        var beforeFn = function() {
        }
        var afterFn = function() {
            $(".pageLoadding").remove();            
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            beforeFn: beforeFn,
            afterFn: afterFn,
            successFn: successFn
        }
        ajax(obj);
    }

    //倒计时
    function timeStamp( second_time ){
        var sel = setInterval(function() {  
            var time = parseInt(second_time) + "秒";
            var min = 0;
            var hour = 0;
            var day = 0;                        
            if( parseInt(second_time )> 60){
                var second = parseInt(second_time) % 60;  
                var min = parseInt(second_time / 60); 
                min = min < 10 ? '0' + min : '' + min;
                second = second < 10 ? '0' + second : '' + second; 
                time = min + "分" + second + "秒";              
                if( min > 60 ){
                    min = parseInt(second_time / 60) % 60;
                    min = min < 10 ? '0' + min : '' + min;  
                    var hour = parseInt( parseInt(second_time / 60) /60 ); 
                    hour = hour < 10 ? '0' + hour : '' + hour; 
                    time = hour + "小时" + min + "分" + second + "秒";        
                    if( hour > 24 ){  
                        hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                        hour = hour < 10 ? '0' + hour : '' + hour;  
                        var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                        day = day < 10 ? '0' + day : '' + day;   
                        time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
                    }  
                }     
            }
            if (parseInt(second_time ) <= 0) {
                $("#countdown").html("活动已结束！");
                clearInterval(sel);
                return;
            } else{
                $("#countdown").html('距现在 '+time+' 结束');
            };            
            second_time--;
        }, 1000);
    }

    function bindEvent() {
        var params = util.toQueryParams();
        var id = params['id'] ;        
        var eventsObj = {
            "btngo": function() {
                window.location.href = "./supprot_reg.html?id="+id;
            }
        }
        E.actionMap("body", eventsObj);
    }
    function init() {
    var params = util.toQueryParams();
        var data = {
            support_id: params.id || ""
        }
        bindEvent();
        get_supprot(data);        
    }
    var support_id = '';
    init();
})