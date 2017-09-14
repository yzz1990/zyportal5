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
        submitUrl='/sms/man/addMan';
        $data = $form_addOrUpdate.serialize();
    }else{
        submitUrl='/sms/man/updateMan';
        $data=dt;
        $data.name=$('#form_name').val();
        $data.telephone=$('#form_telephone').val();
        $data.bookid=$('#form_bookId').val();
        $data.bookname=$('#form_bookName').val();
        $data.sort=$('#form_sort').val();
        $data.remark=$('#form_remark').val();
    }
    if (newJqueryValidate.jqueryValidForm()) {
        var telephone = $('#form_telephone').val();
        if(!chechTelephone(telephone)){
            showtoastr("inverse", '手机号码格式不对，请检查！');
            return false;
        }
        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                //if(data.code=='1'||data.code=='5'){
                    //页面刷新
                    reloadTableData();
                    if($modelObj){
                        //关闭
                        $modelObj.close();
                    }
                //}
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
        telephone:{
            required:true,
        },
        bookname:{
            required:true,
        }
    };
    newJqueryValidate.jqueryValidate();
}
