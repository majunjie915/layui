define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    // var Swiper = require('swiper');
    
    require("pwgmodal");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    //var layer = require("mod/common/layer");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");

    var loaddedPage = 1;
    var continueLoad = true;
    var myScroll;    

    var get_list = function(data) {
        var APIData = API.Home.get_list;
        data = data || {};
        data.page = loaddedPage;
        var params = util.toQueryParams();
        data.city_code = $('#cur_city').html() === '全国' ? '' : params.city_code;
        // data._vt= LS.get("_vt");

        var successFn = function(res) {
            var data = {
                list: res.programs
            };
            console.log(data);
            
        }

        var beforeFn = function() {
            //loadding.create($listEle, 1);
        }

        var afterFn = function() {
            
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
    var showModal = function() {
        $.pgwModal({
            target: '#modalContent',
            titleBar: false
        });
    }

    function bindEvent() {
        var eventsObj = {
            "toPage": function() {
               
            },
			"gotoActive":function(){
                window.location.href = $(this).data("href");
            }
        }
        E.actionMap("body", eventsObj);
    }

    function position() {
        var url = util.toQueryParams();
        var city_name = url.city_name ? url.city_name : '全国';
		var reg=/市$/gi;
        $('#cur_city').html(city_name.replace(reg,""));
    }

    function init() {
		bindEvent();
        position();
        get_list();
		var scrollObj = {
            pullUpFn: get_list
        }
        

    }

    init();
})