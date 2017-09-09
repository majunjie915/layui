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
    var date = require("mod/common/date");

    var loadding = require("site/loadding.js");
    var lazyLoad = require("mod/common/lazyLoad");

    var loaddedPage = 1;
    var continueLoad = true;
    var myScroll;
    var appkey = '23313321';


    function bindEvent() {
        var eventsObj = {
            "a": function() {
                showModal();
                slideBody();
                return;
            },
            'send' : function(){
                var msg = $(".input_txt").val();
                sendMsg(tid,msg).done(function(data){
                    $(".input_txt").val('');
                    var data = {'msg' : msg};
                    showMsg(data,'me');
                })
            },
			'btn_more' : function(){
				
				layer.open({
                content: '更多功能请下载唯票APP体验',
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
				time:3,
                //btn: ['确定','取消'],
                //yes: function() {}
            });             
               
            },
            'groupinfo' : function(){
                location.href = 'groupInfo.html?tid='+tid;
            }

        }
        E.actionMap("body", eventsObj);
    }

   function getHistoryMsg(){
       var dtd = $.Deferred();
       sdk.Tribe.getHistory({
           tid: tid,
           success: function(data){
               dtd.resolve(data);
           },
           error: function(error){
               dtd.reject(error);
           }
       });
       return dtd.promise();
   }

    function loginIm(uuid,appkey,pwd){
        var dtd = $.Deferred();
        sdk.Base.login({
            uid:uuid,
            appkey: appkey,
            credential: pwd,
            timeout: 4000,
            success: function(data){
                sdk.Base.startListenAllMsg();
                dtd.resolve(data);
            },
            error: function(error){
                dtd.reject(error);
            }
        });
        return dtd.promise();
    }

    function sendMsg(tid,msg){
        var dtd = $.Deferred();
        sdk.Tribe.sendMsg({
            tid: tid,
            msg: msg,
            success: function(data){
                console.log(data);
                dtd.resolve(data.data);
            },
            error: function(error){
                dtd.reject(error);
            }
        });
        return dtd.promise();
    }

    function historyMsg(groupid,nextkey,count){
        var dtd = $.Deferred();
        nextkey = nextkey || '';
        count = count || 20;
        sdk.Tribe.getHistory({
            tid: tid,
            count: count,
            success: function(data){
                data.tid = groupid;
                dtd.resolve(data);
            },
            error: function(error){
                console.log(error);
                dtd.reject(error);
            }
        });
        return dtd.promise();
    }

    /**
     * 展示信息内容
     * @param data 信息对象
     * @param type 信息类别，you其他人发送，me自己发送
     */
    function showMsg(data,type){
        var nowdate = '';
        if(type == 'me'){
            var myDate = new Date();
            myDate.getYear();
            nowdate = myDate.toLocaleTimeString();
        }else{
            nowdate = date.unix2str(data.time);
        }
        var msg = '';
        var msginfo = '';
        if(typeof data.msg != 'object'){
            msginfo = sdk.Plugin.Emot.splitByEmot(data.msg)
        }else{
            data.msg = '';
        }
        if(typeof msginfo == 'object'){
            for(var i in msginfo){
                msg = sdk.Plugin.Emot.decode(msginfo[i]);
            }
        }else{
            if(sdk.Plugin.Emot.isEmot(data.msg)){
                msg = sdk.Plugin.Emot.decode(data.msg);
            }else{
                msg = data.msg;
            }

        }
        //console.log(sdk.Plugin.Emot.decode(data.msg));
        //console.log(sdk.Plugin.Emot.splitByEmot(data.msg));
        var html =
            '<div class="chatItem '+type+'">' +
                '<div class="time">' +
                    '<span class="timeBg fl"></span>'+nowdate+'<span class="timeBg fr"></span>' +
                '</div>' +
                '<div class="chatItemContent">' +
                    '<a href="javascript:void(0)"><img class="avatar" src="../static/images/0.jpg"></a>' +
                    '<div class="cloud cloudText">' +
                        '<div class="cloudPannel">' +
                            '<div class="cloudBody">' +
                                '<div class="cloudContent">' +
                                    '<pre style="white-space:pre-wrap">'+msg+'</pre>' +
                                '</div>' +
                            '</div>' +
                            '<div class="cloudArrow "></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        $(".chatContent").append(html);
    }


    function init() {
        var obj = util.toQueryParams();
        tid = obj.id;
        $(".herder_title").html(obj.name);
        if (LS.get("userId")) {
            //loginIm('IMUser_'+LS.get('userId'),appkey,util.md5('IMpass_'+LS.get('userId'))).done(function(data){
            //    sdk.Base.startListenAllMsg();
            //    historyMsg().done(function(data){
            //        if(data && data.data && data.data.msgs) {
            //            var list = data.data.msgs;
            //            console.log(list);
            //            for(var i = list.length - 1 ; i >= 0 ;  -- i ){
            //                showMsg(list[i],'you');
            //            }
            //        }
            //    });
            //}).fail(function(err){
            //    console.log(err);
            //})

            sdk.Base.login({
                uid:'IMUser_'+LS.get('userId'),
                appkey: appkey,
                credential: util.md5('IMpass_'+LS.get('userId')),
                timeout: 4000,
                success: function(data){
                    console.log('login success', data);
                    sdk.Base.startListenAllMsg();


                    nextkey = '';
                    sdk.Tribe.getHistory({
                        tid: tid,
                        count: 30,
                        nextkey: nextkey,
                        success: function(data){
                            console.log('get history msg success', data);
                            nextkey = data.data && data.data.next_key;
                            if(data && data.data && data.data.msgs){
                                var list = data.data.msgs;
                                for(var i = list.length - 1 ; i >= 0 ;  -- i ){
                                    showMsg(list[i],'you');
                                }
                            }
                        },
                        error: function(error){
                            console.log('get history msg fail', error);
                        }
                    });
                },
                error: function(error){
                    console.log('login fail', error);
                }
            });


        } else {
            layer.open({content:'请先登录'});
        }
        bindEvent();
        sdk.Event.on('TRIBE.MSG_RECEIVED',function(data){
            console.log(data);
            showMsg(data.data.msgs[0],'you');
        });
    }
    var joinedGroupList = [];
    var sdk = new WSDK();
    var tid;
    init();
})