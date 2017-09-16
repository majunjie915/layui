layui.use(['element', 'layer', 'jquery', 'laytpl',
  'ajax', 'configAPI', 'customUtil', 'localStorage', 'customEvent', 'customDate'], function(){
    var element = layui.element; 
    var layer = layui.layer;
    var $ = layui.jquery;
    var laytpl = layui.laytpl;

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

    var myChart = echarts.init(document.getElementById('main'));
    
    option = {
        title: {      //标题组件
          // text: '销售额（万元）'
        },
        tooltip: {    //提示框组件
          trigger: 'axis'
        },
        legend: {     //图例组件
          data: ['邮件营销']
        },
        grid: {  //直角坐标系内绘图网格
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {  //直角坐标系 grid 中的 x 轴
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日','周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {  //直角坐标系 grid 中的 y 轴
          type: 'value'
        },
        series: [  //系列列表
          {
            name: '销售额',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210]
          }
        ]
    };
    myChart.setOption(option);

    function bindEvent(){
      var eventsObj = {
        test: function(){
          layer.open({
            content: '没有更多了',
            style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
            
          });
        },
        toOrderList: function(){
          var orderStatus = $(this).data("status");
          LS.set("orderStatus", orderStatus);
          location.href = "listOrders.html";
        }
      };
      E('body', eventsObj);
    }

    function init(){

      ajax(obj);
      bindEvent();
    }

    init();
});