layui.use(['element', 'laypage', 'laydate', 'jquery', 'customEvent', 'localStorage', 'form'], function(){
  var element = layui.element; 
  var laypage = layui.laypage;
  var laydate = layui.laydate;
  var $ = layui.jquery;
  var E = layui.customEvent;
  var LS = layui.localStorage;
  var form = layui.form;
  laydate.render({ 
    elem: '#datePluginStart'
  });
  laydate.render({ 
    elem: '#datePluginEnd'
  });

  laypage.render({
    elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
    count: 50, //数据总数，从服务端得到
    limit: 5,
    groups: 5, //连续显示分页数  
    skip: true, //是否开启跳页 
    curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
        var page = location.search.match(/page=(\d+)/);
        return page ? page[1] : 1;
    }(), //当前页 
    first: '首页', //若不显示，设置false即可  
    last: '尾页', //若不显示，设置false即可  
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