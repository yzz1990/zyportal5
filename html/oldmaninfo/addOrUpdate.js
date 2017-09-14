/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */

var $form_addOrUpdate;
var $form_sex;
var $form_haszjxy;
var $form_zjxy;
var $form_whcd;
var $form_jzzk;
var $form_jjly;
var $form_ylzffs;
var $form_hyzk;
var $form_birth;
var $form_mzxz;
var $form_czdz;
var $form_lxrxm;
var form_lxrdh;
var $form_photoUrl;
var $imageUpload
var $initFileInputOPtion
var $form_yly;
var selectValidate;


(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    $form_addOrUpdate=$('#form_addOrUpdate');
    $form_sex=$('#form_sex');
    $form_haszjxy=$('#form_haszjxy');
    $form_zjxy=$('#form_zjxy');
    $form_whcd=$('#form_whcd');
    $form_jzzk=$('#form_jzzk');
    $form_jjly=$('#form_jjly');
    $form_ylzffs=$('#form_ylzffs');
    $form_hyzk=$('#form_hyzk');
    $form_birth=$('#form_birth');
    $form_mzxz=$('#form_mzxz');
    $form_czdz=$('#form_czdz');
    $form_lxrxm=$('#form_lxrxm');
    $form_lxrdh=$('#form_lxrdh');
    $form_photoUrl=$('#form_photoUrl');
    $imageUpload=$('#imageUpload');
    $form_yly=$('#form_yly');


    //初始化页面
    initSex();
    initHasZjxy();
    initWhcd();
    initJzzk();
    initJjly();
    initYlzffs();
    initHyzk();
    initMz();
    initZjxySelect();
    initYlySelect();
    initOther();


    validateElement();

    initFileInputPicture($imageUpload, cors+"/file/fileUpload/imageUpload");//初始化照片上传

    $('#form_headPhoto').css('width',photoW);
    $('#form_headPhoto').css('height',photoH);
    // $('.btn').css('cursor','pointer');
    //$('.file-preview').css('width','142px');

})();

//初始化性别
function initSex(){
    var isChecked=true;
    for(var key in valarrSex) {
        $form_sex.append('<label class="radio radio-inline m-r-20"> ' +
            '<input type="radio" name="sex" value="'+key+'" '+(isChecked?'checked="checked"':'')+' > ' +
            '<i class="input-helper"></i>'+valarrSex[key]+' ' +
            '</label>');
        isChecked=false;
    }
}
//初始化宗教信仰
function initHasZjxy () {
    var isChecked=true;
    for(var key in valarrIsXyzj) {
        $form_haszjxy.append('<label class="radio radio-inline m-r-20"> ' +
            '<input type="radio" name="hasreligion" onclick="zjxyInputHideShow('+key+')" value="'+key+'" '+(isChecked?'checked="checked"':'')+' > ' +
            '<i class="input-helper"></i>'+valarrIsXyzj[key]+' ' +
            '</label>');
        if(isChecked&&key=='1'){//只有被选中的为key=1(有宗教信仰)时才显示
            zjxyInputHideShow(1);
        }
        isChecked=false;
    }
}
//初始化文化程度
function initWhcd(){
    var isChecked=true;
    for(var key in valarrWhcd) {
        $form_whcd.append('<label class="radio radio-inline m-r-20"> ' +
                                '<input type="radio" name="culture" value="'+key+'" '+(isChecked?'checked="checked"':'')+' > ' +
                                '<i class="input-helper"></i>' +valarrWhcd[key]+
                          '</label>');
        isChecked=false;
    }
}
//初始化居住状况
function initJzzk(){
    var isChecked=true;
    for(var key in valarrJzqk) {
        $form_jzzk.append('<label class="radio radio-inline m-r-20"> ' +
                                '<input type="radio" name="livingstatus" onclick="ylySelectHideShow('+key+')"  value="'+key+'" '+(isChecked?'checked="checked"':'')+' > ' +
                                '<i class="input-helper"></i>' +valarrJzqk[key]+
                          '</label>');
        isChecked=false;
    }

}
//初始化经济来源
function initJjly(){
    for(var key in valarrJjly) {
        $form_jjly.append('<label class="checkbox checkbox-inline m-r-20"> ' +
                                '<input type="checkbox" name="economicsfrom" value="'+key+'"> ' +
                                '<i class="input-helper"></i>'+valarrJjly[key]+
                          '</label>');
    }
}
//初始化医疗支付方式
function initYlzffs(){
    for(var key in valarrYlzffs) {
        $form_ylzffs.append('<label class="checkbox checkbox-inline m-r-20">' +
                                '<input type="checkbox" name="medicalpaytype" value="'+key+'"> ' +
                                '<i class="input-helper"></i>' +valarrYlzffs[key]+
                            '</label>');
    }

}
//初始化婚姻状况
function initHyzk(){
    var isChecked=true;
    for(var key in valarrHyzk) {
        $form_hyzk.append('<label class="radio radio-inline m-r-20"> ' +
                                '<input type="radio" name="maritalstatus" value="'+key+'" '+(isChecked?'checked="checked"':'')+' > ' +
                                '<i class="input-helper"></i>' +valarrHyzk[key]+
                          '</label>');
        isChecked=false;
    }
}
//初始化民族下拉
function initMz(){
    // $form_mzxz.append('<option value="">请选择</option>');
    for(var i=0;i<nations.length;i++){
        $form_mzxz.append("<option value='"+i+"'>"+nations[i]+"</option>");
    }
    $form_mzxz.selectpicker({});
    // selectValidate=initBootstrapSelect([
    //         {id:'form_mzxz',data:nations,required:true,errText:'请选择民族'}
    //     ]);
}
//初始化宗教下拉
function initZjxySelect(){
    // $form_zjxy.append('<option value="">请选择宗教</option>');
    for(var key in valarrzjjp) {
        $form_zjxy.append('<option value="'+key+'">'+valarrzjjp[key]+'</option>');
    }
    $form_zjxy.selectpicker({});  //初始化,一定要放在赋值下面
}
//初始化养老院下拉
function initYlySelect(){
    // $form_yly.append('<option value="">请选择养老院</option>');
    getData(
        'post',
        '/Pension/OldmanHome/SelectNameId',
        null,
        'json',
        function (data) {//success
            //console.log(data);
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $form_yly.append('<option value="'+data[i].id+'">'+data[i].name+'</option>');
                }
            }
            $form_yly.selectpicker({});  //初始化
        },function(obj){//error
            showtoastr("inverse", '养老院列表加载异常');
        }
    );
}


//初始化其他
function initOther(){
    //生日选择控件
    var myTimeSetting = inputTimeSelSetting;
    myTimeSetting.format = 'YYYY-MM-DD';
    myTimeSetting.minDate='1900-01-01';
    myTimeSetting.maxDate=getFormatDate(new Date(),'yyyy-MM-dd');//最大时间为当天
    $form_birth.jeDate(myTimeSetting);
    $form_birth.val((new Date().getFullYear()-60)+'-01-01');//默认出生日期选择,当前年前推60年
}

//宗教信仰input显示隐藏
function zjxyInputHideShow(value){
    if(value=='1'){
        $('#div_form_zjxy').show();
    }else{
        $('#div_form_zjxy').hide();
        var firstV=$form_zjxy.find('option:first').val();
        $form_zjxy.selectpicker('val',firstV);
    }
}

//养老院选择显示隐藏
function ylySelectHideShow(value){
    if(value=='5'){
        $('#div_form_yly').show();
    }else{
        $('#div_form_yly').hide();
        var firstV=$form_yly.find('option:first').val();
        $form_yly.selectpicker('val',firstV);
    }
}


//验证表单元素
function validateElement(){
    var validateOption = $jqueryValidateOption;
    validateOption.rules = {
        name:{//姓名
            required:true,
            maxlength:4,
            checkChinese:true
        },
        pcardid:{//身份证
            required:true,
            validateSFZID:true
        },
        registeraddress:{//户籍地址
            required:true
        },
        residentaddress:{//常住地址
            required:true
        },
        economicsfrom:{//经济来源
            isChecked:true
        },
        medicalpaytype:{//医疗支付方式
            isChecked:true
        },
        birth:{//生日
            required:true
        },
        socialcardid:{//社保卡号
            required:true,
            digits:true
        },
        contactperson:{//联系人
            maxlength:4,
            checkChinese:true
        },
        contacttel:{//联系人电话
            isTruePhone:true
        }
    }
    validateOption.errorPlacement= function (error, element) {
        if (element.is(":checkbox") || element.is(":radio")) {
            element.parent().parent().append(error)
        } else {
            error.insertAfter(element);
        }
    }
    jqueryValidate($form_addOrUpdate, validateOption);
}

//提交数据
function formSubmit($modelObj,type){
    var submitUrl;
    //var sf=selectValidate();
    if (jqueryValidForm($form_addOrUpdate)) {
        if(type=='add'){
            submitUrl='/oldMan/oldManInfo/add';
        }else if(type=='update'){
            submitUrl='/oldMan/oldManInfo/update';
        }
        var $data = $form_addOrUpdate.serialize();
        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                if(data.code=='60001'||data.code=='60005'){//新增或更新成功
                    if($modelObj){
                        initIndexPaginator();//刷新页面
                        $modelObj.close();//关闭
                    }
                }
                showtoastr("inverse",data.desc);
                return (data.code=='60001'||data.code=='60005'?true:false);
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
//下拉,单选多选加载
    $form_sex.find('input[value="'+datas.sex+'"]').attr('checked','checked');//性别
    $form_haszjxy.find('input[value="'+datas.hasreligion+'"]').attr('checked','checked');//是否有宗教信仰
    if(datas.hasreligion=='1'){//宗教信仰
        $form_zjxy.selectpicker('val',datas.religion);
        $('#div_form_zjxy').show();
    }
    $form_whcd.find('input[value="'+datas.culture+'"]').attr('checked','checked');//文化程度
    $form_jzzk.find('input[value="'+datas.livingstatus+'"]').attr('checked','checked');//居住状况
    if(datas.livingstatus=='5'){//养老院
        $form_yly.selectpicker('val',datas.nursinghomeid);
        $('#div_form_yly').show();
    }
        //经济来源
    var jjlyArr=datas.economicsfrom.split(',');
    for(var ii=0;ii<jjlyArr.length;ii++){
        $form_jjly.find('input[value="'+jjlyArr[ii]+'"]').attr('checked','checked');
    }
        //医疗支付方式
    var ylzhfsArr=datas.medicalpaytype.split(',');
    for(var ii=0;ii<ylzhfsArr.length;ii++){
        $form_ylzffs.find('input[value="'+ylzhfsArr[ii]+'"]').attr('checked','checked');
    }
        //婚姻状况
    var hyzkArr=datas.maritalstatus.split(',');
    for(var ii=0;ii<hyzkArr.length;ii++){
        $form_hyzk.find('input[value="'+hyzkArr[ii]+'"]').attr('checked','checked');
    }
        //民族
    $form_mzxz.selectpicker('val',datas.famousfamily);
        //常住地址
    var czdzArr=datas.residentaddress.split(',');
    for(var ii=0;ii<czdzArr.length;ii++){
        if(ii==0){
            $form_czdz.val(czdzArr[ii]);
        }else{//新增新的一行
            var guid=uuid();
            $form_czdz.parent().append('<input id="address'+guid+'" value="'+czdzArr[ii]+'"  name="residentaddress" type="text" class="form-control input-sm" placeholder="常住地址">');
            $('#div_residentaddress_btn').append('<button guid="'+guid+'"  onclick="return delform_czdz(this)"  class="btn bgm-red btn-icon-text waves-effect">' +
                '<i class="zmdi zmdi-minus zmdi-hc-fw"></i>删除' +
                '</button>');
        }
    }
    //联系人电话及联系人
    var lxrArr=datas.contactperson.split(',');debugger;
    var lxrdhArr=datas.contacttel.split(',');
    if(lxrArr.length==lxrdhArr.length){
        for(var ii=0;ii<lxrArr.length;ii++){
            var guid=uuid();
            if(ii==0){
                $form_lxrxm.val(lxrArr[ii]);
                $form_lxrdh.val(lxrdhArr[ii]);
            }else{
                $form_lxrxm.parent().append('<input id="lxrxm'+guid+'" value="'+lxrArr[ii]+'" name="contactperson" type="text" class="form-control input-sm" placeholder="联系人姓名">');
                $form_lxrdh.parent().append('<input id="lxrdh'+guid+'" value="'+lxrdhArr[ii]+'" name="contacttel" type="text" class="form-control input-sm" placeholder="联系人电话">');
                $('#div_lx_btn').append('<button guid="'+guid+'"  onclick="return delform_lx(this)"  class="btn bgm-red btn-icon-text waves-effect">' +
                    '<i class="zmdi zmdi-minus zmdi-hc-fw"></i>删除' +
                    '</button>');
            }
        }

    }else{

    }








    var photoPath=urlPathPre+datas.photourl;
    // $('#initialPreview_diy').attr('src',photoPath);
    $('#form_headPhoto').attr('src',photoPath);
}



//新增一行常住地址
function addform_czdz($obj){
    var guid=uuid();
    $form_czdz.parent().append('<input id="address'+guid+'"  name="residentaddress" type="text" class="form-control input-sm" placeholder="常住地址">');
    $($obj).parent().append('<button guid="'+guid+'"  onclick="return delform_czdz(this)"  class="btn bgm-red btn-icon-text waves-effect">' +
                                '<i class="zmdi zmdi-minus zmdi-hc-fw"></i>删除' +
                            '</button>');
    return false;
}

//删除一行
function delform_czdz($obj){
    $($obj).remove();
    var guid=$($obj).attr('guid');
    // var removeSelector='#address'+guid;
    $('#div_residentaddress #address'+guid).remove();
    return false;
}

//新增一行联系人和联系方式
function addform_lx($obj){
    var guid=uuid();
    $form_lxrxm.parent().append('<input id="lxrxm'+guid+'" name="contactperson" type="text" class="form-control input-sm" placeholder="联系人姓名">');
    $form_lxrdh.parent().append('<input id="lxrdh'+guid+'" name="contacttel" type="text" class="form-control input-sm" placeholder="联系人电话">');
    $($obj).parent().append('<button guid="'+guid+'"  onclick="return delform_lx(this)"  class="btn bgm-red btn-icon-text waves-effect">' +
                                '<i class="zmdi zmdi-minus zmdi-hc-fw"></i>删除' +
                            '</button>');
    return false;
}
//删除一行联系人及联系方式
function delform_lx ($obj) {
    $($obj).remove();
    var guid=$($obj).attr('guid');
    $('#div_lx #lxrxm'+guid).remove();
    $('#div_lx #lxrdh'+guid).remove();
    return false;
}

//初始化fileinput控件（第一次初始化）
//图片上传(定制,专门上传头像)



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




