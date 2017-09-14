/**
 * Created by yupc on 2017/4/18.
 */
var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var modelName = '用户信息';

var newBootstrapTable;
var newOrgZtree;
var newRoleZTree;

$(document).ready(function() {
    $editTable = $('#main_table1')

    $("#search_status").selectpicker({});  //初始化

    initTable($editTable);//table初始化


    $("#btn_search").click(function() {// 查询
        dataSearch();
    });
    $("#btn_add").click(function() {
        openAddModel();
    });


    //组织下拉查询
    newOrgZtree=MyDiyZTreeInputSelect('treeDemo_searchorg',$('#search_organizeName'),$('#search_organizeId'),null,'/system/organization/tree',null,null);
    newOrgZtree.setting_SelectInput.check.chkboxType={"Y" : "s", "N" : "ps"};
    newOrgZtree.initZtree_SelectInput();
    //角色下拉查询
    newRoleZTree=MyDiyZTreeInputSelect('treeDemo_searchrole',$('#search_roleName'),$('#search_roleId'),null,'/system/role/getRoleZtreeSimpleData',null,null);
    newRoleZTree.initZtree_SelectInput();

});

var search_orgids='';
var search_roleids='';

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
            field : 'username',
            title : '用户账号',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
        },{
        field : 'realname',
        title : '用户名',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    },
    // {
    //     field : 'password',
    //     title : '用户密码',
    //     align : 'left',
    //     valign : 'middle',// 垂直居中
    //     width:60
    //     // 宽度
    // },
    // {
    //     field : 'email',
    //     title : '邮箱',
    //     align : 'left',
    //     valign : 'middle',// 垂直居中
    //     width:100
    //     // 宽度
    // },
    // {
    //     field : 'tel',
    //     title : '电话',
    //     align : 'left',
    //     valign : 'middle',// 垂直居中
    //     width:100
    //     // 宽度
    // },
    {
            field : 'organizeName',
            title : '组织',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100
            // 宽度
    }, {
        field : 'roleName',
        title : '角色',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    },
    // {
    //     field : 'description',
    //     title : '描述',
    //     align : 'left',
    //     valign : 'middle',// 垂直居中
    //     width:100// 宽度
    // },
    {
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
    },
    {
        field : 'ip',
        title : '最新登录IP',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    },
    {
        field : 'area',
        title : '最新登录地',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    },
    {
        field : 'updateDate',
        title : '最新登录时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,// 宽度
        formatter : function(value, row, index) {
            if(value){
                return new Date(parseInt(value)).format('yyyy-MM-dd hh:mm:ss');
            }
            return '';
        }
    },
    {
        field : 'caozuo',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150,
        formatter : function(value, row, index) {
            var btnStr="<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>";
            if(row.status=='1'){//启用中
                btnStr+= "&nbsp;<button class='btn bgm-gray waves-effect' onclick='changeUserStatus("+JSON.stringify(row)+",\"jinyong\")'>禁用</button>";
            }else{
                btnStr+= "&nbsp;<button class='btn bgm-green waves-effect' onclick='changeUserStatus("+JSON.stringify(row)+",\"qiyong\")'>启用</button>";
            }
            btnStr+="&nbsp;<button class='btn btn-danger waves-effect' onclick='deleteRow("+JSON.stringify(row)+")'>删除</button>";

            return btnStr;
        }
    } ]

    ];
    $tableOption.url = cors+'/system/user/userList';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();

}


//查询
function serachInfo() {
    var ajaxData={};

    var search_username=$("#search_username").val();
    var search_realname=$("#search_realname").val();
    var search_orgid=$('#search_organizeId').val();//选中的组织
    var search_roleid=$('#search_roleId').val();//选中的组织
    var search_status=$('#search_status').selectpicker('val');

    if(search_username!=''){
        // v+=" and username like '%"+search_username+"%' ";
        ajaxData.username=search_username;
    }
    if(search_realname!=''){
        // v+=" and realname like '%"+search_realname+"%' ";
        ajaxData.realname=search_realname;
    }
    if(search_orgid!=''){
        // search_orgids=search_orgid;
        ajaxData.orgids=search_orgid;
    }else{
        // search_orgids='';
    }

    if(search_roleid!=''){
        // search_roleids=search_roleid;
        ajaxData.roleids=search_roleid;
    }else{
        // search_roleids='';
    }


    if(search_status!=''){
        // v+=" and status='"+search_status+"' ";
        ajaxData.status=search_status;
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
    var newAddOrgTree;
    var newAddRoleTree;
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('background/user/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            //组织
            newAddOrgTree=MyDiyZTreeInputSelect('treeDemo',$('#form_organizeName'),$('#form_organizeId'),null,'/system/organization/tree',null,null);
            newAddOrgTree.initZtree_SelectInput();
            //角色
            newAddRoleTree=MyDiyZTreeInputSelect('treeDemo2',$('#form_roleName'),$('#form_roleId'),null,'/system/role/getRoleZtreeSimpleData',null,null);
            newAddRoleTree.initZtree_SelectInput();


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
    var newEditOrgTree;
    var newEditRoleTree;
    updatem=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('background/user/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            //数据填充
            initFormDatas(lineData);

            //组织
            var orgIdData=lineData.organizeId;
            var orgIdArr=[];
            if(orgIdData!=null && orgIdData!=undefined){
                orgIdArr=orgIdData.split(',');
            }
            newEditOrgTree=MyDiyZTreeInputSelect('treeDemo',$('#form_organizeName'),$('#form_organizeId'),null,'/system/organization/tree',null,orgIdArr);
            newEditOrgTree.initZtree_SelectInput();
            //角色
            var roleIdData=lineData.roleId;
            var roleIdArr=[];
            if(roleIdData!=null && roleIdData!=undefined){
                roleIdArr=roleIdData.split(',');
            }
            newEditRoleTree=MyDiyZTreeInputSelect('treeDemo2',$('#form_roleName'),$('#form_roleId'),null,'/system/role/getRoleZtreeSimpleData',null,roleIdArr);
            newEditRoleTree.initZtree_SelectInput();

        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(updatem,'update',lineData);
        });
}

//启用与禁用
function changeUserStatus(lineData,type){
    if(type=='qiyong'){
        lineData.status ='1';
    }else if(type=='jinyong'){
        lineData.status ='0';
    }else{
        return;
    }
    getData(
        'post',
        '/system/user/prohibitUserInfo',
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
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该用户信息？", function(){
        getData(
            'post',
            '/system/user/delUserInfo',
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






