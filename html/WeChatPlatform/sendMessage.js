/**
 * Created by Jisy on 2017/8/21.
 */

function initgzhselect(){
    $('#wxgzh').append('<option value="">请选择公众号</option>');
    getData(
        'post',
        '/WeChatPlatform/AccountDevelopInfo/selectAll',
        null,
        'json',
        function (data) {//success
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $('#wxgzh').append('<option value="'+data.rows[i].id+'">'+data.rows[i].name+'</option>');
                }
            }
            $('#wxgzh').selectpicker({});  //初始化
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}

function initeditor(){
    //初始化富文本编辑器
    var E = window.wangEditor;
    text_editor = new E('#text_editor');
    mpnews_editor = new E('#mpnews_editor');
    text_editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'undo',  // 撤销
        'redo'  // 重复
    ]
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
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
    ]
    mpnews_editor.customConfig.uploadImgHeaders = {
        "Authorization":"Bearer "+getLocalStorage('token') ,
        "Accept":"application/json;charset=UTF-8"
    }
    mpnews_editor.customConfig.uploadImgServer = cors+'/editorFile/fileUpload/imageUpload';
    mpnews_editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
            realPath=getWangEditorImgURL(files);
        },
        customInsert: function (insertImg, result, editor) {
            var uploadurl=urlPathPre+result.fileUrl;
            insertImg(uploadurl);
        }
    }
    text_editor.customConfig.pasteFilterStyle = false;
    mpnews_editor.customConfig.pasteFilterStyle = false;
    text_editor.create();
    mpnews_editor.create();
}

//获取发送消息类型
function setType(tp){
    type=tp;
}

function getLocalUser() {
    $.ajax({
        async:false,
        url:cors+'/system/user/getBasic',
        datatype:'json',
        type:'get',
        data:null,
        success:function(data){
            debugger
            if(data.code=="0"){
                fromUser = data.data.realname;
            }else{
                fromUser = '未知';
            }
        },
        headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}

function initFileInputPicture($obj, uploadUrl) {
    $initFileInputOPtion={
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : ['jpg', 'png','jpeg'],//接收的文件后缀
        allowedFileTypes: ['image'],  //这是允许的文件类型 跟上面的后缀名还不是一回事
        allowedPreviewTypes:['image'],//配置哪些文件类型被允许预览显示
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove :false, //显示移除按钮
        // showCancel:true,//是否显示文件上传取消按钮
        showPreview :false, //是否显示预览
        showCaption: false,//是否显示标题
        showClose: false,//是否显示预览界面的关闭图标。默认为true
        showUploadedThumbs:false,//是否在预览窗口中持续显示已经上传的文件缩略图
        //showBrowse:true,//是否显示文件浏览按钮
        browseOnZoneClick:false,//是否在点击预览区域时触发文件浏览/选择
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: true,//是否显示拖拽区域
        autoReplace:true,//是否自动替换当前图片，设置为true时，再次选择文件，会将当前的文件替换掉。
        layoutTemplates:{
            footer:''
        },
        previewSettings:{
            //image: {width: "100px", height: "170px"},//图片预览的大小
        },
        maxFileCount:1, //表示允许同时上传的最大文件个数
        enctype:'multipart/form-data',
        validateInitialCount:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {//文件名替换,包含后缀,可以在这里直接生成新的文件名,也可以在后台处理
            return filename;
        },
        uploadExtraData:function (previewId, index) {//上传的额外的参数
            return {};
        },
        initialPreviewFileType: 'image',
        initialPreview: ["<img id='initialPreview_diy' src='' class='file-preview-image' width='100px' height='170px' />"],//初始化显示预览,此处放了一个空白的,只是为了方便编辑室赋值,新增时会被替换无影响
        fileActionSettings:{//预览区域设置
            showUpload:false,//是否显示上传按钮
            showZoom: false//是否显示预览按钮
        }
    };
    $obj.fileinput($initFileInputOPtion).on('filepreupload', function(event, data, previewId, index) {//上传前执行
        //type = $('.tab-content .active').attr('id');
    }).on("filebatchselected", function(event, files) {//选择文件后的事件

        var oFiles = document.querySelector("#"+type+"_pic");
        var realPath = getImgURL(oFiles);
        if(type=='image'){
            $('#image_image').attr('src',realPath);
        }else if(type=='mpnews'){
            $('#mpnews_image').attr('src',realPath);
        }else if(type=='music'){
            $('#music_image').attr('src',realPath);
        }else{

        }

        //自动上传
        $(this).fileinput("upload");
    }).on("fileuploaded", function (event, data, previewId, index){//异步上传返回结果处理

        if(data.response.status=='success'){
            //图片路径地址保存到对应的位置
            if(type=='image'){
                image_pic_filePath = data.response.uploadFilePath;
                image_pic_url = urlPathPre+data.response.fileUrl;
                //$('#image_image').attr('src',image_pic_url);
            }else if(type=='mpnews'){
                mpnews_pic_filePath = data.response.uploadFilePath;
                mpnews_pic_url = urlPathPre+data.response.fileUrl;
            }else if(type=='music'){
                music_pic_filePath = data.response.uploadFilePath;
                music_pic_url = urlPathPre+data.response.fileUrl;
            }else{

            }
        }else{

        }
        $('.kv-upload-progress').hide();//隐藏多余的进度条(会显示两个)
    }).on('fileerror', function(event, data, msg) {//异步上传错误处理
        alert('上传异常');
    }).on("filebatchuploadsuccess", function (event, data, previewId, index) {//同步上传返回结果处理

    }).on('filebatchuploaderror', function(event, data, msg) {//同步上传错误处理

    }).on('filesuccessremove', function(event, id) {//图片上传成功后，点击删除按钮的回调函数

    }).on('filereset',function(){//文件重置

    }).on("fileclear",function(event, data, msg){//点击浏览框右上角X 清空文件前响应事件

    }).on("filecleared",function(event, data, msg){//点击浏览框右上角X 清空文件后响应事件

    });
}

function initFileInput($obj, uploadUrl,allowedtype) {
    $initFileInputOPtion={
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : allowedtype,//接收的文件后缀
        allowedPreviewTypes:['image'],
        //allowedFileTypes: ['image'],  //这是允许的文件类型 跟上面的后缀名还不是一回事
        uploadAsync: true, //默认异步上传
        showUpload: false, //是否显示上传按钮
        showRemove :false, //显示移除按钮
        showPreview :false, //是否显示预览
        showCaption: true,//是否显示标题
        showClose: false,//是否显示预览界面的关闭图标。默认为true
        showUploadedThumbs:false,//是否在预览窗口中持续显示已经上传的文件缩略图
        browseClass: "btn btn-primary", //按钮样式
        dropZoneEnabled: true,//是否显示拖拽区域
        autoReplace:true,//是否自动替换当前图片，设置为true时，再次选择文件，会将当前的文件替换掉。
        // minImageWidth: 50, //图片的最小宽度
        // minImageHeight: 50,//图片的最小高度
        // maxImageWidth: 50,//图片的最大宽度
        // maxImageHeight: 50,//图片的最大高度
        maxFileSize:0,//单位为kb，如果为0表示不限制文件大小
        // minFileCount: 0,
        maxFileCount:1, //表示允许同时上传的最大文件个数
        enctype:'multipart/form-data',
        validateInitialCount:true,
        //previewFileIcon: "<iclass='glyphicon glyphicon-file'></i>",
        msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        slugCallback: function(filename) {//文件名替换,包含后缀,可以在这里直接生成新的文件名,也可以在后台处理
            //return '替换的文件名'+filename;
            return filename;
        },
        uploadExtraData:function (previewId, index) {
            return {};
        },
        //initialPreviewFileType: 'image',
        //initialPreview: ["<div id='initialPreview_diy' width='150px' height='200px'z-index='-100'></div>"],//初始化显示预览,次数放了一个空白的,只是为了方便编辑室赋值,新增时会被替换无影响
        fileActionSettings:{//预览区域设置
            showUpload:false,//是否显示上传按钮
            showZoom: false//是否显示预览按钮
        }
    };
    $obj.fileinput($initFileInputOPtion).on('filepreupload', function(event, data, previewId, index) {//上传前执行
        //type = $('.tab-content .active').attr('id');
    }).on("filebatchselected", function(event, files) {//选择文件后的事件
        $(this).fileinput("upload");
    }).on("fileuploaded", function (event, data, previewId, index){//异步上传返回结果处理
        //type = $('.tab-content .active').attr('id');
        if(data.response.status=='success'){
            if(type=='voice'){
                voice_filePath = data.response.uploadFilePath;
                voice_url = urlPathPre+data.response.fileUrl;
            }else if(type=='video'){
                video_filePath = data.response.uploadFilePath;
                video_url = urlPathPre+data.response.fileUrl;
            }else if(type=='music'){
                //if($(this).attr('id')=='music'){
                music_url = urlPathPre+data.response.fileUrl;
                // }else{
                //     hqmusic_url = urlPathPre+data.response.fileUrl;
                // }
            }else{

            }
        }else{
            //alert('上传失败');
        }
        $('.kv-upload-progress').hide();//隐藏多余的进度条(会显示两个)
    }).on('fileerror', function(event, data, msg) {//异步上传错误处理
        alert('上传异常');
    }).on("filebatchuploadsuccess", function (event, data, previewId, index) {//同步上传返回结果处理
        /*
         var fileBaseName=data.response.fileBaseName;
         var filepath=data.response.uploadFilePath;
         alert(filepath);*/
    }).on('filebatchuploaderror', function(event, data, msg) {//同步上传错误处理
        alert("上传错误");
    }).on('filesuccessremove', function(event, id) {//图片上传成功后，点击删除按钮的回调函数
        //$form_photoUrl.val('');//地址还原成空
    }).on('filereset',function(){
        //alert('reset');
    }).on("fileclear",function(event, data, msg){//点击浏览框右上角X 清空文件前响应事件
        //alert('fileclear');
    }).on("filecleared",function(event, data, msg){//点击浏览框右上角X 清空文件后响应事件
        //alert('filecleared');
    });

}