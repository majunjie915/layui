define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var E = require("mod/common/event");
    var ajax = require("mod/common/ajax");
    var validatorForm = require("mod/common/validatorForm");
    var LS = require("mod/common/localStorage");
    var loadding = require("site/loadding.js");
    var layer = require("mod/common/layer");
    var util = require("mod/common/util");
    var page = 1;
    var pageSize = 10;
    var inLoading=false;
    var hasMoreInfo=true;
    var is520 = true;

    function getById(idName){return document.getElementById(idName);}
    //获取窗口宽度高度
    function getViewport(){
    　if (document.compatMode == "BackCompat"){
    　　return {
    　　　width: document.body.clientWidth,
    　　　height: document.body.clientHeight
    　　　　}
    　} else {
    　　return {
    　　      width: document.documentElement.clientWidth,
    　　　　    height: document.documentElement.clientHeight
    　　　　　     }
    　}
    }
    //滚动条滚动事件
    window.onscroll = function(){
        //元素相对高度
        elTop=getElementViewTop(getById("more"));
        //窗口可视高度
        viewTop=getViewport()['height'];
        //如果有底部导航，获取底部导航高度
        // var dh = getById("").offsetHeight;
        // var moreh=getById("more").offsetHeight;
        if(elTop<=viewTop){//如果有底部导航 这里改为elTop<=(viewTop-dh)            
            query_activityList();
        }
    }
    function getElementViewTop(element){
        return element.getBoundingClientRect().top;
    }

    // 点击加载更多
    // $(".no_activeList>p").click(function(){
    //     page++;
    //     query_activityList();
    // });

    function query_activityList() {
        //若已经在加载更多内容，则不再加载此次
        if(inLoading){
            return ;
        }
        //若已经没有更多内容，则不再加载
        if(!hasMoreInfo){
            return ;
        }
        inLoading=true;
        getById("more").innerHTML='拼命加载中...';        
        console.log(page);
        var APIData = API.activityList.getListData;
        var data = {            
            page: page, 
            page_size: pageSize,
        }
        var successFn = function(res) {
            var result = {
                data: res.list
            };
            
            // is520 = false;
            // if (is520==true) {
            //     $(".topImg").html('<img src="../static/images/520bg.png">');
            //     $("body").css("background", "#ff71a3");
            // }else{
            //     $(".topImg").html('<img src="../static/images/banner.jpg">');
            //     $("body").css("background", "#F21A65");
            // }
            $(".topImg").html('<img src="../static/images/banner.jpg">');
            $("body").css("background", "#F21A65");

            if (res.pagination.total<pageSize) {
                getById("more").innerHTML='没有了，就这些';
            };            
            var html = template("activityProT", result);
            $("#activityPro").append(html);            
            page++;
            inLoading=false;
            if (res.pagination.total<=res.pagination.current_page*pageSize) {
                hasMoreInfo=false;
                inLoading=false;
                getById("more").innerHTML='没有了，就这些';
            }
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
    function bindEvents() {
        var params = util.toQueryParams();
        var eventsObj = {
            'goActivity':function(){
                var aid = $(this).data('aid');
                var pid = $(this).data('pid');
                var url = API.mdomain+"/luckyInfo2.html?id="+aid+"&pid="+pid;
                    window.location.href=url;
            }
        }
        E.actionMap("body", eventsObj);
    }    
    function init() { 
        query_activityList();
        bindEvents();
    }
    init();
})