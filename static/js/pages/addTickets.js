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

    function bindEvent(){
      var eventsObj = {
        toOrderList: function(){
          var orderStatus = $(this).data("status");
          LS.set("orderStatus", orderStatus);
          location.href = "listOrders.html";
        },
        withDraw: function(){
          layer.open({
              title: '提现到银行卡'
              ,content: '<p style="line-height: 2.5;">银行卡号： <span>6222 **** **** 4305</span></p>'+
                  '<p style="line-height: 2.5;">提现金额： '+
                  '<input type="text" style="width:100px;height:30px">  元'+
                  '</p>'+
                  '<p style="line-height: 2.5;">可提现金额： <span>2250</span></p>'
              ,btn: ['确认转出', '取消']
              ,yes: function(index, layero){
                //按钮【按钮一】的回调
                console.log(layero)
                $("#layui-layer1, #layui-layer-shade1").hide();
              }
              ,cancel: function(){ 
                //右上角关闭回调
              
                //return false 开启该代码可禁止点击该按钮关闭
              }
          });
        },
        deleteTicket: function(){
          var that = this;
          layer.open({
            title: ''
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
          LS.set("ticketStatus", 0);
          location.href = "ticketsAll.html";
        }
      };
      E('body', eventsObj);
    }

    function init(){
      $(".nav_left li:eq(1)").addClass("layui-nav-itemed").end().find("dd.programs").addClass("layui-this");
      ajax(obj);
      bindEvent();
    }

    init();
});