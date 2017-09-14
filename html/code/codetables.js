var modelName = '数据字典';
$(document).ready(function(){
    $("#treegridrow").height(clientHeight - 230);
    reloadDate();
    $("[data-toggle='popover']").popover();
})
function  reloadDate() {
    $('#treegrid_table').html("");
    $('#treegrid_table').treegridData({
        id: 'codeId',
        parentColumn: 'parentId',
        type: "POST", //请求数据的ajax类型
        url: cors+"/Code/SystemCode/selectAllparams",   //请求数据的ajax的url
        ajaxParams: {}, //请求数据的ajax的data属性
        expandColumn: null,//在哪一列上面显示展开按钮
        bordered: true,  //是否显示边框
        expandAll: false,  //是否全部展开
        /*striped: true,*/
        columns: [
            {
                title: '词典名称',
                field: 'name',
                width:8,
                formatter : function(value, row, index) {
                    if(row.state=="closed"&&row.iconcls=="zmdi zmdi-file-text zmdi-hc-fw"){
                        return '<i class="zmdi zmdi-folder-outline zmdi-hc-fw"></i>'+value+'';
                    } else  if(row.iconcls!=""){
                        return '<i class="'+row.iconcls+'"></i>'+value+'';
                    }else{
                        return '<i class="zmdi zmdi-file-text zmdi-hc-fw"></i>'+value+'';
                    }
                }
            },
            {
                title: '词典编码',
                field: 'codeMyid',
                width:15
            },
            {
                title: '排序编码',
                field: 'sort',
                width:8
            },
            {
                title: '词典描述',
                field: 'description',
                width:8
            }
        ],
        isSuccess:function(data){
            if(data.code=='0'){
                return {'status':true,'data':data.data}
            }else{
                return {'status':false}
            }
        }
    });
}
function  addCode() {
    var row=$('#treegrid_table').treegridData('getRow');
    if(row==null){
        showtoastr("inverse", "请选中行,在进行新增！");
        return;
    }
    var permissionIds=row.permissionid;
    var parentIds=row.codeId;
    if(permissionIds==undefined||parentIds==undefined){
        showtoastr("inverse", "请选中行,在进行新增！");
        return;
    }
    if(row==null){
        showtoastr("inverse", "请选中行,在进行新增！");
        return;
    }
    openAddModel(row);
}
function openAddModel(curRow){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('code/addCode.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.3);
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
        },
        function(){
            relodPermissionId(curRow);
            relodParentId(curRow);
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){

            insertCode(addm);

        });
}
function  insertCode(addm) {
    if(newCodeJqueryValidate.jqueryValidForm()){
        var name=$("#name").val();
        var permissionId=$("#permissionId").val();
        var parentId=$("#parentId").val();
        var codeMyid=$("#codeMyid").val();
        var iconcls=$("#iconcls").val();
        var sort=$("#sort").val();
        var description=$("#description").val();
        getData(
            'post',
            '/Code/SystemCode/Insert',
            {'name': name,'permissionId': permissionId,'parentId': parentId,'codeMyid': codeMyid,'iconCls': iconcls,'sort': sort,'description':description},
            'json',
            function (data) {//success
                addm.close();
                showtoastr("inverse", data.desc);
                reloadDate();
            },function(obj){//error
                showtoastr("inverse", '数据加载异常');
            }
        );
    }

}
function delCode() {
    var row=$('#treegrid_table').treegridData('getRow');
    var codeId=row.codeId;
    var name=row.name;
    var parentId=row.parentId;
    var codeMyid=row.codeMyid;
  var closed=row.state;
    if(row==null){
        showtoastr("inverse","请选择需要删除的数据字典！");
        return;
    }
    if(parentId==""){
        showtoastr("inverse","模块不能删除！");
        return;
    }
    if(closed=="closed"){
        showtoastr("inverse","该节点含有子节点不能删除！");
        return;
    }
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除数据字典"+name+"？", function(){
        $.ajax({
            url: cors+"/Code/SystemCode/Del",
            datatype: 'json',
            data: {'codeId':codeId,"parentId":parentId,"codeMyid":codeMyid} ,
            type: "Post",
            success: function (data) {
                showtoastr("inverse",data.desc);
                reloadDate();
            },   headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });
    }, null);
}
function  editCode() {
    var row=$('#treegrid_table').treegridData('getRow');
    if(row==null){
        showtoastr("inverse", "请选中行！");
        return;
    }
    if(row.parentId==""){
        showtoastr("inverse", "模块不能编辑！");
        return;
    }
    openEditModel(row);
}
function openEditModel(curRow){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('code/editCode.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.3);
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
        },
        function(){
            editPermissionId(curRow);
            editParentId(curRow);
            loadeditcode(curRow);
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            editCodebyId(curRow);
        });
}
function  editCodebyId(curRow) {
    if(newCodeJqueryValidate.jqueryValidForm()){
        var name=$("#name").val();
        var codeMyid=$("#codeMyid").val();
        var iconcls=$("#iconcls").val();
        var sort=$("#sort").val();
        var description=$("#description").val();
        var codeId=curRow.codeId;
        getData(
            'post',
            '/Code/SystemCode/Update',
            {'name': name,'codeMyid': codeMyid,'iconCls': iconcls,'sort': sort,'description':description,"codeId":codeId},
            'json',
            function (data) {//success
                addm.close();
                showtoastr("inverse", data.desc);
                reloadDate();
            },function(obj){//error
                showtoastr("inverse", '数据加载异常');
            }
        );
    }


}