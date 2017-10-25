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
        };
        ajax(obj);
    }

    function bindEvent(){
      var eventsObj = {
        toOrderList: function(){
          var orderStatus = $(this).data("status");
          LS.set("orderStatus", orderStatus);
          location.href = "listOrders.html";
        },
        saveModify: function(){
          var that = this;
          layer.open({
            title: '票品编辑'
              ,content: '票品修改后，需重新提交审核，确<br/>认提交审核吗？'
              ,btn: ['确认', '取消']
              ,yes: function(index, layero){
                //按钮【按钮一】的回调
                $(".layui-layer-dialog, .layui-layer-shade").hide();

                layer.msg("修改成功");
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
        },
        addOriginTicket: function(){
          var html = $("div.layui-colla-item:first").clone(true);
          $("div.layui-collapse").append(html);
          $("div.layui-colla-item:last").find("span.index").text($("div.layui-colla-item").length-1);
        }
      };
      E('body', eventsObj);
    }

    function init(){
      $(".nav_left li:eq(1)").addClass("layui-nav-itemed").end().find("dd.ticketsAll").addClass("layui-this");
      getTicketInfoData();
      bindEvent();
    }

    init();
});