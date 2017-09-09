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
    var loadding = require("site/loadding.js");
    var continueLoad = true;

    function get_list() {
    	if(!continueLoad) return false;
        var APIData = API.Coupons.get_coupons;
        var data = {
            _vt : LS.get("_vt")||""
        }
        var successFn = function(res) {

            var data = {
                list: res.coupon
            };
            if(!res.coupon || !res.coupon.length){
            	continueLoad = false;

            	return;
            }else{
            	$listEle.find(".emptyWrapper").hide();
                $(".addCoupons").show();
            	var html = template('couponT', data);
                $listEle.append(html);
                $('.addCouponBtn').show();

            }
        }

        var beforeFn = function(){
        	//loadding.create($listEle,1);
        }

        var afterFn = function(){
        	$(".pageLoadding").remove();
            $("#mainArticle").show();
            $(".scrollDiv").show();
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
        data._vt = LS.get("_vt");
        
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }


        ajax(obj);
    }

    function bind_coupon_password(form){

        var APIData = API.Coupons.bind_coupon_password;

        var successFn = function(res) {
            window.location.href = "./coupon.html"
        }
        var form = $("[name='" + form + "']");

        var data  = util.fromDataToJSON(form,true);
        data._vt = LS.get("_vt");
        
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
            
        }

        E.actionMap("body",eventsObj);
    }


    function init() {
        var data = {
            _vt : LS.get("_vt")||""
        }
        get_list(data);

        var fileds = [{
            name: 'account_number',
            //优惠券卡号暂时没有规则
            // rules: 'required|accountNum'
            rules: 'required'
        }, {
            name: 'pass_word',
            // rules: 'required|accountPwd'
            rules: 'required'
        }];
        validatorForm('addCouponForm',fileds,bind_coupon);

        var fileds2 = [{
            name: 'password',
            // rules: 'required|accountPwd'
            rules: 'required'
        }];
        validatorForm('addCouponPasswordForm',fileds2,bind_coupon_password);


        bindEvent()

        var scrollObj = {
            pullUpFn:get_list
        }
        //myScroll = scroll(scrollObj);
    }

    var $listEle = $("#couponList");

    init();
})