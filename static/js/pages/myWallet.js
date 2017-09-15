layui.use(['element', 'jquery', 'laytpl', 'laydate', 'laypage', 'layer', 'form', 
	'customEvent', 'localStorage', 'customUtil', 'ajax', 'configAPI', 'customDate'],function(){
	var element = layui.element,
		$ = layui.jquery,
		laytpl = layui.laytpl,
		laypage = layui.laypage,
		form = layui.form,
		laydate = layui.laydate,
		layer = layui.layer,
		E = layui.customEvent,
		LS = layui.localStorage,
		customUtil = layui.customUtil,
		ajax = layui.ajax,
		API = layui.configAPI,
		formatDate = layui.customDate,

		params = customUtil.toQueryParams();


		var data = {
      		list: []
    	};
	    var getTpl = transactionListT.innerHTML;
	    var view = document.getElementById('transactionList');
	    laytpl(getTpl).render(data, function(html){
	      // view.innerHTML = html;
	    });

		function bindEvent(){
			var eventObj = {

			};

			E("body", eventObj);
		}

		function init(){

			//时间插件
		    laydate.render({ 
		        elem: '#datePluginStart'
		    });
		    laydate.render({ 
		        elem: '#datePluginEnd'
		    });
		    // 提交表单,获取表单信息
		    form.on('submit(formDemo)', function(data){
		      	formData = data.field;
		      	console.log(formData);
		      	return false;
		    });
			// 分页插件
		    laypage.render({
		        elem: 'pages', //注意，这里的 pages 是 ID，不用加 # 号
		        count: 50, //数据总数，从服务端得到
		        limit: 5,// 自定义每页条数，默认为10
		        layout: ['count', 'prev', 'page', 'next', 'skip'],// 除了每页显示多少条的限制limit外，全部显示
		        curr: function(){ //通过url获取当前页，也可以同上（pages）方式获取
		            var page = location.search.match(/page=(\d+)/);
		            return page ? page[1] : 1;
		        }(), //当前页 
		        prev: '<上一页', //自定义上一页的文字  
		        next: '下一页>', // 自定义下一页的文字，可不加
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
			bindEvent();
		}

		init();
})