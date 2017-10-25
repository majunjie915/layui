layui.use(['element', 'layer', 'jquery', 'laytpl',
  'ajax', 'configAPI', 'customUtil', 'localStorage', 'customEvent', 
  'customDate', 'Huploadify'], function(){
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
    var Huploadify = layui.Huploadify;

    function editHeader() {
        var up = $('#avatorUpload').Huploadify({
            auto: true,
            fileTypeExts: '*.jpg;*.jpeg;*.png;*.JPG;*.JPEG;*.PNG;',
            multi: false,
            fileObjName: 'upfile',
            formData: {
                '_vt': LS.get("_vt"),
                'upload_dir':'upload/header'
            },
            fileSizeLimit: 99999999999,
            showUploadedPercent: false,
            showUploadedSize: false,
            removeTimeout: 9999999,
            uploader:"../static/js/common/test.json",
            onUploadStart: function(file) {
                console.log(file.name + '开始上传');
            },
            onInit: function(obj) {
                // console.log('初始化');
            },
            onUploadComplete: function(file, res) {
                //console.log(file.name + '上传完成');
                var data = JSON.parse(res);
                $("#avatorUpload").css("backgroundImage", "url('"+data.data[0].pic+"')");
                // updateUser('userForm', data.data.header);

            },
            onCancel: function(file) {
                console.log(file.name + '删除成功');
            },
            onClearQueue: function(queueItemCount) {
                console.log('有' + queueItemCount + '个文件被删除了');
            },
            onDestroy: function() {
                console.log('destroyed!');
            },
            onSelect: function(file) {
                console.log(file.name + '加入上传队列');
            },
            onQueueComplete: function(queueData) {
                console.log('队列中的文件全部上传完成', queueData);
            }
        });
    }

    function getEchaersData(data){
      var obj = {
          url: "../static/js/common/test.json",
          type: "get",
          data: data,
          successFn: function(res){
              var myChart = echarts.init(document.getElementById('main'));
              var xData = [], yData = [], seriesName = "";

              for (var i = 0; i < res.length; i++) {
                xData.push(res[i].date);
                yData.push(res[i].num);
              }
      
              if (LS.get("echartsStatus")==2) {
                  $(".unit").text("订单数（单）");
                  seriesName = "订单数";
              }else if (LS.get("echartsStatus")==1) {
                  $(".unit").text("销售额（万元）");
                  seriesName = "销售额";
              }
              if (!res.length) {
                  $("#main").text("您还没有交易记录").css({
                      "line-height": "400px",
                      "font-size": "20px",
                      "text-align": "center",
                      "color": "red"
                  });
              }else{                
                  myChart.setOption({
                      title: {      //标题组件
                        // text: '销售额（万元）'
                      },
                      tooltip: {    //提示框组件
                        trigger: 'axis'
                      },
                      legend: {     //图例组件
                        // data: ['邮件营销']
                      },
                      grid: {  //直角坐标系内绘图网格
                        left: '3%',
                        right: '1%',
                        bottom: '5%',
                        containLabel: true
                      },
                      xAxis: {  //直角坐标系 grid 中的 x 轴
                        type: 'category',
                        boundaryGap: false,
                        data: xData,
                        "axisLabel":{  
                            interval: xData.length>12 ? Math.floor(xData.length/7) : 0,
                            rotate:45,//倾斜度 -90 至 90 默认为0  
                            margin:10,  
                            textStyle:{  
                                fontSize: "12px",
                                color:"#333"  
                            }   
                        }  
                      },
                      yAxis: {  //直角坐标系 grid 中的 y 轴
                        type: 'value'
                      },
                      series: [  //系列列表
                        {
                          name: seriesName,
                          type: 'line',
                          stack: '总量',
                          data: yData
                        }
                      ]
                  });
              }
          },
      }
      ajax(obj);
    }

    function bindEvent(){
      var eventsObj = {
        toOrderList: function(){
          var orderStatus = $(this).data("status");
          LS.set("orderStatus", orderStatus);
          location.href = "listOrders.html";
        },
        toTicketsAll: function(){
          var orderStatus = $(this).data("status");
          LS.set("ticketStatus", orderStatus);
          location.href = "ticketsAll.html";
        },
        withDraw: function(){
          var str = '<p style="line-height: 2.5;">银行卡号： <span>6222 **** **** 4305</span></p>'+
                  '<p style="line-height: 2.5;">提现金额： '+
                  '<input type="text" style="width:100px;height:30px">  元'+
                  '</p>'+
                  '<p style="line-height: 2.5;">可提现金额： <span>2250</span></p>';
          layer.open({
              title: '提现到银行卡'
              ,content: str
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
        },
        showByMoney: function(){
          LS.set("echartsStatus", 1);
          location.href = location.href;
        },
        showByNums: function(){
          LS.set("echartsStatus", 2);
          location.href = location.href;
        },
        byDay: function(){
          LS.set("date", "day");
          location.href = location.href;
        },
        byMonth: function(){
          LS.set("date", "month");
          location.href = location.href;
        },
        byYear: function(){
          LS.set("date", "year");
          location.href = location.href;
        }
      };
      E('body', eventsObj);
    }

    // 默认状态下的统计图
    function initStatisticChart(){
        var showWayElement = $(".orderWay li");
        var dateElement = $(".summaryCycle li");

        if (!LS.get("echartsStatus")) {
          LS.set("echartsStatus", 1);
        }
        if (!LS.get("date")) {
          LS.set("date", "day");
        }

        for (var i = showWayElement.length - 1; i >= 0; i--) {
          if($(showWayElement[i]).data("index")==LS.get("echartsStatus")){
              $(showWayElement[i]).addClass("choosed");
          }
        }
        for (var i = 0; i < dateElement.length; i++) {
          if($(dateElement[i]).data("date")==LS.get("date")){
            $(dateElement[i]).addClass("choosed");
          }
        }
      
    }
    
    function init(){
      
      initStatisticChart();
      var data = {
        echartsStatus: LS.get("echartsStatus"),
        date: LS.get("date")
      };
      getEchaersData(data);
      bindEvent();
      editHeader();
    }

    init();
});