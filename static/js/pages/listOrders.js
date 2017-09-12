layui.use(['element', 'laypage', 'laydate', 'form', 'laytpl', 'customEvent', 'localStorage', 'jquery'], 
  function(){
    var element = layui.element; 
    var laypage = layui.laypage;
    var laydate = layui.laydate;
    var form = layui.form;
    var laytpl = layui.laytpl;
    var E = layui.customEvent;
    var LS = layui.localStorage;
    var $ = layui.jquery;

    laydate.render({ 
      elem: '#datePlugin'
      ,range: true //或 range: '~' 来自定义分割字符
    });

    form.on('submit(formDemo)', function(data){
      layer.msg(JSON.stringify(data.field));
      return false;
    });

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
          $(".custom_nav li").removeClass("show");
          $(this).addClass("show");
          LS.set("orderStatus", $(this).data("status"));
        }
      };
      E("body", eventsObj);
    }

    function init(){
      if (!LS.get("orderStatus")) {
        LS.set("orderStatus", "0");
      }
      var customNavLi = $(".custom_nav li");
      for (var i = 0; i < customNavLi.length; i++) {
        $(customNavLi[i]).removeClass("show");
        if($(customNavLi[i]).data("status")==LS.get("orderStatus")){
          $(customNavLi[i]).addClass("show");
        }
      }
      bindEvent();
    }
    init();
});