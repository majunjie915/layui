define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");

    require("site/template.helper");
    require("pwgmodal");
    //var scroll = require("mod/common/scroll");
    var LS = require("mod/common/localStorage");
    var util = require("mod/common/util");
    var layer = require("mod/common/layer");
    //var date = require("mod/common/date");
    //var loadding = require("site/loadding.js");
    //var lazyLoad = require("mod/common/lazyLoad");

    //var loaddedPage = 1;
    //var continueLoad = true;
    //var myScroll;
    var appkey = '23313321';
	var touid = '唯票北京';
	var groupId = '唯票北京';

	function getGroupUsers(){
		var dtd = $.Deferred();
		sdk.Tribe.getTribeMembers({
			tid: tid,
			success: function(data){
				dtd.resolve(data);
			},
			error: function(error){
				dtd.reject(error);
			}
		});
		return dtd;
	}

    function init() {
		var obj = util.toQueryParams();
		tid = obj.tid;
        if (LS.get("userId")) {
            //console.log('IMUser_'+LS.get('userId'),appkey,util.md5('IMpass_'+LS.get('userId')));
			var uuid = 'IMUser_'+LS.get('userId');
			var passwd = util.md5('IMpass_'+LS.get('userId'));
			// 页面内展示
			var sdk = new WSDK();
			//用户登录
			sdk.Base.login({
			uid:uuid,
			appkey:appkey,
			credential:passwd,
			timeout: 4000,
			success: function(data){
			   console.log('login success', data);
			   //sdk.Base.startListenAllMsg();
			   
			   //获取群成员
			   sdk.Tribe.getTribeMembers({
					tid: tid,
					success: function(data){
						console.log(data);
						var html = template('groupUsersT', {list : data.data});
                    	$("#groupUsers").empty().append(html);
					},
					error: function(error){
						console.log(error);
					}
				});
			   
			},
			error: function(error){
			   //console.log('login fail', error);
			}
		});
        } else {
            alert('请先登录');
			window.location.href = "../logon.html";
        }
    }

	var tid;
	var uuid;
	init();
})