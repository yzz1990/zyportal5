/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */


var $form_addOrUpdate;
var $form_photoUrl;
var newJqueryValidate;

(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    $form_addOrUpdate=$('#form_addOrUpdate');
    $form_photoUrl=$('#form_photoUrl');

    $('#form_headPhoto').css('width',photoW);
    $('#form_headPhoto').css('height',photoH);

    $('#jobname').selectpicker({});
    $('#jobgroup').selectpicker({});

    initSex();

    var myTimeSetting = inputTimeSelSetting;
    myTimeSetting.format = 'YYYY-MM-DD';
    var nowDate=getFormatDate(new Date(),'yyyy-MM-dd');
    myTimeSetting.maxDate=nowDate;//最大时间为当天
    $('#form_birthday').jeDate(myTimeSetting);


    $('#btn_cronget').click(function(){
        window.open('quartz/cron/cron.html');
    });

    validateElement($form_addOrUpdate);

    initPeoplePhotoUpload($('#imageUpload'), cors+"/file/fileUpload/imageUpload");//初始化照片上传


})();

var pageSex;
//初始化性别
function initSex(){
    pageSex=undefined;
    var isChecked=true;
    for(var key in valarrSex) {
        $('#form_sex').append('<label class="radio radio-inline m-r-20"> ' +
            '<input type="radio" name="sex" value="'+key+'" '+(isChecked?'checked="checked"':'')+' > ' +
            '<i class="input-helper"></i>'+valarrSex[key]+' ' +
            '</label>');
        isChecked=false;
        pageSex=key;
    }
    $('#form_sex').find("input[name='sex']").click(function() {
        sexChange(this);
    });
}
function sexChange(obj){
    pageSex=$(obj).val();
}

function initPeoplePhotoUpload($obj, uploadUrl){
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
        // initialPreview: ["<img id='initialPreview_diy' src='' class='file-preview-image' width='100px' height='170px' />"],//初始化显示预览,此处放了一个空白的,只是为了方便编辑室赋值,新增时会被替换无影响
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


function formSubmit($modelObj,type,dt){
    var submitUrl;
    var $data;
    if(type=='add'){
        submitUrl='/system/user/addUserInfo';
        $data = $form_addOrUpdate.serialize();
    }else{
        submitUrl='/system/user/updateUserInfo'
        $data=dt;
        $data.username=$('#form_username').val();
        $data.realname=$('#form_realname').val();
        $data.password=$('#form_password').val();
        $data.email=$('#form_email').val();
        $data.tel=$('#form_tel').val();
        $data.organizeName=$('#form_organizeName').val();
        $data.description=$('#form_description').val();

        $data.organizeName=$('#form_organizeName').val();
        $data.organizeId=$('#form_organizeId').val();
        $data.roleName=$('#form_roleName').val();
        $data.roleId=$('#form_roleId').val();

        $data.status==$('#form_status').val();
        $data.photourl=$('#form_photoUrl').val();
        $data.sex=pageSex
        $data.birthday=$('#form_birthday').val();

    }

    if (newJqueryValidate.jqueryValidForm()) {
        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                if(data.code=='60001'||data.code=='60005'){
                    //页面刷新
                    reloadTableData();
                    if($modelObj){
                        $modelObj.close();//关闭
                    }
                }
                showtoastr("inverse",data.desc);
                return true;
            },function(obj){//error
                showtoastr("inverse", '未知错误');
                return false;
            }
        );
    }
}

//加载表单数据
function initFormDatas(datas){
    dataLoad('#div_container',datas);//普通数据加载

    var photoPath=urlPathPre+datas.photourl;
    $('#form_headPhoto').attr('src',photoPath);

    $('#form_sex').find('input[value="'+datas.sex+'"]').attr('checked','checked');//性别
}

function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        username:{
            required:true,
            maxlength:10
        },
        realname:{
            required:true,
            maxlength:10
        },
        password:{
            required:true,
            maxlength:10
        },
        email:{
            required:true,
            // isTrueEmail:true
            email:true

        },
        tel:{
            required:true,
            isTruePhone:true
        }
    };
    newJqueryValidate.jqueryValidate();

}

