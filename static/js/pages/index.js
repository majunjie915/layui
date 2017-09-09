define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var Swiper = require('swiper');
    // require("pwgmodal");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var layer = require("mod/common/layer");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");
    var page = 1;
    var pageSize = 10;
    var hasMore = true;
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

    var get_list2 = function(data) {
        if (hasMore==false) {
            return;
        }
        if (inLoading) {
            return;
        }
        inLoading = true;
        document.getElementById("more").innerHTML = "拼命加载中...";
        
        var APIData = API.homeData.getHomeData;
        data = data || {};
        data.page = page;
        data.page_size = pageSize;
        var successFn = function(res) {
            
            // xxx推荐
            var total = res.program_list.pagination.total;
            LS.set("total",total);
            var data = {
                list: res.program_list.programs
            };
            if (!res.program_list || !res.program_list.programs.length) {
                var html = template('activeEmptyT', {});
                $listEle.append(html);
            }else {
                $listEle.find(".emptyWrapper").hide();
                var html = template('activeT', data);
                $listEle.append(html);
            }

            inLoading=false;
            if (res.program_list.pagination.total<=res.program_list.pagination.current_page*pageSize) {
                hasMore=false;
                inLoading=false;
                document.getElementById("more").innerHTML='没有了，就这些';
            }
            page ++;
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

    window.onscroll = function(){
        var loadMoreEle = document.getElementById("more");
        // 获取元素到视窗顶部距离
        var eleTop = loadMoreEle.getBoundingClientRect().top;
        // 获取视窗高度
        var viewTop = getViewPort()["height"];
        // var dh = $(".downImg").get(0).offsetHeight+$(".footer_bd").get(0).offsetHeight;
        
        if (eleTop < viewTop) {
            get_list2();
        }
    }

    /*$(".loadMore").click(function(){
        page++;
        LS.set("allPage",page);
        get_list2();
        if (LS.get("total")) {
            var nums = pageSize*Number(LS.get("allPage"));
            console.log(nums);
            if (LS.get("total")<=nums) {
                $(".loadMore").text("没有更多了");
                $(".loadMore").unbind();
            }
        }
    })*/

    if (LS.get("total") && !LS.get("allPage")) {
        var nums = pageSize;
        if (LS.get("total")<=nums) {
            $(".loadMore").text("没有更多了");
            $(".loadMore").unbind();
        }
    }    

    var get_list = function(data) {
        var APIData = API.homeData.getHomeData;
        data = data || {};
        data.page = page;
        data.page_size = pageSize;
        var successFn = function(res) {
            // banner
            var bannerdata = {
                list: res.banner
            };           
           
            var html = template('bannerT', bannerdata);
            $("#bannerList").append(html);
            
            // 演出分类导航
            var menudata = {
                list: res.program_category
            };
            
            var html = template('menuT', menudata);
            $("#menuList").append(html);
            
            // 固定图片导航
            if(res){
                /*if(!res.left_banner.pic){
                    res.lower_right_banner.pic =  "/static/images/index/index_picnav1.jpg"
                }
                if(!res.upper_right_banner.pic){
                    res.lower_right_banner.pic =  "/static/images/index/index_picnav2.jpg"
                }
                if(!res.lower_right_banner.pic){
                    res.lower_right_banner.pic =  "/static/images/index/index_picnav3.jpg"
                }*/
                var html = template('menupicT', res);
                $("#menupic").append(html);
            }
            // 推荐节目
            var data = {
                list: res.recommend_program
            };
            
            var html = template("hotP", data);
            $("#hotProgram").append(html);
            
            // xxx推荐
            var total = res.program_list.pagination.total;
            LS.set("total",total);
            var data = {
                list: res.program_list.programs
            };
            if (!res.program_list || !res.program_list.programs.length) {
                var html = template('activeEmptyT', {});
                $listEle.append(html);
            }else {
                $listEle.find(".emptyWrapper").hide();
                var html = template('activeT', data);
                $listEle.append(html);
            }
            // 预售列表
            var pcdata = {
                list: res.presale_coupon
            };
            var html = template('couponsT', pcdata);
            $("#couponList").append(html);
                     
			page ++;
        }
        var beforeFn = function() {
            //loadding.create($listEle, 1);
        }
        var afterFn = function() {
            //loadding.removeAll();
            $(".pageLoadding").remove();
            swipeBanner();
            saveClassifyId();
            swipeHotRecommend();
        }
        var saveClassifyId = function(){
            $("#menuList li").click(function(){
                var classify_id = $(this).data("classify_id");
                LS.set("classify_id",classify_id);
            });
        };
        var swipeHotRecommend = function() {
            var swiper2 = new Swiper('.swiper-container2', {
                slidesPerView: 3,
                paginationClickable: true,
                spaceBetween: 0,
                loop: true,
                autoplay: 3000,
            });
        };
        var swipeBanner = function() {
            var swiper1 = new Swiper('.swiper-container1', {
                pagination: '.swiper-pagination1',
                paginationClickable: true,
                loop: true,
                autoplay: 5000,
                onTap: function(swiper, e) {
                    var target = $(e.target);
                    //var link_url = target.data("link_url").trim();
                    // var link_url = target.data("link_url");
                    // if (link_url) {
                    //     window.location.href = link_url;
                    //     return;
                    // }
                    var type = target.data("type");
                    var id = target.data("id");
                    if (type==0) {
                        return;
                    }else if(type==1){
                        window.location.href = id;
                    }else if(type==2){
                        window.location.href = "presaleDetail.html?id=" + id;
                    }else if(type==3){
                        window.location.href = "activeDetail.html?id=" + id;
                    }else if(type==9){
                        window.location.href = "invitation_index.html";
                    };
                }
            });
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
            "goList": function() {
                LS.set("classify_id",1);
            },
            "goMem": function() {
                layer.open({
                     content: '请下载唯票APP体验',
                     style: 'background-color:#fff; color:#333; border:none;',
                     btn: ['确定','取消'],
                     yes: function() {
                        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.vintop.vipiao";
                     }
                 });
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
        $(".header_search,.index_search").click(function(){
            window.location.href = "./search.html";
        });                    
    }
    function init() { 
        if (LS.get("sourcetype")=='kejiang') {
            $(".blank1rem, .downImg").hide();            
        }   
        bindEvent();        
        get_list();
    }
    var $listEle = $("#activeList");
    init();
})