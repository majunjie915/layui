define(function(require, exports) {    
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var Swiper = require('swiper');
    
    require("pwgmodal");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    //var layer = require("mod/common/layer");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");

    var loaddedPage = 1;
    var pageLength = 10;
    var continueLoad = true;
    var sort = 0;
    var time = 0;
    var inLoading = false;

    (function (doc, win) {
        var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            };          
            recalc();
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
            doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);

    function getProgramCategory(){
        if (!LS.get("classify_id")) {
            LS.set("classify_id",1);
        }

        var APIData = API.Program.programList;
        var data = data || {};
        data.page = loaddedPage;
        data.page_size = pageLength;
        data.sort = sort;
        data.time = time;

        var params = util.toQueryParams();
        data.city_code = params.city_code ? params.city_code : '';
        var category_id = LS.get("classify_id");
        data.category_id = category_id;
        var successFn = function(res) {
            var program_category = {
                list: res.program_category
            };
            var html = template("bannerT",program_category);
            $("#bannerList").append(html);

            swipeBanner();
            get_list();

            var elementLi = $(".ul_nav li");
            elementLi.click(function(){
                var classifyID = $(this).attr("name"); 
                $(this).addClass("show").siblings().removeClass("show");
                LS.set("classify_id",classifyID);
                pageLength = 10;
                var curUrl = window.location.href;
                get_list();
                window.location.href = "/list.html";
            });
        }
        var beforeFn = function() {
            
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

    var swipeBanner = function() {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 4.5,
            paginationClickable: true,
            // spaceBetween: 10
        });
    };

    /*监听加载更多*/
    /*$(".loadMore").click(function(){
        if (continueLoad) {
            pageLength = pageLength+10;
            get_list();
        } else{
            $(".loadMore").text("——— 没有更多了 ———");
            return;
        };
        
    });*/

    // 获取视窗宽高
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
        var ele = $(".loadMore").get(0);
        var eleTop = ele.getBoundingClientRect().top;
        var viewTop = getViewPort()["height"];
        // var dh = $(".footer_bd").get(0).offsetHeight;
        if (eleTop < viewTop) {
            get_list();
        }
    }

    var get_list = function(data) {
        if (continueLoad==false) {
            return;
        }
        if (inLoading) {
            return;
        }
        inLoading = true;
        $(".loadMore").html("拼命加载中...");

        var APIData = API.Program.programList;
        data = data || {};
        data.page = loaddedPage;
        data.page_size = pageLength;
        data.sort = sort;
        data.time = time;
        var params = util.toQueryParams();
        data.city_code = params.city_code ? params.city_code : '';
        // var category_id = params.category_id ? params.category_id : '1';
        var category_id = LS.get("classify_id");
        data.category_id = category_id;

        $(".ul_nav li").removeClass();
        $("[name="+"'"+category_id+"'"+"]").addClass("show");

        // 使选中的分类处于视窗内
        var swiperSlides = $(".swiper-slide");
        var curCategory = $(".show").attr("name");
        var totalInstance = 0;
        for (var i = 0; i < swiperSlides.length; i++) {
            var actualIntance = swiperSlides[i].offsetWidth;
            totalInstance+=actualIntance;
        }
        if (curCategory != 1 && curCategory != 2 && curCategory != 6 && curCategory != 7) {
            $("#bannerList").attr("style","transform:translate3d("+(-totalInstance+actualIntance)/2+"px,0,0)");
        }

        var successFn = function(res) {
            var data = {
                list: res.programs
            };
            fillContext();
            function fillContext(){
                var html = template("dataList",data);
                $("#programList").append(html);
                
                var totalProgram = res.pagination.total;
                inLoading = false;
                loaddedPage ++;
                if(totalProgram == 0){
                    $("#programList").html("<img class='no_icon' src='../static/images/no_icon.png'><span class='no_txt'>暂时没有项目哟~</span>");
                    $(".loadMore").hide();
                }else{ 
                    $(".loadMore").show();                    
                    if (totalProgram<res.pagination.current_page*pageLength) {
                        continueLoad = false;
                        inLoading = false;
                        $(".loadMore").text("没有更多了");
                        // $(".loadMore").unbind("click");
                    }
                } 
            }

        }
        var beforeFn = function() {
            //loadding.create($listEle, 1);
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
    var showModal = function() {
        $.pgwModal({
            target: '#modalContent',
            titleBar: false
        });
    }

    function bindEvent() {
        var eventsObj = {
            "toPage": function() {
                var id = $(this).data("id");
                window.location.href = "/activeDetail.html?id="+id;
            },
            "screen": function() {
                if ($(this).hasClass('btn_top_screen2')) {
                    $(this).removeClass('btn_top_screen2');
                } else{
                    $(this).addClass('btn_top_screen2');
                };
                if($('.selCont').css("display")=="none"){
                    $('.selCont,.bgDiv').css("display","block");  
                }else{ 
                    $('.selCont,.bgDiv').css("display","none"); 
                } 
            },
            "timeFrame":function(){
                $(this).siblings().removeClass("cur1").end().addClass("cur1");
                if($('.selTime').css("display")=="none"){
                    $('.selSorttype').css("display","none");
                    $('.selTime').css("display","block");  
                }
            },
            "sortFrame":function(){
                $(this).siblings().removeClass("cur1").end().addClass("cur1");
                if($('.selSorttype').css("display")=="none"){
                    $('.selTime').css("display","none");
                    $('.selSorttype').css("display","block");  
                }
            },
            "goTime":function(){
                $(this).siblings().removeClass("cur2").end().addClass("cur2");
                time = $(this).data("time");
                $('.selCont,.bgDiv').css("display","none"); 
                continueLoad = true;
                pageLength = 10;
                loaddedPage = 1;
                $(".loadMore").text("加载更多");
                $("#programList").html("");
                get_list(); 
            },
            "goSort":function(){
                $(this).siblings().removeClass("cur2").end().addClass("cur2");
                sort = $(this).data("sort");
                $('.selCont,.bgDiv').css("display","none"); 
                continueLoad = true;
                pageLength = 10;
                loaddedPage = 1;
                $(".loadMore").text("加载更多");
                $("#programList").html("");
                get_list(); 
            },
            "bgDiv":function(){
                $('.selCont,.bgDiv').css("display","none"); 
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
        getProgramCategory();
    }
    init();
})