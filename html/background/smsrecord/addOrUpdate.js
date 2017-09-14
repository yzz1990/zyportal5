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

//初始化
function formSubmit($modelObj,type,dt){
    var submitUrl;
    var $data;
    if(type=='add'){
        submitUrl='/sms/record/addRecord';
        $data = $form_addOrUpdate.serialize();
    }else{
        submitUrl='/sms/record/updateRecord'
        $data=dt;      
        $data.fromman=$('#form_fromman').val();
    }
    if (newJqueryValidate.jqueryValidForm()) {
        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                if(data.code=='1'||data.code=='5'){
                    //页面刷新
                    reloadTableData();
                    if($modelObj){
                        //关闭
                        $modelObj.close();
                    }
                }
                showtoastr("inverse",data.desc);
                return true;
            },function(obj){
                //error
                showtoastr("inverse", '未知错误');
                return false;
            }
        );
    }
}

//加载表单数据
function initFormDatas(datas){
    if(datas){
        //普通数据加载
        dataLoad('#div_container',datas);
    }
}

function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        name:{
            required:true
        },
        description:{
            required:true,
        }
    };
    newJqueryValidate.jqueryValidate();
}
