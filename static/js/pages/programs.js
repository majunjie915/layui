layui.use(['element', 'laypage', 'laytpl', 'jquery'], function(){
  var element = layui.element; 
  var laypage = layui.laypage;
  var laytpl = layui.laytpl;
  var $ = layui.jquery;

  var data = {
    "total": "4",
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
            "img": "http://img0.imgtn.bdimg.com/it/u=1974427947,3931742233&fm=27&gp=0.jpg"
        },
        {
            "title": "“哈尔的移动城堡”宫崎骏·久石让动漫视听系列主题音乐会",
            "show_time": "2017.08.25 - 2017.12.20",
            "all_scence": "上海/天津/北京",
            "img": "http://img5.imgtn.bdimg.com/it/u=622933360,3059006293&fm=27&gp=0.jpg"
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
});