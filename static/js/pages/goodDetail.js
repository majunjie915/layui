define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var TouchSlide = require("lib/TouchSlide");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad"); 
    var layer = require("mod/common/layer"); 

    var get_good_data = function(data) {
        var APIData = API.good.get_good;
        data = data || {};        
        var successFn = function(res) {
            if(res.commodity.length == 0){
                layer.open({
                    time: 2,
                    style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                    content: "商品ID不存在1"
                })
            }
            var good_data = '';
            LS.set('good_data',JSON.stringify(res));

            //获取顶部商品图片            
            var focusdata = {
                list: res.commodity.img
            };

            if(focusdata.list.length>0){
                var html = template('focusimgT', focusdata);
                $("#focusimg").empty().append(html);
            }
            else{
                console.log("暂无数据");
            }
            //获取商品名称及价格
             if(res.commodity){
                var html = template('good_infoT', res.commodity);
                $("#good_info").empty().append(html);
             }            
            //获取商品详情
            var good_contentdata = {
                list: res.commodity.intorimg
            };
            if(good_contentdata.list.length>0){
                var html = template('good_contentT', good_contentdata);
                $("#good_content").empty().append(html);
            }else{
                console.log("暂无数据");
            }            

        }
        var beforeFn = function() {
        }
        var afterFn = function() {
            focusBanner();
            app_share();//初始化分享参数给APP
            
        }
        var focusBanner = function() {
                TouchSlide({ 
                slideCell:"#focus",
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul", 
                effect:"left", 
                autoPlay:false,//自动播放
                autoPage:true, //自动分页
                switchLoad:"_src" //切换加载，真实图片路径为"_src" 
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
    function app_share(){
        var share_good_data = JSON.parse(LS.get('good_data'));
        var share_info = {
            share_title:share_good_data.commodity.title,
            share_intro:share_good_data.commodity.intro,
            share_img:share_good_data.commodity.img[0].img,
            share_link:window.location.href
        }
        jsInterface.appShareWithTitleDescriptionImgUrlShareUrl(share_info.share_title,share_info.share_intro,share_info.share_img,share_info.share_link)
    }
    function bindEvent() {
        var params = util.toQueryParams();
        var isapp = params.isapp;
            if (isapp==0 || isapp == 'undefined' || isapp == 'null'){
                $("#share").hide();
            }
        var eventsObj = {
            "back": function() {
                if (isapp>0 && isapp != 'undefined' && isapp != 'null'){
                    jsInterface.h5Back();
                }else{
                    window.location.href = "./index.html";
                }
                
            },
            "share":function(){                
                app_share();
            }
        }
        E.actionMap("body", eventsObj);
    }
    function init() {
    var params = util.toQueryParams();
        commodity_id = params.id;
        var data = {
            commodity_id: params.id || ""
        }
        bindEvent();
        get_good_data(data);        
    }
    var commodity_id = '';
    init();
})