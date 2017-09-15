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

    // 模板渲染页面
    var data = {
      "title": "layui常用模板",
      "list": [
        {
          "id": "15029384255085465",
          "create_time": "2017-08-17 10:53:45",
          "title": "测试节目0815",
          "show_time": "2017-08-26 10:47:22",
          "cities": "呼和浩特市",
          "ticket_price": "100.00"
        },
        {
          "id": "15027821376677502",
          "create_time": "2017-08-15 15:28:5",
          "title": "北京测试预定",
          "show_time": "2017-08-17 16:46:31",
          "cities": "北京市",
          "ticket_price": "200.00"
        }
      ]
    };
    var getTpl = orderListT.innerHTML;
    var view = document.getElementById('orderList');
    laytpl(getTpl).render(data, function(html){
      view.innerHTML = html;
    });

    function bindEvent(){
      var eventsObj = {
        changeStatus: function(){
          $(".custom_nav li").removeClass("show");
          $(this).addClass("show");
          LS.set("orderStatus", $(this).data("status"));

          var forms = $(".listOrders_form");
          for (var i = 0; i < forms.length; i++) {
            $(forms[i]).css("display", "none");
            if ($(forms[i]).data("status")==$(this).data("status")) {
              $(forms[i]).css("display", "block");
            }
          }
        }
      };
      E("body", eventsObj);
    }

    function init(){
      // 获取表单数据
      form.on('submit(formDemo)', function(data){
        layer.msg(JSON.stringify(data.field));
        return false;
      });

      //时间插件
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
      laydate.render({ 
        elem: '#datePluginStart3'
      });
      laydate.render({ 
        elem: '#datePluginEnd3'
      });
      laydate.render({ 
        elem: '#datePluginStart4'
      });
      laydate.render({ 
        elem: '#datePluginEnd4'
      });
      laydate.render({ 
        elem: '#datePluginStart5'
      });
      laydate.render({ 
        elem: '#datePluginEnd5'
      });

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

      // 初始化状态
      if (!LS.get("orderStatus")) {
        LS.set("orderStatus", "0");
      }
      var customNavLi = $(".custom_nav li");
      var forms = $(".listOrders_form");
      for (var i = 0; i < customNavLi.length; i++) {
        $(customNavLi[i]).removeClass("show");
        if($(customNavLi[i]).data("status")==LS.get("orderStatus")){
          $(customNavLi[i]).addClass("show");
        }
        if ($(forms[i]).data("status")==LS.get("orderStatus")) {
          $(forms[i]).css("display", "block");
        }
      }

      bindEvent();
    }
    init();
});