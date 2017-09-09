/**
 * 网站公用的ajax处理函数
 * @author flyking
 * @date 2015-09-07
 *
    var obj = {
       url:API.Home.get_banners.url,
       type:API.Home.get_banners.type, 
    }
 */
layui.define(['jquery', 'layer'] , function(exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var DOMAIN = "http://test-a.vintop.cn";
    var STATUS_CODE = {
        0: "成功",
        1: "失败",
        1001: '没有权限',
    }
    function successCallback(obj, res) {
        var url = /*DOMAIN + */obj.url;        
        if (typeof res == "string") {
            res = JSON.parse(res);
        }
        if (res.status_code == 200) { 
            obj.successFn(res.data);
        } else if (res.status_code == 1) {
            obj.failFn(res.data);
        } else if (res.status_code == 12) {
            layer.open({
                content: "已经使用过该优惠券了,到我的订单里支付",
                time: 2
            });
            setTimeout(function() {
                window.location.href = "./order.html";
            }, 2000)
        }else if (res.status_code == 1003 || res.status_code == 1004 || res.status_code == 1005 || res.status_code == 1002) {
            layer.open({
                content: res.message,
                time: 2
            });
            setTimeout(function() {
                window.location.href = "./logon.html";
            }, 2000)
        } else if (res.status_code == 540106) {
            layer.open({
                content: res.message,
                time: 2
            });
            setTimeout(function() {
                window.history.go(-1);
            }, 2000)
        } else {
            if (res.status_code == 1006 && obj.from==8) {
                layer.open({
                    content: res.message || "未知错误",
                    time: 2
                });
                setTimeout(function() {
                    window.location.href = "./invitation_result2.html?f=8";                    
                }, 2000)
            } else if (res.status_code == 1006 && obj.from==9){
                layer.open({
                    content: res.message || "未知错误",
                    time: 2
                });
                setTimeout(function() {
                    window.location.href = "./supprot_ok.html";                    
                }, 2000)
            };
            
            layer.open({
                content: res.message || "未知错误",
                time: 2
            });
        }
        obj.afterFn();
    }

    function failCallback(res) {
        layer.open({
            content: res.message,
            time: 2
        });

    }

    var isIE = function(){
        var u = navigator.userAgent;
        if(u.indexOf('Trident') > -1 && !window.FormData){
            return false; 
        }else{
            return true;
        }

    }

    var get = function(obj) {
        var url = /*DOMAIN + */obj.url; 
        if (isIE()) {
            $.get(url, obj.data)
            .done(function(res) {               
                successCallback(obj, res);
            }).fail(function(res) {
                failCallback(res)
            })
        }else{ //解决IE9及以下浏览器跨域请求
            var xdr = new XDomainRequest();
            /* 对象形式的数据 需要转换成键值对的数据字符串  XHR对象需要 */
            var data2str = '';
            for(var key in obj.data){
                data2str += key+'='+obj.data[key]+'&';
            }
            /*需要去掉最后一个&*/
            data2str = data2str && data2str.slice(0,-1);

            if (data2str == '' || data2str == ' ') {
                data2str = data2str;
            } else{
                data2str = '?'+data2str;
            };            

            xdr.onload = function() {
                successCallback(obj, JSON.parse(xdr.responseText));
            };
            xdr.onerror = function() {
                failCallback(JSON.parse(xdr.responseText))
            };
            xdr.open("get", url+data2str);
            xdr.send();
        };        
    }

    var post = function(obj) {
        var url = DOMAIN + obj.url; 
        if (isIE()) {
            $.post(url, obj.data)
            .done(function(res) {
                successCallback(obj, res);
            }).fail(function(res) {
                failCallback(JSON.parse(res.responseText))
            })
        }else{ //解决IE9及以下浏览器跨域请求
            var xdr = new XDomainRequest();
            xdr.contentType = "text/plain";
            /* 对象形式的数据 需要转换成键值对的数据字符串  XHR对象需要 */
            var data2str = '';
            for(var key in obj.data){
                data2str += key+'='+obj.data[key]+'&';
            }
            
            /*需要去掉最后一个&*/
            data2str = data2str && data2str.slice(0,-1);

            if (data2str == '' || data2str == ' ') {
                data2str = data2str;
            } else{
                data2str = '?'+data2str;
            };
            xdr.onload = function() {
                successCallback(obj, JSON.parse(xdr.responseText));
            };
            xdr.onerror = function() {
                failCallback(JSON.parse(xdr.responseText))
            };
            //xdr.contentType('Content-Type','application/x-www-form-urlencoded');


            xdr.open("post", url+data2str);
            xdr.send();
        };        
    }    

    var WPAjax = function(obj) {
        if (!obj.url) {
            console.log("请传递有效的请求地址");
            return;
        }
        if(!obj || typeof obj != 'object') return false;

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

    exports('ajax', WPAjax);
})
