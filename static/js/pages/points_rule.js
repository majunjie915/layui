define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    var ajax = require("mod/common/ajax");
    // var validatorForm = require("mod/common/validatorForm");
    var E = require("mod/common/event")
    var util = require("mod/common/util");
    var Encrypt = require("mod/common/encrypt");
    var LS = require("mod/common/localStorage");
    var layer = require("mod/common/layer");
    // var sms_captcha = require("mod/common/sms_captcha")
    // var Encrypt = require("mod/common/encrypt");

    function get_pointrule() {
        var APIData = API.point.get_pointrule;

        var successFn = function(res) {
            // console.log(res);
            // console.log(res[0].title);

            var add = '<div class="table_c">'+
                  '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
            var reduce='<h1 class="title clearfix">'+
                '<p class="fl">扣除积分</p>'+
                '<p class="fr"><img src="/static/images/icon_k.png"></p>'+
                '</h1>'+
                '<div class="table_c">'+
                '<table width="100%" border="0" cellspacing="0" cellpadding="0">';

            for(var i in res){
                var ttt=res[i];                
                for (var j in ttt.rule) {

                    var thisData=ttt.rule[j];
                    var len = ttt.rule.length;
                    if(!thisData.ishidden && len == 1){
                       var thisHtml='<tr>'+
                        '  <td>'+thisData.title+'</td>'+
                        '  <td>'+thisData.description+'</td>'+
                        '  <td><span class="cl_cs">'+thisData.flag+'</span></td>'+
                        '</tr>';
                        if(thisData.type=='add'){
                            add+=thisHtml;
                        }else{
                            reduce+=thisHtml;
                        }
                    }else{

                        if(j == 0){
                            var thisHtml='<tr>'+
                            '  <td rowspan="'+len+'">'+thisData.title+'</td>'+
                            '  <td>'+thisData.description+'</td>'+
                            '  <td><span class="cl_cs">'+thisData.flag+'</span></td>'+
                            '</tr>';
                            if(thisData.type=='add'){
                                add+=thisHtml;
                            }else{
                                reduce+=thisHtml;
                            }
                        }
                        else{
                            var thisHtml='<tr>'+
                            '  <td class="bd_none">'+thisData.description+'</td>'+
                            '  <td><span class="cl_cs">'+thisData.flag+'</span></td>'+
                            '</tr>';
                            if(thisData.type=='add'){
                                add+=thisHtml;
                            }else{
                                reduce+=thisHtml;
                            }
                        }
                    }
                };
            }

            var html='';
            add+=' </table>'+
                '</div>'+
                '<div class="blank10"></div>';
            html+=add;
            html+=reduce;
            html+=' </table>'+
                '</div>'+
                '<div class="blank10"></div>'

            $("#pointsrule").append(html);

        // var add = '<div class="table_c">'+
        //           '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
        //     var reduce='<h1 class="title clearfix">'+
        //         '<p class="fl">扣除积分</p>'+
        //         '<p class="fr"><img src="/static/images/icon_k.png"></p>'+
        //         '</h1>'+
        //         '<div class="table_c">'+
        //         '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
        //     var data=res; 
        //     for(var i in data){
        //         var thisData=data[i];
        //         if(!thisData.rule.ishidden){
        //            var thisHtml='<tr>'+
        //             '  <td>'+thisData.title+'</td>'+
        //             '  <td>'+thisData.description+'</td>'+
        //             '  <td><span class="cl_cs">'+thisData.flag+'</span></td>'+
        //             '</tr>';
        //             if(thisData.rule.type=='add'){
        //                 add+=thisHtml;
        //             }else{
        //                 reduce+=thisHtml;
        //             }
        //         }
        //     }
        //     var html='';
        //     add+=' </table>'+
        //         '</div>'+
        //         '<div class="blank10"></div>';
        //     html+=add;
        //     html+=reduce;
        //     html+=' </table>'+
        //         '</div>'+
        //         '<div class="blank10"></div>'

        //     $("#pointsrule").append(html);
        }

        var data = {
        };
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
        bindEvent();
        get_pointrule();
    }
    init();
})