/**
 * Created by Administrator on 2017/8/21 0021.
 */
var WxNews = {};
var fUrl = '';
var $initFileInputOPtion;
var $select = $('.selectpicker');
var $addparams;
$(document).ready(function () {

    $("#card").height(clientHeight - 130);
    var we = $("#card").width();
    $('#phoneview').width(we + we / 3);
    $('#phoneview').height(clientHeight - 210);
    $editTable = $('#main_table');
    initTable($editTable); // 调用函数，初始化表格
    $addparams = $('#issuedForm');
    $select.selectpicker({});
    $("#publish").click(function () {
        saveNews(true);
    });
    initeditor();
    initupload();
})

function initeditor() {
    //初始化富文本编辑器
    var E = window.wangEditor;
    mpnews_editor = new E('#text_editor');
    mpnews_editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'video',  // 插入视频
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
    ]
    mpnews_editor.customConfig.uploadImgHeaders = {
        "Authorization": "Bearer " + getLocalStorage('token'),
        "Accept": "application/json;charset=UTF-8"
    }
    mpnews_editor.customConfig.uploadImgServer = cors + '/editorFile/fileUpload/imageUpload';
    mpnews_editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
            realPath = getWangEditorImgURL(files);
        },
        customInsert: function (insertImg, result, editor) {
            var uploadurl = urlPathPre + result.fileUrl;
            insertImg(uploadurl);
        }
    }
    // text_editor.customConfig.pasteFilterStyle = false;
    mpnews_editor.customConfig.pasteFilterStyle = false;
    // text_editor.create();
    mpnews_editor.create();
}

function initupload() {
    //初始化图片上传
    initFileInputPicture($('#choseImg'), cors + "/file/fileUpload/imageUpload");
    //初始化图片上传提示图片
    $('#title_pic').attr('src', uploadImageUrl);
}

function initFileInputPicture($obj, uploadUrl) {
    $initFileInputOPtion = {
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions: ['jpg', 'png', 'jpeg'],//接收的文件后缀
        allowedFileTypes: ['image'],  //这是允许的文件类型 跟上面的后缀名还不是一回事
        allowedPreviewTypes: ['image'],//配置哪些文件类型被允许预览显示
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove: false, //显示移除按钮
        showCancel: false,//是否显示文件上传取消按钮
        showPreview: false, //是否显示预览
        showCaption: false,//是否显示标题
        showClose: false,//是否显示预览界面的关闭图标。默认为true
        showUploadedThumbs: true,//是否在预览窗口中持续显示已经上传的文件缩略图
        //showBrowse:true,//是否显示文件浏览按钮
        browseOnZoneClick: false,//是否在点击预览区域时触发文件浏览/选择
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: true,//是否显示拖拽区域
        autoReplace: true,//是否自动替换当前图片，设置为true时，再次选择文件，会将当前的文件替换掉。
        layoutTemplates: {
            footer: ''
        },
        previewSettings: {
            image: {width: "160px", height: "160px"},//图片预览的大小
        },
        maxFileCount: 1, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount: true,
        previewFileIcon: "<iclass='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function (filename) {//文件名替换,包含后缀,可以在这里直接生成新的文件名,也可以在后台处理
            return filename;
        },
        uploadExtraData: function (previewId, index) {//上传的额外的参数
            // return {
            //     'id':'aaa'
            // };
            //var $data = $form_addOrUpdate.serialize();
            //console.log($data);
            //alert(JSON.stringify($data));
            return {};
        },
        initialPreviewFileType: 'image',
        initialPreview: ["<img id='initialPreview_diy' src='' class='file-preview-image' width='160px' height='160px' />"],//初始化显示预览,此处放了一个空白的,只是为了方便编辑室赋值,新增时会被替换无影响
        fileActionSettings: {//预览区域设置
            showUpload: false,//是否显示上传按钮
            showZoom: false//是否显示预览按钮
        }
    };
    $obj.fileinput($initFileInputOPtion).on('filepreupload', function (event, data, previewId, index) {//上传前执行

    }).on("filebatchselected", function (event, files) {//选择文件后的事件
        //在自定义的img中显示图片
        var oFiles = document.querySelector("#choseImg");
        var realPath = getImgURL(oFiles);
        $('#title_pic').attr('src', realPath);
        //自动上传图片
        $(this).fileinput("upload");
    }).on("fileuploaded", function (event, data, previewId, index) {//异步上传返回结果处理
        if (data.response.status == 'success') {
            //图片路径地址保存到对应的位置
            //{"form":{},"files":[{}],
            // "filenames":["timg.jpg"],"filescount":1,"extra":{},
            // "response":{"uploadFilePath":"E:/apache-tomcat-upload/webapps/data/files/55cdeffaedb44d98807b500b3d34593e.jpg","fileUrl":"/55cdeffaedb44d98807b500b3d34593e.jpg","status":"success"},
            // "reader":{},
            // "jqXHR":{"readyState":4,
            // "responseText":"{\"uploadFilePath\":\"E:/apache-tomcat-upload/webapps/data/files/55cdeffaedb44d98807b500b3d34593e.jpg\",\"fileUrl\":\"/55cdeffaedb44d98807b500b3d34593e.jpg\",\"status\":\"success\"}","responseJSON":{"uploadFilePath":"E:/apache-tomcat-upload/webapps/data/files/55cdeffaedb44d98807b500b3d34593e.jpg","fileUrl":"/55cdeffaedb44d98807b500b3d34593e.jpg","status":"success"},"status":200,"statusText":"success"}}
            // console.log(JSON.stringify(data));
            fUrl = data.response.fileUrl;
        } else {
            showtoastr("warning", '图片上传失败！');
        }
        $('.kv-upload-progress').hide();//隐藏多余的进度条(会显示两个)
    }).on('fileerror', function (event, data, msg) {//异步上传错误处理
        // alert('上传异常');
    }).on("filebatchuploadsuccess", function (event, data, previewId, index) {//同步上传返回结果处理

    }).on('filebatchuploaderror', function (event, data, msg) {//同步上传错误处理

    }).on('filesuccessremove', function (event, id) {//图片上传成功后，点击删除按钮的回调函数

    }).on('filereset', function () {

    }).on("fileclear", function (event, data, msg) {//点击浏览框右上角X 清空文件前响应事件

    }).on("filecleared", function (event, data, msg) {//点击浏览框右上角X 清空文件后响应事件

    });

}

function saveNews(publish) {
    var id = $('#issued_id').val();
    // var author = $('#issued_author').val();
    var author = getUserInfo();
    var title = $('#issued_title').val();
    var desc = $('#issued_desc').val();
    var content = mpnews_editor.txt.html();
    var type = $('#issued_select').val();
    var element = $(content).get(0);
    if (trim(title) == '') {
        showtoastr("inverse", '请输入标题');
        return;
    }
    if (trim(desc) == '') {
        showtoastr("inverse", '请输入描述');
        return;
    }
    if (fUrl == '' || fUrl == undefined) {
        showtoastr("inverse", '请上传封面图片！');
        return;
    }

    if (content == '' || content == undefined) {
        showtoastr("inverse", '请输入内容！');
        return;
    }
    WxNews.id = id;
    WxNews.author = author.realname;
    WxNews.title = title;
    WxNews.memo = desc;
    WxNews.content = content;
    WxNews.type = type;
    WxNews.titlePic = fUrl;
    if(publish){
        WxNews.disabled = publish;
    }else{
        WxNews.disabled = false;
    }
    if (WxNews.type == 0) {
        showtoastr("inverse", '请选择发布的模块！');
        return;
    }
    getData(
        'post',
        '/WeChatPlatform/news/saveOrUpdateNews',
        WxNews,
        'json',
        function (obj) {
            if (obj.code == 0) {
                showtoastr("inverse", '保存成功');
                $('#editpage').removeClass("active");
                $('#showpage').addClass("active");
                $editTable.bootstrapTable('refresh');
            } else {
                showtoastr("inverse", obj.desc);
            }
        }
    )
}
var $editTable;
var currentPage = 1;
var currentPageSize = 10;
/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstrapTable = MyDiyBootstrapTable($table);
    var $tableOption = newBootstrapTable.bootstrapTableOption;
    $tableOption.columns = [[{
        field: 'xh',
        title: '序号',
        formatter: function (value, row, index) {
            return index + 1 + (currentPage - 1) * currentPageSize;
        },
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 50
    }, {
        field: 'titlePic',
        title: '首页图片',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 60,
        formatter: function (value, row, index) {
            var purl = urlPathPre + value;
            return '<img style="width: 60px;height: 60px" src="' + purl + '">';
        },
    }, {
        field: 'title',
        title: '标题',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 270
        // 宽度
    }, {
        field: 'memo',
        title: '描述',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 150
        // 宽度
    }, {
        field: 'author',
        title: '作者',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 80
        // 宽度
    }, {
        field: 'type',
        title: '模块',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 80,
        // 宽度
        formatter: function (value, row, index) {
            if (value == 1) {
                return "媒体聚焦";
            } else if (value == 3) {
                return "走进河长";
            } else if (value == 2) {
                return "政策法规";
            } else if (value == 4) {
                return "主题活动";
            }
        }
    }, {
        field: 'editDate',
        title: '编辑时间',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 100
    }, {
        field: 'publishDate',
        title: '发布时间',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 100,
        formatter: function (value, row, index) {
            if (trim(value) == '') {
                return '<a style="color: #f46c3d">尚未发布</a>';
            }
        }
    }, {
        field: 'disabled',
        title: '状态',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 80,
        formatter: function (value, row, index) {
            if (value) {
                return '<a style="color: #1df411">发布中</a>';
            } else{
                return '<a style="color: #f40006">未发布</a>';
            }
        }
    }, {
        field: 'id',
        title: '操作',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 150,
        formatter: function (value, row, index) {
            if (value) {
                return "<button class='btn btn-primary waves-effect' onclick='openEditModel(\"" + value + "\")'>编辑</button>  " +
                    " <button class='btn btn-danger waves-effect' onclick='deleteArea(\"" + value + "\")'>删除</button>";
            }
        }
    }]
    ];
    $tableOption.method = 'get';
    $tableOption.detailView = false;
    $tableOption.url = cors + '/WeChatPlatform/news/allNews';
    $tableOption.onClickRow = $onClickRow;
    // $tableOption.height = clientHeight - 230;
    // initBootstrapTable($editTable, $tableOption, null);
    $tableOption.onClickRow = $onClickRow;
    newBootstrapTable.initBootstrapTable();
}
function openEditModel(value) {

}



