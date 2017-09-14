/**
 * Created by yupc on 2017/4/18.
 */
var machineStatus={
    'on':{
        'message':'在线',
        'color':'green'
    },
    'off':{
        'message':'离线',
        'color':'red'

    }
}

var machineTypes={
    'm1':'类型1',
    'm2':'类型aa',
    'm3':'类型&&&'
}

var machineSettingTypes={
    'ipSetting':'IP配置',
    'simSetting':'SIM配置'
}

var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var modelName = '设备信息';

var newBootstrapTable;


$(document).ready(function() {
    $editTable = $('#main_table1')


    $("#main_stcd").selectpicker({});
    // for(var key in machineTypes){
    //     $("#main_machine_type").append('<option value="'+key+'">'+machineTypes[key]+'</option>');
    // }
    // $("#main_machine_type").selectpicker({});
    for(var key in machineStatus){
        $("#main_machine_status").append('<option value="'+key+'">'+machineStatus[key].message+'</option>');
    }
    $("#main_machine_status").selectpicker({});

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
            field : 'mname',
            title : '设备名称',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:100 // 宽度
    },{
        field : 'stnm',
        title : '所属站点',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    }, {
        field : 'stcd',
        title : '站点编号',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    },
    // {
    //     field : 'mno',
    //     title : '设备序列号',
    //     align : 'center',
    //     valign : 'middle',// 垂直居中
    //     width:60// 宽度
    // },
    // {
    //     field : 'mtype',
    //     title : '设备类型',
    //     align : 'center',
    //     valign : 'middle',// 垂直居中
    //     width:50,// 宽度
    //     formatter : function(value, row, index) {
    //         if(value){
    //             if(machineTypes.hasOwnProperty(value)){
    //                 return machineTypes[value];
    //             }
    //         }
    //         return '';
    //
    //     }
    // },
    {
        field : 'ip',
        title : '设备IP',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    }, {
        field : 'port',
        title : '设备端口号',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50// 宽度
    }, {
        field : 'settingtype',
        title : '配置类型',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50,// 宽度
        formatter : function(value, row, index) {
            if(value){
                if(machineSettingTypes.hasOwnProperty(value)){
                    return machineSettingTypes[value];
                }
            }
            return '';

        }
    }, {
        field : 'status',
        title : '状态',
        align : 'center',
        valign : 'middle',// 垂直居中
        width: 30,// 宽度
        formatter : function(value, row, index) {
            if(value){
                if(machineStatus.hasOwnProperty(value)){
                    return '<span style="color: '+machineStatus[value].color+'">'+machineStatus[value].message+'</span>';
                }
            }
            return '';

        }
    }, {
        field : 'getdatatime',
        title : '最新数据时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80
        // 宽度
    }, {
        field : 'caozuo',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150,
        formatter : function(value, row, index) {
            var btnStr='';
            btnStr+="<button class='btn btn-success waves-effect' onclick='getHis("+JSON.stringify(row)+")'>日志</button>";
            btnStr+="&nbsp;<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>";
            btnStr+="&nbsp;<button class='btn btn-danger waves-effect' onclick='deleteRow("+JSON.stringify(row)+")'>删除</button>";
            return btnStr;
        }
    } ]

    ];
    $tableOption.url = cors+'/system/machineMan/machineList';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();

}


//查询
function serachInfo() {
    var ajaxData={};

    var search_stcd=$("#main_stcd").selectpicker('val');
    var search_machine_name=$("#main_machine_name").val();
    // var search_machine_no=$("#main_machine_no").val();
    // var search_machine_type=$("#main_machine_type").selectpicker('val');
    // var search_machine_status=$("#main_machine_status").selectpicker('val');

    if(search_stcd!=''){
        ajaxData.stcd=search_stcd;
    }
    if(search_machine_name!=''){
        ajaxData.mname=search_machine_name;
    }
    // if(search_machine_no!=''){
    //     ajaxData.mno=search_machine_no;
    // }
    // if(search_machine_type!=''){
    //     ajaxData.mtype=search_machine_type;
    // }
    // if(search_machine_status!=''){
    //     ajaxData.status=search_machine_status;
    // }

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
        $('<div></div>').load('background/equipment/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            initFormDatas(null);
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
        $('<div></div>').load('background/equipment/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            initFormDatas(lineData);
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(updatem,'update',lineData);
        });
}



var delm;
function deleteRow(lineData){
    delm=messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该设备信息？", function(){
        getData(
            'post',
            '/system/machineMan/delMachine',
            lineData ,
            'json',
            function (data) {//success
                if(data.code=='60003'){
                    //页面刷新
                    reloadTableData();
                    //delm.close();//关闭
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

var hism;
function getHis(lineData){
    hism=messageConfimDialogOnlyClose(BootstrapDialog.TYPE_INFO,
        '日志  ( '+lineData.mname+' )',
        $('<div></div>').load('background/equipment/his.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            initView(lineData);
        },
        function(){//取消,点关闭按钮

        });
}





