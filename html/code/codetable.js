/*
var $treegridTable;
var $childtable;
var newBootstraptreegridTable;
var newCodeJqueryValidate;
var ajaxData={};
var modelName = '数据字典';
$(document).ready(function() {
    $treegridTable=$("#treegrid_table");
    initTable($treegridTable);//table初始化

})
function initTable($table) {
    newBootstraptreegridTable=MyDiyBootstrapTable($table);

    var $tableOption= newBootstraptreegridTable.bootstrapTableOption;
    if($table!=$treegridTable){

        $tableOption.columns = [ [  {
            field : 'name',
            title : '词典名称',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100,// 宽度
            formatter : function(value, row, index) {

                if(row.state=="closed"&&row.iconcls=="zmdi zmdi-file-text zmdi-hc-fw"){
                    return '<span><i class="zmdi zmdi-folder-outline zmdi-hc-fw"></i>'+value+'</span>';
                } else  if(row.iconcls!=""){
                    return '<span><i class="'+row.iconcls+'"></i>'+value+'</span>';
                }else{

                    return '<span><i class="zmdi zmdi-file-text zmdi-hc-fw"></i>'+value+'</span>';
                }
            }

        },{
            field : 'codeMyid',
            title : '词典编码',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
        }, {
            field : 'sort',
            title : '排序编码',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
        },{
            field : 'description',
            title : '词典描述',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
        } ]

        ];
    }else {
        $tableOption.columns = [ [  {
            field : 'name',
            title : '',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100,
            formatter : function(value, row, index) {
                if(row.state=="closed"&&row.iconcls==""){
                    return '<span><i class="zmdi zmdi-folder-outline zmdi-hc-fw"></i>'+value+'</span>';
                } else  if(row.iconcls!=""){
                    return '<span><i class="'+row.iconcls+'"></i>'+value+'</span>';
                }else{

                    return '<span><i class="zmdi zmdi-file-text zmdi-hc-fw"></i>'+value+'</span>';
                }
            }
            // 宽度
        },{
            field : 'codeMyid',
            title : '',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
        }, {
            field : 'sort',
            title : '',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
        },{
            field : 'description',
            title : '',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
        } ]

        ];
    }

    if($table!=$treegridTable){
        $tableOption.height=clientHeight - 400;

    }
    $tableOption.pagination=false;
    $tableOption.url = cors+'/Code/SystemCode/selectAll';
    $tableOption.onExpandRow=function (index, row, $Subdetail) {
        getTreegridTalbe(index, row, $Subdetail);
    };
    $tableOption.onClickRow=function(item, $element){
        curRow = item;
        if($element.hasClass('selected')){
            $element.removeClass('selected');
            $selectedRowIndex=undefined;
            $selectedRowData=undefined;
        }else{
            $element.parent().find('tr.selected').removeClass('selected')
            $element.addClass('selected');
            $selectedRowIndex=$element[0].sectionRowIndex;
            $selectedRowData=this.data[$selectedRowIndex];
        }
    }
    $tableOption.detailView=true;
    newBootstraptreegridTable.ajaxQuery=ajaxData;
    newBootstraptreegridTable.initBootstrapTable();
    newBootstraptreegridTable.ajaxQuery="";

}
var tableindex=1;
function  getTreegridTalbe(index, row, $Subdetail) {
    ajaxData={};
    var tableid="child_table"+tableindex;
    $childtable= $Subdetail.html('<table id="'+tableid+'" style="border: 1px"></table>').find('table');
    v="";
    if(row.state=="open"){
        return;
    }
    if(row.codeId!=""){
        ajaxData.codeId=row.codeId;
    }
    initTable($childtable);
    tableindex+1;
}
function  addCode() {
    if(curRow.codeId==undefined){
        showtoastr("inverse", "请选中行！");
        return;
    }
    openAddModel(curRow);
    curRow= {};
}

function openAddModel(curRow){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('code/addCode.html'),
        function(){

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
                $("#treegrid_table").bootstrapTable('refresh');
            },function(obj){//error
                showtoastr("inverse", '数据加载异常');
            }
        );
    }

}
function delCode() {
    var codeId=curRow.codeId;
    var name=curRow.name;
    var parentId=curRow.parentId;
    var codeMyid=curRow.codeMyid;
    if(codeId==undefined){
        showtoastr("inverse","请选择需要删除的数据字典");
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
                $("#treegrid_table").bootstrapTable('refresh');
            },   headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });
    }, null);
}
function  editCode() {
    if(curRow.codeId==undefined){
        showtoastr("inverse", "请选中行！");
        return;
    }
    if(curRow.parentId==""){
        showtoastr("inverse", "模块不能编辑！");
        return;
    }
    openEditModel(curRow);
    curRow= {};
}
function openEditModel(curRow){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('code/editCode.html'),
        function(){

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
                $("#treegrid_table").bootstrapTable('refresh');
            },function(obj){//error
                showtoastr("inverse", '数据加载异常');
            }
        );
    }


}*/
