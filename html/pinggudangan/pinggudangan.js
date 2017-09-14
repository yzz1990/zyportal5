/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */
(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    initjdDate({id:'birth',format:'YYYY-MM-DD'});

    $('#report_img').css('width',photoW);
    $('#report_img').css('height',photoH);



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
            showUploadedThumbs:true,//是否在预览窗口中持续显示已经上传的文件缩略图
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
            previewFileIcon: "<iclass='glyphicon glyphicon-king'></i>",
            msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
            slugCallback: function(filename) {//文件名替换,包含后缀,可以在这里直接生成新的文件名,也可以在后台处理
                return filename;
            },
            uploadExtraData:function (previewId, index) {//上传的额外的参数
                // return {
                //     'id':'aaa'
                // };
                //var $data = $form_addOrUpdate.serialize();
                //console.log($data);
                //alert(JSON.stringify($data));
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

        }).on("filebatchselected", function(event, files) {//选择文件后的事件
            //在自定义的img中显示图片
            var oFiles = document.querySelector("#imageUpload");
            var realPath = getImgURL(oFiles);
            $('#form_headPhoto').attr('src',realPath);
            //自动上传图片
            $(this).fileinput("upload");
        }).on("fileuploaded", function (event, data, previewId, index){//异步上传返回结果处理
            if(data.response.status=='success'){
                //图片路径地址保存到对应的位置
                var fUrl=data.response.fileUrl;
                $form_photoUrl.val(fUrl);
                $('#report_img').attr('src',urlPathPre+fUrl);
            }else{

            }
            $('.kv-upload-progress').hide();//隐藏多余的进度条(会显示两个)
        }).on('fileerror', function(event, data, msg) {//异步上传错误处理
            alert('上传异常');
        }).on("filebatchuploadsuccess", function (event, data, previewId, index) {//同步上传返回结果处理

        }).on('filebatchuploaderror', function(event, data, msg) {//同步上传错误处理

        }).on('filesuccessremove', function(event, id) {//图片上传成功后，点击删除按钮的回调函数
            $form_photoUrl.val('');//地址还原成空
        }).on('filereset',function(){

        }).on("fileclear",function(event, data, msg){//点击浏览框右上角X 清空文件前响应事件

        }).on("filecleared",function(event, data, msg){//点击浏览框右上角X 清空文件后响应事件

        });

    }
    function download(src) {
        var $a = document.createElement('a');
        $a.setAttribute("href", src);
        $a.setAttribute("download", "");

        var evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
        $a.dispatchEvent(evObj);
    };
    $form_photoUrl=$('#form_photoUrl');
    function initFileInput($obj, uploadUrl) {
        $initFileInputOPtion={
            language: 'zh', //设置语言
            uploadUrl: uploadUrl, //上传的地址
            //allowedFileExtensions : ['jpg', 'png','jpeg'],//接收的文件后缀
            //allowedFileTypes: ['image'],  //这是允许的文件类型 跟上面的后缀名还不是一回事
            uploadAsync: true, //默认异步上传
            showUpload: true, //是否显示上传按钮
            showRemove :false, //显示移除按钮
            showPreview :false, //是否显示预览
            showCaption: true,//是否显示标题
            showClose: false,//是否显示预览界面的关闭图标。默认为true
            browseClass: "btn btn-primary", //按钮样式
            dropZoneEnabled: false,//是否显示拖拽区域
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
            //previewFileIcon: "<iclass='glyphicon glyphicon-king'></i>",
            msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
            slugCallback: function(filename) {//文件名替换,包含后缀,可以在这里直接生成新的文件名,也可以在后台处理
                //return '替换的文件名'+filename;
                return filename;
            },
            uploadExtraData:function (previewId, index) {
                return {};
            },
            //initialPreviewFileType: 'image',
            //initialPreview: ["<img id='initialPreview_diy' src='' width='150px' height='230px' />"],//初始化显示预览,次数放了一个空白的,只是为了方便编辑室赋值,新增时会被替换无影响
            fileActionSettings:{//预览区域设置
                showUpload:false,//是否显示上传按钮
                showZoom: false//是否显示预览按钮
            }
        };
        $obj.fileinput($initFileInputOPtion).on('filepreupload', function(event, data, previewId, index) {//上传前执行
            //alert('上传前');
//                var form = data.form, files = data.files, extra = data.extra,
//                    response = data.response, reader = data.reader;
//                console.log('File pre upload triggered');
        }).on("filebatchselected", function(event, files) {//选择文件后的事件
            //去掉之前可能存在的,因为只能保留一张
            $('.photo .file-preview-success').remove();
            //$('.kv-zoom-cache').remove();
            //alert('选择了一个文件');
        }).on("fileuploaded", function (event, data, previewId, index){//异步上传返回结果处理
            debugger
            if(data.response.status=='success'){
                //图片路径地址保存到对应的位置
                var fileBaseName=data.response.fileBaseName;
                var filepath=data.response.fileUrl;
                $('#fileBaseName').val(fileBaseName);
                $('#filepath').val(filepath);
                var extIndex=fileBaseName.indexOf('.');
                if(extIndex>-1){
                    var ext=fileBaseName.substring(extIndex+1);
                    if(ext=='pdf'){
                        $('.file-caption-name').css('cursor','pointer').unbind("click").click(function(){
                            open(urlPathPre+filepath);
                        })
                    }else{
                        $('.file-caption-name').css('cursor','pointer').unbind("click").click(function(){
                            download(urlPathPre+filepath);
                        })
                    }
                }
                // alert('上传成功');
            }else{
                //alert('上传失败');
            }
            $('.kv-upload-progress').hide();//隐藏多余的进度条(会显示两个)
        }).on('fileerror', function(event, data, msg) {//异步上传错误处理
            alert('上传异常');
        }).on("filebatchuploadsuccess", function (event, data, previewId, index) {//同步上传返回结果处理

        }).on('filebatchuploaderror', function(event, data, msg) {//同步上传错误处理

        }).on('filesuccessremove', function(event, id) {//图片上传成功后，点击删除按钮的回调函数
            $form_photoUrl.val('');//地址还原成空
            // alert('图片上传成功后，点击删除按钮的回调函数');
//            if (some_processing_function(id)) {
//                console.log('Uploaded thumbnail successfully removed');
//            } else {
//                return false; // abort the thumbnail removal
//            }
        }).on('filereset',function(){
            //alert('reset');
        }).on("fileclear",function(event, data, msg){//点击浏览框右上角X 清空文件前响应事件
            //alert('fileclear');
        }).on("filecleared",function(event, data, msg){//点击浏览框右上角X 清空文件后响应事件
            //alert('filecleared');
        });

    }
    initFileInputPicture($('#imageUpload'), cors+"/file/fileUpload/imageUpload");//初始化照片上传
    initFileInput($('#fileUpload'), cors+"/file/fileUpload/fileUpload");//初始化文件上传
    //imageUpload
    $("#basicForm").validate({
        rules: {
            name:{
                required:true,
                checkChinese:true
            },
            sex:{
                required:true
            },
            hasreligion:{
                required:true
            },
            pcardid:{
                required:true,
                checkIdCard:true
            },
            culture:{
                required:true
            },
            registeraddress:{
                required:true
            },
            residentaddress:{
                required:true
            },
            livingstatus:{
                required:true
            },
            economicsfrom:{
                required:true
            },
            medicalpaytype:{
                required:true
            },
            maritalstatus:{
                required:true
            },
            medicalPayType:{
                required:true
            },
            birth:{
                required:true
            },
            contactperson:{
                required:true,
                checkChinese:true
            },
            contacttel:{
                required:true,
                checkMobile:true
            },
            socialcardid:{
                digits:true
            }
        },
        messages:{
            name:'请输入有效的中文姓名',
            sex:'请选择性别',
            hasreligion:'请选择有无宗教信仰',
            pcardid:'请输入有效的二代身份证号码',
            culture:'请选择文化程度',
            registeraddress:'请输入户籍地址',
            residentaddress:'请输入常住地址',
            livingstatus:'请选择居住情况',
            economicsfrom:'请选择经济来源',
            medicalpaytype:'请选择医疗费用支付方式',
            maritalstatus:'请选择婚姻状况',
            birth:'请选择出生日期',
            contactperson:'请输入联系人姓名',
            contacttel:'请输入联系人电话',
            socialcardid:'只允许输入数字'

        },
        errorPlacement: function (error, element) {
            if (element.is(":checkbox")||element.is(":radio")) {
                element.parent().parent().append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });
    $("#recentForm").validate({
        rules: {
            chronicDisease: {
                required: true
            },
            otherDiseases:{
                required: true
            },
            providerName:{
                required: true,
                checkChinese:true
            },
            other:{
                required: true
            }
        }
    });

   /* $("#scaleForm").validate({
        errorPlacement: function (error, element) {
            if (element.is(":checkbox")||element.is(":radio")) {
                error.html('请选择答案');
                element.parent().parent().parent().append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });*/

})();


