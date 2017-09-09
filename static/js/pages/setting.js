define(function(require, exports) {
    var $ = require("jquery");
    var ajax = require("mod/common/ajax");
    var API = require("API");
    var E = require("mod/common/event");
    var LS = require("mod/common/localStorage");
    var validatorForm = require("mod/common/validatorForm");
    var layer = require("mod/common/layer");
    var Huploadify = require("Huploadify");

    function addfeedback(form) {

        var APIData = API.Feedback.add;
        var user = JSON.parse(LS.get('user'));
        var data = {
            _vt: LS.get("_vt"),
            contents: $("[name=contents]").val(),
            source: 'h5',
            pic_url: $("#feedBackImg").val(),
        }

        var successFn = function(res) {
            layer.open({
                content: "提交成功",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 1
            })
            $("[name=contents]").val("")
            $("#feedBackImg").val("")
            $(".subArticle").hide();
            $("#mainArticle").show();
        }


        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }
        ajax(obj);
    }

    function bindEvent() {
        var eventsObj = {
            "faq":function(){
                window.location.href = "./faq.html";
            },
            "gotoself":function(){
                window.location.href = "./self.html";
            },
            "gotoadd":function(){
                window.location.href = "./address.html";
            },
            "logout": function() {
                layer.open({
                    content: '确认退出当前登录吗?',
                    btn: ['确认', '取消'],
                    shadeClose: false,
                    yes: function() {
                        layer.closeAll();
                        LS.remove("userId");
                        LS.clear();
                        window.location.href = "./index.html";
                    },
                    no: function() {

                    }
                });

            }
        }

        E.actionMap("body", eventsObj);
    }

    function init() {
        var fileds = [{
            name: 'contents',
            rules: 'required'
        }];

        if (LS.get("_vt")) {
            $(".logOffBtn").show();
        }
        validatorForm('suggestionForm', fileds, addfeedback);

        bindEvent();

        var up = $('#addfeedBack').Huploadify({
            auto: true,
            fileTypeExts: '*.jpg;*.jpeg;*.png;*.JPG;*.JPEG;*.PNG;',
            multi: false,
            fileObjName:'upfile',
            formData: {
                'upload_dir': 'upload/program',
                '_vt':LS.get('_vt')
            },
            method:'post',
            fileSizeLimit: 99999999999,
            showUploadedPercent:false,
            showUploadedSize:false,
            removeTimeout: 9999999,
            uploader: API.adomain+"/v3" + "/feedback/image",
            onUploadStart: function(file) {
                // console.log(file.name + '开始上传');
            },
            onInit: function(obj) {
 
            },
            onUploadComplete: function(file,res) {
                //console.log(file.name + '上传完成');
                var res = JSON.parse(res);
                $('#addfeedBack').after('<img src="http://static.vipiao.com/feedback/image/'+res.data.id+'" style="max-width:100%;">').hide();
                $('#feedBackImg').val(res.data.id);
            },
            onCancel: function(file) {
                // console.log(file.name + '删除成功');
            },
            onClearQueue: function(queueItemCount) {
                // console.log('有' + queueItemCount + '个文件被删除了');
            },
            onDestroy: function() {
                // console.log('destroyed!');
            },
            onSelect: function(file) {
                // console.log(file.name + '加入上传队列');
            },
            onQueueComplete: function(queueData) {
                // console.log('队列中的文件全部上传完成', queueData);
            }
        });
    }

    init();
})