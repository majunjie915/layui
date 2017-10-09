layui.use(['element', 'laypage', 'laydate', 'form', 'laytpl',  'jquery', 'layer',
  'customEvent', 'localStorage', 'ajax', 'configAPI', 'customUtil', 'customDate'], function(){
    var element = layui.element; 
    var laypage = layui.laypage;
    var laydate = layui.laydate;
    var form = layui.form;
    var laytpl = layui.laytpl;
    var layer = layui.layer;
    var $ = layui.jquery;

    var E = layui.customEvent;
    var LS = layui.localStorage;
    var ajax = layui.ajax;
    var API = layui.configAPI;
    var customUtil = layui.customUtil;
    var formatDate = layui.customDate;


    function bindEvent(){
      var eventsObj = {
        cinfirmSubmit: function(){
          if (!$("input[name='expressNum']").val()) {
            layer.msg("请填写正确的订单号");
            return false;
          }
          layer.msg("操作成功");
          LS.set("orderStatus", 3);
          setTimeout(function(){
            location.href = "listOrders.html";
          } ,2000)
        },
        cancel: function(){
          LS.set("orderStatus", 0);
          location.href = "listOrders.html";
        }
      };
      E("body", eventsObj);
    }

    function init(){
      $(".nav_left li:eq(1)").addClass("layui-nav-itemed").end().find("dd.listOrders").addClass("layui-this");

      bindEvent();
    }
    init();
});