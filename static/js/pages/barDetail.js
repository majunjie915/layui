define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var E = require("mod/common/event");
    var ajax = require("mod/common/ajax");
    var LS = require("mod/common/localStorage");
    var loadding = require("site/loadding.js");
    var layer = require("mod/common/layer");
    var util = require("mod/common/util");

    function query_detail(data, isInit) {
        var APIData = API.fandom.get_bar;

        var successFn = function(res) {
            var data = {
                list: res.bar.owner
            };            
            // 圈子顶部图片
            var html = template('bar_imgT', res.bar);
            $("#bar_img").append(html);
            // 圈子介绍
            res.bar.description = res.bar.description.replace(/(\n)+|(\r\n)+/g, "<br/>");
            var html = template('bar_contT', res.bar.description);
            $("#bar_cont").append(html);
            // 圈主
            var html = template('barLeaderListT', data);
            $("#barLeaderList").append(html);
            // 热帖列表
            // var html = template('listT', res.bar);
            // $("#list").append(html);

        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }
    // 获取热门帖子
    function query_hotPost(data, isInit) {
        var APIData = API.fandom.get_hotPost;

        var successFn = function(res) {
            var data = {
                list: res.hot
            };

            //url正则匹配
            //var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;amp;:/~\+#]*[\w\-\@?^=%&amp;amp;/~\+#])?/g;
            var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;
            //遍历并正则替换相应的内容
            for(var i in data.list){
                var str = res.hot[i].text;
                //console.log(res.hot[i].poster_info.header);
                // if (res.hot[i].poster_info.nick_name == 'null') {
                //     res.hot[i].poster_info.nick_name = '小唯';
                // };
                // if (res.hot[i].poster_info.header == 'null') {
                //     res.hot[i].poster_info.header = '@@img/default_user.png';
                // };
                str = str.replace(reg, function(a){
                    return '<a href="'+a+'">#网页链接#</a>';
                });
                res.hot[i].text = str;
            }
            // str=str.replace(reg2,function(a){
            //     //如果包含http ，indexOf方法如果包含返回0,所以加上!
            //     if(!a.indexOf('http')){
            //         return '<a href="'+a+'">网页链接</a>'
            //     }
            //     else
            //     {
            //         return a;
            //     }
            // });

           // 热帖列表
            var html = template('listT', data);
            $("#list").append(html);
        }
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }

    function bindEvents() {
        var eventsObj = {
            "pop_info": function() {
                layer.open({
                            content: "该功能需下载APP体验!",
                            btn: ['下载', '取消'],
                            yes: function() {
                                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.vintop.vipiao";
                            },
                            no: function() {
                                layer.close();
                            }
                        })
                        return;
                
            },
            "show_barcont": function() {
                if ($("#bar_cont").hasClass("ext_cont")) {
                    $("#bar_cont").removeClass("ext_cont");
                }else{
                    $("#bar_cont").addClass("ext_cont");
                    $(".showh").hide();
                    //$("#otext").text("关闭查看全部");
                };                
           }           
            
        }
        E.actionMap("body", eventsObj);
    }

    function init() {
        var params = util.toQueryParams();
        var data = {
            bar_id: params.bar_id || "",
        }
        query_detail(data, true);
        query_hotPost(data, true);
        bindEvents();

        // var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;
        // var str = $('.post_txt').html();
        // var str = str.replace(reg, function(a){
        //         return '<a href="'+a+'">网页链接</a>';
        //     });
        // $('.post_txt').html(str);

    }
    init();
})