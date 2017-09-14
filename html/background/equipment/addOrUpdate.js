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

    $("[data-toggle='popover']").popover();
    $("[data-toggle='tooltip']").tooltip();


})();

//初始化ztree


function formSubmit($modelObj,type,dt){
    var submitUrl;
    var $data;
    if(type=='add'){
        submitUrl='/system/machineMan/addMachine';
        $data = $form_addOrUpdate.serialize();
    }else{
        submitUrl='/system/machineMan/updateMachine'
        $data=dt;
        $data.stcd=$('#form_stcd').val();
        // $data.mtype=$('#form_machine_type').val();
        $data.mname=$('#form_machine_name').val();
        $data.ip=$('#form_machine_IP').val();
        $data.mno=$('#form_machine_no').val();
        $data.settingtype=$('#form_setting_type').val();
        $data.description=$('#form_machine_desc').val();
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
    // for(var key in machineTypes){
    //     $("#form_machine_type").append('<option value="'+key+'">'+machineTypes[key]+'</option>');
    // }
    // $("#form_machine_type").selectpicker({}).on('changed.bs.select', function (e) {
    //     var $val=$("#form_machine_type").selectpicker('val');
    //     $('#form_machine_type_input').val($val);
    // });
    for(key in machineSettingTypes){
        $("#form_setting_type").append('<option value="'+key+'">'+machineSettingTypes[key]+'</option>');
    }
    $("#form_setting_type").selectpicker({}).on('changed.bs.select', function (e) {
        var $val=$("#form_setting_type").selectpicker('val');
        $('#form_setting_type_input').val($val);
    });

    if(datas){
        dataLoad('#div_container',datas);//普通数据加载
        // $("#form_machine_type").selectpicker('val',datas.mtype);
        $("#form_setting_type").selectpicker('val',datas.settingtype);

        // $('#form_machine_type_input').val(datas.mtype);
        $('#form_setting_type_input').val(datas.settingtype);
    }

}

function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        stcd:{
            required:true
        },
        mname:{
            required:true
        },
        ip:{
            required:true,
            isTrueIP:true
        },
        port:{
            required:true,
            isTruePort:true
        },
        mno:{
            required:true
        },
        mtype_hide:{
            isSelected:true
        },
        settingtype_hide:{
            isSelected:true
        }
    };
    newJqueryValidate.jqueryValidate();

}

