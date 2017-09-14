/**
 * Created by yupc on 2017/4/18.
 */
var modelName = '通讯记录';

var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在
var newBootstrapTable;

$(document).ready(function() {
    $editTable = $('#main_table1');
    //table初始化
    initTable($editTable);
    $("#type").selectpicker({});  //初始化
    $("#state").selectpicker({});  //初始化

    // 查询
    $("#btn_search").click(function() {
        dataSearch();
    });
    //新增
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
        width:80
    },{
        field : 'fromman',
        title : '发送人',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:120 // 宽度
    },{
        field : 'subtime',
        title : '发送时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    },{
        field : 'type',
        title : '类型',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100, // 宽度
        formatter : function(value, row, index) {
            var stateTxt;
            // if(value==1) stateTxt = "<label style='color:white;background-color: blue;padding:5px;'>已发送</label>";
            // else stateTxt = "<label style='color:white;background-color: green; padding:5px;'>未发送</label>";
            if(value==1) stateTxt = "手动发送";
            else stateTxt = "任务发送";
            return stateTxt;
        }   
    },{
        field : 'success',
        title : '成功条数',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    },{
        field : 'failure',
        title : '失败条数',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    },{
        field : 'state',
        title : '状态',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,//宽度
        formatter : function(value, row, index) {
            var stateTxt;
            // if(value==1) stateTxt = "<label style='color:white;background-color: blue;padding:5px;'>已发送</label>";
            // else stateTxt = "<label style='color:white;background-color: green; padding:5px;'>未发送</label>";
            if(value==1) stateTxt = "<label style='color:blue;'>已发送</label>";
            else stateTxt = "<label style='color:green;'>未发送</label>";
            return stateTxt;
        }   
    }, {
        field : 'caozuo',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            var btnStr="<button class='btn btn-primary waves-effect' onclick='openDetailModel("+JSON.stringify(row)+")'>详情</button>";
            btnStr+="&nbsp;<button class='btn btn-danger waves-effect' onclick='deleteRow("+JSON.stringify(row)+")'>删除</button>";

            return btnStr;
        }
    }]
    ];
    $tableOption.url = cors+'/sms/record/recordList';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
}

//查询
function serachInfo() {
    var ajaxData={};
    var fromman=$("#fromman").val();
    if(fromman!=''){
        ajaxData.fromman=fromman;
    }
    var type=$("#type").selectpicker('val');
    if(type!=''){
        ajaxData.type=type;
    }
    var state=$("#state").selectpicker('val');
    if(state!=''){
        ajaxData.state=state;
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
var addOpt;
function openAddModel(){
    addOpt=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('background/smsrecord/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后

        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(addOpt,'add',null);
        });
}

/*打开编辑页面*/
var updateOpt;
function openEditModel(lineData){
    updateOpt=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('background/smsrecord/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            initFormDatas(lineData);
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(updateOpt,'update',lineData);
        });
}

/*打开编辑页面*/
var detailOpt;
function openDetailModel(lineData){
    detailOpt=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "短信详情",
        $('<div></div>').load('background/smsrecord/detail.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            initFormDatas(lineData);
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            if(detailOpt){
                //关闭
                detailOpt.close();
            }
        });
}

var deleteOpt;
function deleteRow(lineData){
    deleteOpt=messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该通讯记录？", function(){
        getData(
            'post',
            '/sms/record/deleteRecord',
            lineData ,
            'json',
            function (data) {//success
                //if(data.code=='3'){
                    //页面刷新
                    reloadTableData();
                    //关闭
                    deleteOpt.close();
                //}
                showtoastr("inverse",data.desc);
                return true;
            },function(obj){//error
                showtoastr("inverse", '未知错误');
                return false;
            }
        );
    }, null);
}
