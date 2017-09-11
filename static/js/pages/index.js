layui.use(['element', 'layer', 'ajax', 'configAPI', 'customUtil', 'jquery', 'localStorage', 'customEvent', 'customDate'], 
  function(){
    var element = layui.element; 
    var layer = layui.layer; 
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

    ajax(obj);

    function bindEvent(){
      var eventsObj = {
        test: function(){
          layer.open({
            content: '没有更多了',
            style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
            
          });
        }
      };
      E('body', eventsObj);
    }

    bindEvent();
});