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

    $('#jobname').selectpicker({});
    $('#jobgroup').selectpicker({});


    validateElement($form_addOrUpdate);




})();

function form_statushideClick(obj){
    $('#form_statushide').val($(obj).val());
}

function formSubmit($modelObj,type,dt){
    var submitUrl;
    var $data;
    if(type=='add'){
        submitUrl='/system/role/addRole';
        $data = $form_addOrUpdate.serialize();
    }else{
        submitUrl='/system/role/updateRole'
        $data=dt;
        $data.name=$('#form_name').val();
        $data.identification=$('#form_identification').val();
        $data.sort=$('#form_sort').val();
        $data.status=$('#form_statushide').val();
        $data.description=$('#form_description').val();
    }

    if (newJqueryValidate.jqueryValidForm()) {

        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                if(data.code=='60001' || data.code=='60005'){
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
    var $zt=datas.status;
    $('.form_status[value="'+$zt+'"]').attr('checked',true);
    $('#form_statushide').val($zt);


    // $('#jobname').selectpicker('val',datas.jobname);
    // $('#jobgroup').selectpicker('val',datas.groupid);
}

function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        name:{
            required:true
        },
        identification:{
            required:true
        },
        sort:{
            required:true,
            isPositiveInteger:true
        }
    };
    newJqueryValidate.jqueryValidate();

}