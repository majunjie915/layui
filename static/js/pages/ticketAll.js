layui.use(['element', 'laypage', 'laydate', 'jquery', 'laytpl', 'layer', 'form',
  'customEvent', 'localStorage', 'ajax', 'configAPI', 'customUtil', 'customDate'], function(){
  var element = layui.element; 
  var laypage = layui.laypage;
  var laydate = layui.laydate;
  var $ = layui.jquery;
  var form = layui.form;
  var laytpl = layui.laytpl;
  var layer = layui.layer;

  var E = layui.customEvent;
  var LS = layui.localStorage;
  var ajax = layui.ajax;
  var API = layui.configAPI;
  var customUtil = layui.customUtil;
  var formatDate = layui.customDate;
  var params = customUtil.toQueryParams();  
  
  function bindEvent(){
    var eventsObj = {
      changeStatus: function(){
        var forms = $(".layui-form");
        $(".custom_nav li").removeClass("show");
        $(this).addClass("show");
        for (var i = 0; i < forms.length; i++) {
          $(forms[i]).hide();
          if($(forms[i]).data("status")==$(this).data("status")){
            $(forms[i]).show();
          }
        }
        LS.set("ticketStatus", $(this).data("status"));
      }
    };
    E("body", eventsObj);
  }

  function init(){
    // 时间插件
    laydate.render({ 
        elem: '#datePluginStart1'
    });
    laydate.render({ 
        elem: '#datePluginEnd1'
    });
    laydate.render({ 
        elem: '#datePluginStart2'
    });
    laydate.render({ 
        elem: '#datePluginEnd2'
    });

    // 获取表单数据
    form.on("submit(formDemo)", function(data){
      console.log(data.field);
      return false;
    })

    // 分页
    laypage.render({
      elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
      count: 50, //数据总数，从服务端得到
      limit: 5,
      layout: ['count', 'prev', 'page', 'next', 'skip'],
      curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
          var page = location.search.match(/page=(\d+)/);
          return page ? page[1] : 1;
      }(), //当前页 
      prev: '<上一页', //若不显示，设置false即可  
      next: '下一页>',
      jump: function(e, first){
          if (!first) {
              if(location.href.indexOf("?page")>0){
                  location.href = location.href.split("?page")[0]+'?page='+e.curr;
              }else if(location.href.indexOf("?")>0){
                  location.href = location.href.split("&page")[0]+'&page='+e.curr;
              }else{
                  location.href = location.href+'?page='+e.curr;
              }
          }
      }
    });

    // 初始化展示数据
    if (!LS.get("ticketStatus")) {
      LS.set("ticketStatus", "0");
    }
    var customNavLi = $(".custom_nav li");
    var forms = $(".layui-form");
    for (var i = 0; i < customNavLi.length; i++) {
      $(customNavLi[i]).removeClass("show");
      $(forms[i]).hide();
      if($(customNavLi[i]).data("status")==LS.get("ticketStatus")){
        $(customNavLi[i]).addClass("show");
      }
      if ($(forms[i]).data("status")==LS.get("ticketStatus")) {
        $(forms[i]).show();
      }
    }
    bindEvent();
  }
  init();
});