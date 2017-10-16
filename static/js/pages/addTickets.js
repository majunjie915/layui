layui.use(['element', 'layer', 'jquery', 'laytpl', 'form',
  'ajax', 'configAPI', 'customUtil', 'localStorage', 'customEvent', 'customDate'], function(){
    var element = layui.element; 
    var layer = layui.layer;
    var $ = layui.jquery;
    var laytpl = layui.laytpl;
    var form = layui.form;

    var ajax = layui.ajax;
    var API = layui.configAPI;
    var LS = layui.localStorage;
    var E = layui.customEvent;
    var formatDate = layui.customDate;
    var customUtil = layui.customUtil;
    var params = customUtil.toQueryParams();

    function getTicketInfoData(){
        var obj = {
            url: "../static/js/common/test.json",
            type: "get",
            data: "",
            successFn: function(){
              console.log(API.Common.getProvice.url);
              console.log(params["a"]);
              LS.set("message", "hello world");
            },
        }
        ajax(obj);
    }

    function bindEvent(){
      var eventsObj = {
        deleteTicket: function(){
          var that = this;
          layer.open({
            title: '删除票源'
              ,content: '您确定要删除该票源吗？'
              ,btn: ['确认', '取消']
              ,yes: function(index, layero){
                //按钮【按钮一】的回调
                $(that).closest("div.layui-colla-item").remove();
                $(".layui-layer-dialog, .layui-layer-shade").hide();
                var layuiCollaItems = $("div.layui-colla-item");
                for (var i = 0; i < layuiCollaItems.length; i++) {
                  $(layuiCollaItems[i]).find("span.index").text(i);
                }
              }
              ,cancel: function(){ 
                //右上角关闭回调
              
                //return false 开启该代码可禁止点击该按钮关闭
              }
          });
        },
        addOriginTicket: function(){
          var html = $("div.layui-colla-item:first").clone(true);
          $("div.layui-collapse").append(html);
          $("div.layui-colla-item:last").find("span.index").text($("div.layui-colla-item").length-1);
        },
        publishTicket: function(){
          var that = this;
          layer.open({
            title: '发布票源'
              ,content: '您确定要发布该票源吗？'
              ,btn: ['确认', '取消']
              ,yes: function(index, layero){
                //按钮【按钮一】的回调
                $(that).closest("div.layui-colla-item").remove();
                $(".layui-layer-dialog, .layui-layer-shade").hide();

                layer.msg("发布成功");
                LS.set("ticketStatus", 0);
                setTimeout(function(){
                  location.href = "ticketsAll.html";
                }, 2000)
              }
              ,cancel: function(){ 
                //右上角关闭回调
              
                //return false 开启该代码可禁止点击该按钮关闭
              }
          });
          
        }
      };
      E('body', eventsObj);
    }

    function init(){
      $(".nav_left li:eq(1)").addClass("layui-nav-itemed").end().find("dd.programs").addClass("layui-this");
      getTicketInfoData();
      bindEvent();
    }

    init();
});