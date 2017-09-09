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
    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");
    var shareText = {};
    var isclick = LS.set('isclick','1');
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
    // 获取URL参数 
    var params = util.toQueryParams();
    var isapp = params['isapp'];
    function getInfoData() {
        var APIData = API.activityList.getInfoData;
        var data = {            
            event_id: params['id'],
        }
        var successFn = function(res) {
            var result = {
                data : res[0]
            };
            shareText = {
                share_title: result.data.share_title,
                share_content: result.data.share_content,
                share_pic: result.data.share_pic
            };
            var regR = /\r/g;
            var regN = /\n/g;
            // 模板渲染
            $("#luckyInfo_title .right").text(result.data.eve_title);
            $(".contentMain").html(result.data.description.replace(regR, "<br/>"));
            $(".topImg img").attr("lazy-img", result.data.horiz_pic);
            lazyLoad.lazyImgLodding();
            $(".footerRight").text(result.data.buttom_title);
            /*if (LS.get("_vt") || params["_vt"]) {
                getShareStatus();
            }*/
            var html = template("mainT",result);
            $("#main").append(html);
            var html = template("joinNumT",result);
            $("#joinNum").append(html); 
            LS.set('luckyData',JSON.stringify(result.data));           
            // 事件绑定
            $(".footerLeft").click(function(){
                $(".toast").show();
                setTimeout(function(){
                    $(".toast").hide();
                },1500)
                // var scene_id = result.data.scene_id;
                // if (isapp==1) {
                    
                //     jsInterface.showTicketWithProgramIDSceneID(params['pid'],scene_id);
                     
                // }else{
                      
                //     window.location.href = "./activeDetail.html?id="+params['pid'];                       
                    
                // }
            });                     
            // 倒计时
            if (result.data.status == 0) {
                timeStamp(result.data.expires_time);
            }else{

                    LS.set('isclick','0');             
                    $(".footerRight").css("background", "#ccc").html("已结束");
              
            }            
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }
        ajax(obj);
    }

    $("#footerRight").click(function(){
        if (LS.get('isclick')=='0') {
            $(".mask").show();
            setTimeout(function(){
                $(".mask").hide();
            },1500)
            return;
        }else if(isWeiXin()){
            window.location.href = "../../download.html"; 
        } else{
            // 
            var luckyObj = JSON.parse(LS.get("luckyData"));
            if (params["_vt"]) {

                var link = API.mdomain+'/luckyInfo2.html?id='+params['id'];
                
                    var share_info = {
                        title:luckyObj.share_title,
                        decs:luckyObj.share_content,
                        img_url:luckyObj.share_pic,
                        url:link,
                        wb_id:luckyObj.wb_id,
                        wb_content:luckyObj.wb_content,
                        event_id:luckyObj.id,
                    };
                    // jsInterface.weiboShareTitleDescImgUrlShareUrlWeiboIDContentActivityID(share_info.title,share_info.decs,share_info.img_url,share_info.url,share_info.wb_id,share_info.wb_content,share_info.event_id);             
                    jsInterface.shareTitleDescriptionImageUrlShareUrl(share_info.title,share_info.decs,share_info.img_url,share_info.url);                         
            }else{

                jsInterface.h5login();
            }
        };
    })

    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }


    // 获取转发状态
    function getShareStatus(){
        var APIData = API.activityList.getShareData;
        var data = {     
            _vt: params["_vt"] == undefined ? LS.get("_vt") : params["_vt"],       
            event_id: params['id'],
        }
        var successFn = function(res){
            if (res.data==false) {
                isclick = LS.set('isclick','0');
                $(".footerRight").css("background", "#ccc").html("已报名");
            }
        };
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn,
        }
        ajax(obj);
    }
    //倒计时
    function timeStamp( second_time ){
        var sel = setInterval(function() {  
            var time = parseInt(second_time) + "秒";
            var min = 0;
            var hour = 0;
            var day = 0;                        
            if( parseInt(second_time )> 60){
                var second = parseInt(second_time) % 60;  
                var min = parseInt(second_time / 60); 
                min = min < 10 ? '0' + min : '' + min;
                second = second < 10 ? '0' + second : '' + second; 
                time = min + "分" + second + "秒";              
                if( min > 60 ){
                    min = parseInt(second_time / 60) % 60;
                    min = min < 10 ? '0' + min : '' + min;  
                    var hour = parseInt( parseInt(second_time / 60) /60 ); 
                    hour = hour < 10 ? '0' + hour : '' + hour; 
                    time = hour + "小时" + min + "分" + second + "秒";        
                    if( hour > 24 ){  
                        hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                        hour = hour < 10 ? '0' + hour : '' + hour;  
                        var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                        day = day < 10 ? '0' + day : '' + day;   
                        time = day + "   天   " + hour + "   小时   " + min + "   分   " + second + "   秒";  
                    }  
                }     
            }
            if (parseInt(second_time ) <= 0) {
                LS.set('isclick','0');
                $("#countdown").html("");
                $(".footerRight").css("background", "#ccc").html("已结束");
                clearInterval(sel);
                return;
            } else{
                var html = '<p class="luckyInfoTime">'+
                                '<img src="../static/images/time2x.png">   '+
                                '  距结束   '+
                                '<span class="remainingTime">   '+time+'   </span>'+
                            '</p>';
                $("#countdown").html(html);
            };            
            second_time--;
        }, 1000);
    }
    // 微信分享
    function init() {
        getInfoData();        
    }    
    init();
})