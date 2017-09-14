(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    $form_addOrUpdate=$('#form_addOrUpdate');

})();


function formSubmit($modelObj,type,dt){
    var submitUrl='/system/menu/saveRoleMenu';
    var $data={'roleId':dt.id,'permissionid':$('#permissionSave_id').val()};

    if (jqueryValidForm($form_addOrUpdate)) {
        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                if(data.code=='0'){
                    //页面刷新
                    reloadTableData();
                    if($modelObj){
                        $modelObj.close();//关闭
                    }
                    showtoastr("inverse",data.desc);
                }else{
                    showtoastr("inverse",data.desc);
                }
                return true;
            },function(obj){//error
                showtoastr("inverse", '未知错误');
                return false;
            }
        );
    }
}