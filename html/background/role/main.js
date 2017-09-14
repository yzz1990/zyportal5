/**
 * Created by yupc on 2017/4/18.
 */
var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var modelName = '角色信息';

var newBootstrapTable;

$(document).ready(function() {
    $editTable = $('#main_table1')

    $("#search_org").selectpicker({});  //初始化

    initTable($editTable);//table初始化

    $("#btn_search").click(function() {// 查询
        dataSearch();
    });
    $("#btn_add").click(function() {
        openAddModel();
    });


});


/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstrapTable=MyDiyBootstrapTable($table);
    var $tableOption=newBootstrapTable.bootstrapTableOption;
    $tableOption.columns = [ [  {
        field : 'xh',
        title : '序号',
        formatter : newBootstrapTable.formatterIndexNo,
        align : 'center',
        valign : 'middle',// 垂直居中
        width:70
    },{
            field : 'name',
            title : '角色名称',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100// 宽度
    },{
        field : 'identification',
        title : '标识',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:60// 宽度
    },{
        field : 'description',
        title : '角色描述',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:200// 宽度
    }, {
        field : 'sort',
        title : '排序',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:30// 宽度
    },{
        field : 'quanxian',
        title : '权限分配',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            return "<button class='btn bgm-green waves-effect' onclick='openPermissionModel("+JSON.stringify(row)+")'>分配</button>";
        }
    },{
        field : 'status',
        title : '状态',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:30,// 宽度
        formatter : function(value, row, index) {
            if(value=='1') {//启用中
                return '<span style="color: green;">启用</span>';
            }else{
                return '<span style="color: red;">禁用</span>';
            }
        }
    },{
        field : 'caozuo',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150,
        formatter : function(value, row, index) {
            var btnStr="<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>";
            if(row.status=='1') {//启用中
                btnStr+= "&nbsp;<button class='btn bgm-gray waves-effect' onclick='changeRoleStatus("+JSON.stringify(row)+",\"jinyong\")'>禁用</button>";
            }else{
                btnStr+= "&nbsp;<button class='btn bgm-green waves-effect' onclick='changeRoleStatus("+JSON.stringify(row)+",\"qiyong\")'>启用</button>";
            }
            btnStr+="&nbsp;<button class='btn btn-danger waves-effect' onclick='deleteRow("+JSON.stringify(row)+")'>删除</button>";
            return btnStr;
        }
    } ]];
    $tableOption.url = cors+'/system/role/roleList';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();

}


//查询
function serachInfo() {
    var ajaxData={};
    var search_name=$("#search_name").val();
var search_description=$('#search_description').val();
if(search_name!=''){
    //v+=" and name like '%"+search_name+"%' ";
    ajaxData.name=search_name;
}
if(search_description!=''){
    // v+=" and description like '%"+search_description+"%' ";
    ajaxData.description=search_description;
}
newBootstrapTable.ajaxQuery=ajaxData;
reloadTableData();
}

//刷新
function reloadTableData() {
    if(newBootstrapTable){
        newBootstrapTable.refreshBootstrapTableOptions();
    }
}


/*打开新增页面*/
var addm;
function openAddModel(){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('background/role/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后

        },
        function(){//取消,点关闭按钮
            //showtoastr("inverse", '取消');
        },
        function(){//确定
            formSubmit(addm,'add',null);
        });
}

/*打开编辑页面*/
var updatem;
function openEditModel(lineData){
    updatem=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('background/role/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            //数据填充
            initFormDatas(lineData);
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(updatem,'update',lineData);
        });
}

//启用与禁用
function changeRoleStatus(lineData,type){
    if(type=='qiyong'){
        lineData.status ='1';
    }else if(type=='jinyong'){
        lineData.status ='0';
    }else{
        return;
    }
    getData(
        'post',
        '/system/role/prohibitRole',
        lineData ,
        'json',
        function (data) {//success
            if(data.code=='60005'){
                //页面刷新
                reloadTableData();
            }
            showtoastr("inverse",data.desc);
            return true;
        },function(obj){//error
            showtoastr("inverse", '未知错误');
            return false;
        }
    );
}

var delm;
function deleteRow(lineData){
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该角色信息？", function(){
        getData(
            'post',
            '/system/role/delRole',
            lineData ,
            'json',
            function (data) {//success
                if(data.code=='60003'){
                    //页面刷新
                    reloadTableData();
                    delm.close();//关闭
                }
                showtoastr("inverse",data.desc);
                return true;
            },function(obj){//error
                showtoastr("inverse", '未知错误');
                return false;
            }
        );
    }, null);
}

//分配角色
var permissionm;
function openPermissionModel(lineData){
    var newPermissionTree;
    permissionm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "权限分配",
        $('<div></div>').load('background/role/permission.html'),
        function(){//页面显示前

        },
        function() {//页面显示后
            var pam = {'roleId': lineData.id};
            newPermissionTree=MyDiyZTreeInputSelect('permissionSave',null,$('#permissionSave_id'),null,'/system/menu/zTree',pam,null);
            newPermissionTree.initZtree_SelectInput();



            // var permissionTreeSetting = new Setting_SelectInput("permissionSave", null, $('#permissionSave_id')).$setting_SelectInput;
            // initZtree_SelectInput('permissionSave', permissionTreeSetting, null, $("#permissionSave_id"), null, "/system/menu/zTree", pam, null);
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(permissionm,'save',lineData);
        });
}


function validForm(){
    return $("#addOrUpdatefrom").valid();
}

