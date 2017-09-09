define(function(require, exports) {
    var $ = require("jquery");
    var API = require("API");
    var template = require("template");
    require("site/template.helper");
    var ajax = require("mod/common/ajax");
    var E = require("mod/common/event");
    var validatorForm = require("mod/common/validatorForm");
    var Encrypt = require("mod/common/encrypt");
    var LS = require("mod/common/localStorage");
    var layer = require("mod/common/layer");
    var util = require("mod/common/util");
    var Huploadify = require("Huploadify");


    function get_user() {
        var APIData = API.User.get_user_data;

        var successFn = function(res) {
            res.user.header = res.user.header;
			//res.user.header = res.user.header;
			// console.log(res.user.header);

            var html = template('mainArticleT', res.user);
            $("#mainArticleInfo").empty().append(html);

            $("input[name=nick_name]").val(res.user.nick_name);
            var html = template('navArticleT', res.user);
            $("#navArticle").empty().append(html);
            editHeader();
        }

        var _vt = LS.get('_vt');
        if (!_vt) {
            layer.open({
                content: "您还未登录，请先登录！",
                style: 'background-color:rgba(0,0,0,.7); color:#fff; border:none;',
                time: 2
            })
        }
        var data = {
            '_vt': _vt,
        }

        // var data = {
        //     rsa_str: Encrypt.encrypt(formObj)
        // };
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,
            successFn: successFn
        }

        ajax(obj);
    }

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
			uploader:API.adomain+"/v3" + "/user/header",
            onUploadStart: function(file) {
                console.log(file.name + '开始上传');
            },
            onInit: function(obj) {
                // console.log('初始化');
            },
            onUploadComplete: function(file, res) {
                //console.log(file.name + '上传完成');
                var data = JSON.parse(res);
                $("#avatorUpload").css("backgroundImage", "url('"+data.data.header+"')");
                $(".cameraBtn").hide();
                updateUser('userForm', data.data.header);

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

    function uploadHeader(data) {
        var APIData = API.User.upload_header;

        var successFn = function() {

        }
        var data = data || {};
        var obj = {
            url: APIData.url,
            type: APIData.type,
            data: data || APIData.data,

            successFn: successFn
        }

        ajax(obj);
    }


    function updateUser(form, header) {
        var APIData = API.User.update_person_information;

        var successFn = function(res) {
            var html = template('mainArticleT', res.user);
            $("#mainArticleInfo").empty().append(html);
            /*layer.open({
                "content":"更新成功",
                time:1
            })*/
            $('#mainArticle,.subArticle').hide();
            $('#mainArticle').show();
            editHeader();
            LS.set("user", JSON.stringify(res.user));
        }

        var form = $("[name='" + form + "']");
        var formObj = util.fromDataToJSON(form, true);
        formObj._vt = LS.get("_vt");
        
        if (header) {
            formObj.header = header;
        }
        // formObj.is_rsa = false;

        // var data = {
        //     rsa_str: Encrypt.encrypt(formObj)
        // };
        var data = formObj;
        //console.log(data);
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
            
            gotoPage: function() {
                console.log($(this));
            },
            choiceSex: function() {
                $("[name=sex]").val($(this).data("sex"));
                $(this).siblings().removeClass("selected").end().addClass("selected")
                updateUser('userForm');

            }
        }
        E.actionMap("body", eventsObj);
    }

    function init() {
        get_user();
        var fileds = [{
            name: 'nick_name',
        }, {
            name: 'email',
            rules: 'valid_email'
        }, {
            name: 'pass_word',
        }, {
            name: 'read',
        }];

        validatorForm('userForm', fileds, updateUser);
        bindEvent();
    }

    init();
})