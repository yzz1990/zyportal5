$(document).ready(function(){

    var formName='form_addOrUpdate';
    var modelName='通讯录';
    var addOrUpdateUrl='background/smsbook/addOrUpdate.html';
    var queryUrl='/sms/book/bookList';
    var addUrl='/sms/book/addBook';
    var editUrl='/sms/book/updateBook';
    var delUrl='/sms/book/deleteBook';

    $("#treegridrow").height(clientHeight - 240);

    //根目录ID
    var rootId='00000000000000000000000000000000';

    //加载数据
    loadData();

    function loadData(){
        $('#tb').html('');
        $('#tb').treegridData({
            id: 'id',
            parentColumn: 'pid',
            type: "POST", //请求数据的ajax类型
            url: cors+queryUrl,   //请求数据的ajax的url
            ajaxParams: {}, //请求数据的ajax的data属性
            expandColumn: 'name',//在哪一列上面显示展开按钮
            bordered: true,  //是否显示边框
            expandAll: true,  //是否全部展开
            columns: [
                {
                    title: '名称',
                    field: 'name',
                    width:20
                },
                {
                    title: '描述',
                    field: 'description',
                    width:30
                },
                {
                    title: '创建时间',
                    field: 'createtime',
                    width:30
                }
            ],
            isSuccess:function(data){
                if(data.rows){
                    return {'status':true,'data':data.rows}
                }else{
                    return {'status':false}
                }
            }
        });
    }

    $('#add').click(function(){
        var row=$('#tb').treegridData('getRow');
        var $form;
        var addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
            "新增"+modelName,
            $('<div></div>').load(addOrUpdateUrl),
            function(){//页面显示前

            },
            function(){//页面显示后               
                $form=$('#'+formName);

                if(row){
                    $('#pid').val(row.id);
                }else{
                    //$('#pid').val(rootId);
                }
                $form.validate({
                    rules: {
                        name: {
                            required: true
                        }
                    }
                });
            },
            function(){//取消,点关闭按钮
            },
            function(){//确定
                if ($form.valid()) {
                    getData(
                        'post',
                        addUrl,
                        $form.serialize() ,
                        'json',
                        function (data) {
                            showtoastr("inverse",data.desc);
                            //if(data.code=='0'||data.code=='1'){
                                loadData();
                                if(addm){
                                    addm.close();//关闭
                                }
                            //}
                            return true;
                        },function(obj){//error
                            showtoastr("inverse", '未知错误');
                            return false;
                        }
                    );
                }
            });
    });

    $('#edit').click(function(){
        var row=$('#tb').treegridData('getRow');
        if(row){
            var $form;
            var updatem=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
                "编辑"+modelName,
                $('<div></div>').load(addOrUpdateUrl),
                function(){//页面显示前

                },
                function(){//页面显示后                   
                    $form=$('#'+formName);
                    var options={
                        id:formName,
                        data:row,
                        filter:function(){
                        }
                    };
                    initForm(options);
                    $form.validate({
                        rules: {
                            name: {
                                required: true
                            }
                        }
                    });
                },
                function(){//取消,点关闭按钮
                },
                function(){//确定
                    if ($form.valid()) {
                        getData(
                            'post',
                            editUrl,
                            $form.serialize() ,
                            'json',
                            function (data) {
                                showtoastr("inverse",data.desc);
                                //if(data.code=='0'||data.code=='5'){
                                    loadData();
                                    if(updatem){
                                        updatem.close();//关闭
                                    }
                                //}
                                return true;
                            },function(obj){//error
                                showtoastr("inverse", '位置错误！');
                                return false;
                            }
                        );
                    }
                });
        }else{
            showtoastr("inverse", '请选择一条数据！');
            return false;
        }
    });

    $('#del').click(function(){
        var row=$('#tb').treegridData('getRow');
        if(row){
            var rowId = row.id;
            var json={id:rowId};
            // if(rowId==rootId){
            //     showtoastr("inverse", '根目录不能删除！');
            //     return false;
            // }
            var delm=messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该通讯录？", function(){
                getData(
                    'post',
                    delUrl,
                    json ,
                    'json',
                    function (data) {//success
                        showtoastr("inverse",data.desc);
                        //if(data.code=='0'||data.code=='3'){
                            //页面刷新
                            loadData();
                            delm.close();//关闭
                        //}
                        return true;
                    },function(obj){//error
                        showtoastr("inverse", '未知错误');
                        return false;
                    }
                );
            }, null);
        }else{
            showtoastr("inverse", '请选择一条数据！');
            return false;
        }
    });
});