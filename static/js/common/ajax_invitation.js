define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var layer = require("mod/common/layer");    
    var DOMAIN = "http://test-a.vipiao.com"
    
    function successCallback(obj, res) {
        var url = DOMAIN + obj.url;        
        if (typeof res == "string") {
            res = JSON.parse(res);
        }
        if (res.status_code == 200) {            
            obj.successFn(res.data);
        } else if (res.status_code == 1003 || res.status_code == 1004 || res.status_code == 1005 || res.status_code == 1002) {
            layer.open({
                content: res.message,
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 2
            });
            setTimeout(function() {
                window.location.href = "./logon.html";
            }, 2000)
        } else {
            if (res.status_code == 1006){
                    layer.open({
                    content: res.message || "未知错误",
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    time: 2
                });
                setTimeout(function() {
                    if (obj.from==8) {
                        window.location.href = "./invitation_result2.html?f=8";
                    } else if(obj.from==9){
                        window.location.href = "./invitation_result2.html?f=9";
                    };
                    
                }, 2000)
            }
            layer.open({
                content: res.message || "未知错误",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 2
            });
        }
        obj.afterFn();
    }

    function failCallback(res) {
        layer.open({
            content: res.message,
            style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
            time: 2
        });
    }
    var get = function(obj) {
        var url = DOMAIN + obj.url;                
        $.get(url, obj.data)
            .done(function(res) {               
                successCallback(obj, res);
            }).fail(function(res) {
                failCallback(res)                
            })
    }

    var post = function(obj) {
        url = DOMAIN + obj.url;
        $.post(url, obj.data)
            .done(function(res) {
                successCallback(obj, res);
            }).fail(function(res) {
                failCallback(JSON.parse(res.responseText))
            })
    }
    var WPAjax = function(obj) {
        if (!obj.url) {
            console.log("请传递有效的请求地址");
            return;
        }       

        obj.type = obj.type.toLowerCase() || "get";
        obj.data = obj.data || {};
        obj.beforeFn = obj.beforeFn || function() {};
        obj.afterFn = obj.afterFn || function() {};
        obj.successFn = obj.successFn || function() {};
        obj.failFn = obj.failFn || function() {};

        obj.beforeFn();          

        if (obj.type == "get") {
            get(obj)
        } else if (obj.type == "post") {
            post(obj)
        }
    }

    return WPAjax;
})