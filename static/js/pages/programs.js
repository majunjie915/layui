layui.use(['element', 'laypage', 'laytpl', 'jquery', 'form', 'layer', 'laydate', 
    'ajax', 'configAPI', 'customEvent', 'customUtil', 'customDate', 'localStorage'], function(){
  var element = layui.element,
      laypage = layui.laypage,
      laytpl = layui.laytpl,
      $ = layui.jquery,
      form = layui.form,
      layer = layui.layer,
      laydate = layui.laydate,
      ajax = layui.ajax,
      API = layui.configAPI,
      E = layui.customEvent,
      customUtil = layui.customUtil,
      formatDate = layui.customDate,
      LS = layui.localStorage,

      params = customUtil.toQueryParams();


  function getprogramsList(){
    var data = {
      "total": "20",
      "list": [
          {
              "title": "“哈尔的移动城堡”宫崎骏·久石让动漫视听系列主题音乐会",
              "show_time": "2017.08.25 - 2017.12.20",
              "all_scence": "上海/天津/北京",
              "img": "http://img4.imgtn.bdimg.com/it/u=1235202486,955959316&fm=200&gp=0.jpg"
          },
          {
              "title": "“哈尔的移动城堡”宫崎骏·久石让动漫视听系列主题音乐会",
              "show_time": "2017.08.25 - 2017.12.20",
              "all_scence": "上海/天津/北京",
              "img": "http://img0.imgtn.bdimg.com/it/u=967033261,2403729305&fm=200&gp=0.jpg"
          },
          {
              "title": "“哈尔的移动城堡”宫崎骏·久石让动漫视听系列主题音乐会",
              "show_time": "2017.08.25 - 2017.12.20",
              "all_scence": "上海/天津/北京",
              "img": "http://img4.imgtn.bdimg.com/it/u=1235202486,955959316&fm=200&gp=0.jpg"
          },
          {
              "title": "“哈尔的移动城堡”宫崎骏·久石让动漫视听系列主题音乐会",
              "show_time": "2017.08.25 - 2017.12.20",
              "all_scence": "上海/天津/北京",
              "img": "http://img0.imgtn.bdimg.com/it/u=967033261,2403729305&fm=200&gp=0.jpg"
          }
      ]
    };
    var tpl = programsT.innerHTML;
    var view = document.getElementById("programs");
    laytpl(tpl).render(data, function(html){
      view.innerHTML = html;
    });
    // 分页
    laypage.render({
      elem: 'pages', //注意，这里的 pages 是 ID，不用加 # 号
      count: data.total, //数据总数，从服务端得到
      limit: 10,
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
  }

  function bindEvent(){
    var eventObj = {

    };
    E('body', eventObj);
  }

  function defaults(){
      // 获取form数据
      form.on('submit(formDemo)', function(data){
        console.log(data.field);
        return false;
      })
    
  }
  function init(){
    defaults();
    getprogramsList();
    bindEvent();
  }

  init();

});