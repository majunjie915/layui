define(function(require, exports) {
    var $ = require("jquery");
    var E = require("mod/common/event");
    var ajax = require("mod/common/ajax");
    var API = require("API");
    var LS = require("mod/common/localStorage");
    var layer = require("mod/common/layer");
    var util = require("mod/common/util");

    function bindEvent() {
        var eventsObj = {
            //模拟href跳转
            "location": function() {
                location.href = $(this).data("goto");
            },
            //检验登录，如果未登录跳转到登录页面
             "redirect":function() {
                if(!LS.get("userId")){
                    location.href="logon.html";
                } else {
                    // $(this).trigger('location');
                    location.href = $(this).data("goto");
                }
            },
            //模拟表单提交
            "submit": function() {
                var selector = '#' + $(this).data('submit-target');
                $(selector).submit();
            },
            "cancelInput": function() {
                $(this).prev().val("").end().hide();
            },
            "cancelCollect": function() {
                var nowTime = new Date().getTime();
                if(lastclicktime == 0){
                    lastclicktime = nowTime;
                }else{
                    if(nowTime - lastclicktime <= clicklimit){
                        /*layer.open({
                            content: '请不要频繁点击',
                            style: 'background-color:#09C1FF; color:#fff; border:none;',
                        });*/
                        return;
                    }else{
                        lastclicktime = nowTime;
                    }
                }
                var arg = arguments[0];
                var APIData = API.Collection.delete;
                var data = data || {};
                var me = $(this);
                // data.user_id = LS.get("userId");
                data._vt = LS.get("_vt");
                data.program_id = $(this).data("program-id");
                var successFn = function(res) {
                    me.removeClass("collected").attr("data-action", "doCollect");
                    
                    if (arg["action-type"] == "removeMe") {
                        var parentLi = me.parents("li");
                        var parentUl = me.parents("ul");
                        if (parentLi.siblings().length > 1) {
                            parentLi.remove();
                        } else {
                            parentLi.remove();
                            parentUl.find(".emptyWrapper").show();
                        }


                    }
                }

                var obj = {
                    url: APIData.url,
                    type: APIData.type,
                    data: data || APIData.data,
                    successFn: successFn
                }

                ajax(obj);
            },
            "doCollect": function() {
                var nowTime = new Date().getTime();
                if(lastclicktime == 0){
                    lastclicktime = nowTime;
                }else{
                    if(nowTime - lastclicktime <= clicklimit){
                        /*layer.open({
                            content: '请不要频繁点击',
                            style: 'background-color:#09C1FF; color:#fff; border:none;',
                        });*/
                        return;
                    }else{
                        lastclicktime = nowTime;
                    }
                }
                var APIData = API.Collection.add;
                var data = data || {};
                var me = $(this);

                var successFn = function(res) {
                    //LS.set("collections",data.program_id);
                    me.addClass("collected").attr("data-action", "cancelCollect");
                }
                if (!LS.get("_vt")) {
                    LS.set("loginPage",window.location.href);
                    location.href="./logon.html";
                }
                // data.user_id = LS.get("userId");
                data._vt = LS.get("_vt");
                data.program_id = $(this).data("program-id");
                data.scene_id = $(this).data("scene-id");
                var obj = {
                    url: APIData.url,
                    type: APIData.type,
                    data: data || APIData.data,
                    successFn: successFn
                }
                ajax(obj);

            },
            "gotoPage": function() { //子页面切换
                var selector = '#' + $(this).data('goto');
                var target = $(selector);
                $('#mainArticle,.subArticle').hide();
                target.show();
            }
        }
        E.actionMap("body", eventsObj);

        //解决 safari 不能触发actionMap的click问题。
         // $('[data-action]').on('click',function(){});
         $(document).on('click', '[data-action]', function(){});
    }
    
    //根据subPage参数，检查是否要跳转子页面，比如用户协议subPage=protocol-article
    function judgeSubPage(){
        var url = util.toQueryParams();
        var subPageId = url.subPage;
        if(url.subPage) {
            var selector = '#' + url.subPage;
            $('#mainArticle,.subArticle').hide();
            $(selector).show();
        }
    }

    function checkLogon() {
        var strUrl = window.location.href;
        var arrUrl = strUrl.split("/");
        var strPage = arrUrl[arrUrl.length - 1];
        var indexof = strPage.indexOf("?");
        if (indexof != -1) {
            strPage = strPage.substr(0, strPage.indexOf("?"));
        }

        strPage = strPage.substr(0, strPage.length - 5);
        var arr = [
            'address',
            'addAddress',
            'collect',
            'coupon',
            'editAddress',
            'order',
            'orderConfirm',
            'orderDetail'
            // 'gobuy'
        ]
        if (($.inArray(strPage, arr) > -1) && !LS.get("_vt")) {
            if (strPage != "index") {
                layer.open({
                    content: '您没有登录',
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    time: 2
                });               

                setTimeout(function() {
                    LS.clear();                    
                    LS.set("loginPage",window.location.href);
                    window.location.href = "./logon.html";
                }, 2000);
            }
        }
    }

    function init() {
        bindEvent();
        checkLogon();
        judgeSubPage();
    }

    init();
    var lastclicktime = 0;
    var clicklimit = 5000;

})