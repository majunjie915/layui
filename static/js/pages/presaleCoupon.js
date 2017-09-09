define(function(require, exports) {
    var $ = require("jquery");
    var ajax = require("mod/common/ajax");
    var API = require("API");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    var validatorForm = require("mod/common/validatorForm");
    var util = require("mod/common/util");
    var template = require("template");
    require("site/template.helper");

    //var scroll = require("mod/common/scroll");

    var loadding = require("site/loadding.js");

    var loaddedPage = 1;
    var continueLoad = true;
    var inLoading = false;

    /*$(".loadMore").click(function(){
        get_list();
    });*/

    function getViewPort(){
        if (document.compatMode=="BackCompat") {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        }else{
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        }
    }

    window.onscroll = function(){
        var eleTop = $(".loadMore").get(0).getBoundingClientRect().top;
        var viewTop = getViewPort()["height"];
        if (eleTop < viewTop) {
            get_list();
        }
    }

    function get_list(data) {
    	if(!continueLoad) return false;
        if (inLoading) {
            return;
        }
        inLoading = true;
        $(".loadMore").text("拼命加载中...");
        var APIData = API.Coupons.get_presale_coupons;
        var data = {
            _vt : LS.get("_vt")||""
        }
        data.page  = loaddedPage;
        data.page_size = 10;

        var successFn = function(res) {

            var data = {
                list: res.presale_coupons
            };
            if(!res.presale_coupons || !res.presale_coupons.length){
            	continueLoad = false;
                /*if(loaddedPage==1){
                    $("#pullUp").hide();
                    $("#pullDown").hide();
                }*/
                $(".loadMore").hide();
                return;
            }else{
                $listEle.find(".emptyWrapper").hide();
                var html = template('couponT', data);
                $listEle.append(html);
                //$('.addCouponBtn').show();

                if (res.pagination.total<res.pagination.current_page*res.pagination.page_size) {
                    $(".loadMore").text("没有更多了");
                    continueLoad = false;
                    inLoading = false;
                }
            }

            loaddedPage ++;
            inLoading = false;
        }

        var beforeFn = function(){
        	loadding.create($listEle,1);
        }

        var afterFn = function(){
        	loadding.removeAll();
        }

        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            beforeFn:beforeFn,
            afterFn:afterFn,
            successFn: successFn
        }

        ajax(obj);
    }

    function bind_coupon(form){

    	var APIData = API.Coupons.bind_coupon;

        var successFn = function(res) {
            window.location.href = "./coupon.html"
        }
        var form = $("[name='" + form + "']");

        var data  = util.fromDataToJSON(form,true);
        data.user_id = LS.get("userId");
        
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }

    function bindEvent() {

        var eventsObj = {
            'gotoPage' : function(){
                location.href= './index.html';
            }
        }

        E.actionMap("body",eventsObj);
    }


    function init() {
        var data = {
            _vt : LS.get("_vt")||""
        }
        get_list(data);        
        bindEvent()

        /*var scrollObj = {
            pullUpFn:get_list
        }
        scroll(scrollObj);*/
    }

    var $listEle = $("#couponList");

    init();
})