define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var Swiper = require('swiper');

    require("site/template.helper");
    require("pwgmodal");
    //var scroll = require("mod/common/scroll");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var layer = require("mod/common/layer");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");

    var loaddedPage = 1;
    var continueLoad = true;
    var inLoading = false;
    //var myScroll;

    /*点击加载*/
    /*$(".loadMore").click(function(){
        get_list();
    });*/

    function getViewport(){
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
        var viewTop = getViewport()["height"];
        // var dh = $(".footer_bd").get(0).offsetHeight;
        
        if (eleTop < viewTop) {
            get_list();
        }
    }

    var get_list = function(data) {
        if (!continueLoad) return false;
        if (inLoading) return;
        inLoading = true;
        $(".loadMore").text("拼命加载中...");
        var APIData = API.faxian.get_activities_list;
        data = data || {};
        data.page = loaddedPage;
        //var params = util.toQueryParams();
        //data.city_code = $('#cur_city').html() === '全国' ? '' : params.city_code;

        var successFn = function(res) {
            var data = {
                list: res.recommended
            };

            if (!res.recommended || !res.recommended.length) {
                if (loaddedPage == 1) {
                    console.log("aaa");
                    var html = template('activeEmptyT', {});
                    $listEle.append(html);
                    
                }
                continueLoad = false;
                $(".loadMore").text("没有更多了");
                return;
            } else {
                for(i in res.recommended){
                    var displayNum = res.recommended[i].display_num;
                	if(res.recommended[i].params){
                		res.recommended[i].params.link_url = res.recommended[i].params.link_url + "?_vt="+LS.get('_vt');	
                	}
                    if (displayNum>99999) {
                        res.recommended[i].display_num = (displayNum/10000).toFixed(1)+"w";
                    }
                }
                var html = template('activitiesT', data);
                $listEle.append(html);
                lazyLoad.lazyImgLodding();
                inLoading = false;
                if (res.pagination.total < res.pagination.current_page*10) {
                    continueLoad = false;
                    inLoading = false;
                    $(".loadMore").text("没有更多了");
                }
            }

            loaddedPage++;
        }

        var beforeFn = function() {
            //loadding.create($listEle, 1);
        }

        var afterFn = function() {
            $(".pageLoadding").remove();
            $(".scrollDiv").show();
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
	

    function bindEvent() {
        var eventsObj = {
            "a": function() {
                showModal();
                slideBody();
                return;
            },
            "toPage": function() {
                var page = $(this).data("page");
                if (!LS.get("userId")) {
                    var arr = [
                        'address',
                        'addAddress',
                        'collect',
                        'coupon',
                        'editAddress',
                        'order',
                        'orderConfirm',
                        'orderDetail',
                        'self'
                    ]
                    if (($.inArray(page, arr) > -1) && !LS.get("userId")) {
                        /*if (page != "index") {
                            layer.open({
                                content: '您还没有登录,请登录',
                                style: 'background-color:#09C1FF; color:#fff; border:none;',
                                btn: ['确定','取消'],
                                yes: function() {
                                   
                                }
                            });
                        }*/

                        window.location.href = "./logon.html";
                    }
                } else {
                    window.location.href = "./" + page + ".html";
                }

                return;
            }
        }
        E.actionMap("body", eventsObj);
    }

   

    function init() {
        var param = util.toQueryParams();
        if(param._vt){
            LS.remove('_vt');
            LS.set('_vt',param._vt);
        }
        bindEvent();
        //get_banners();
        //get_coupons();
        //position();
        get_list();

        /*var scrollObj = {
            pullUpFn: get_list
        }
        myScroll = scroll(scrollObj);*/
    }

    var $listEle = $("#activities");

    init();
})