/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */


var $form_addOrUpdate;
var newJqueryValidate;

(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    $form_addOrUpdate=$('#form_addOrUpdate');

    validateElement($form_addOrUpdate);


})();

function formSubmit($modelObj,type,dt){;
    var submitUrl;
    var $data={};
    if(type=='add'){
        submitUrl='/WeChatPlatform/AccountDevelopInfo/add';
        $data.account = $('#account').val();
        $data.password = $('#password').val();
        $data.name = $('#name').val();
        $data.typecode = $('#typecode').selectpicker('val');
        $data.appid = $('#appid').val();
        $data.appsecret = $('#appsecret').val();
        //$data.iplist = $('#iplist').val();
    }else{
        submitUrl='/WeChatPlatform/AccountDevelopInfo/update'
        $data=dt;
        $data.account = $('#account').val();
        $data.password = $('#password').val();
        $data.name = $('#name').val();
        $data.typecode = $('#typecode').selectpicker('val');
        $data.appid = $('#appid').val();
        $data.appsecret = $('#appsecret').val();
        //$data.iplist = $('#iplist').val();
    }

    if (newJqueryValidate.jqueryValidForm()) {
        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success;
                if(data.code=='50001'||data.code=='50002'||data.code=='50005'||data.code=='50006'){
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
    if(datas){
        dataLoad('#div_container',datas);//普通数据加载
        $("#typecode").selectpicker('val',datas.typecode);
    }

}

function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        name:{
            required:true
        },
        typecode:{
            required:true
        },
        appid:{
            required:true
        },
        appsecret:{
            required:true
        }
    };
    newJqueryValidate.jqueryValidate();

}

function openEye(id,obj){
    debugger
    var $obj = $('#'+id);''
    if($obj.attr('type')=='password'){
        $obj.attr('type','text');
    }else{
        $obj.attr('type','password');
    }
}