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
                $(".layui-layer-dialog, .layui-layer-shade").hide();
              }
              ,cancel: function(){ 
                //右上角关闭回调
              
                //return false 开启该代码可禁止点击该按钮关闭
              }
          });
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