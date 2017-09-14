/**
 * Created by yupc on 2017/4/18.
 */
var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var modelName = '调度任务';

var quartzStatus={
    'NORMAL':'正常',
    'PAUSED':'暂停',
    'NONE':'未部署',
    'COMPLETE':'完成',
    'ERROR':'错误',
    'BLOCKED':'阻塞'
}

var newBootstrapTable;

$(document).ready(function() {
    $editTable = $('#main_table1')

    initTable($editTable);//table初始化

    $("#roleName").selectpicker({});  //初始化


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
        formatter :newBootstrapTable.formatterIndexNo,
        align : 'center',
        valign : 'middle',// 垂直居中
        width:20
    }, {
        field : 'showname',
        title : '任务名',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:50// 宽度
    },{
            field : 'groupname',
            title : '任务分组',
            align : 'left',
            valign : 'middle',// 垂直居中
            width:50// 宽度
    },
    /*{
        field : 'createtime',
        title : '任务开始时间',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    },*/
    /*{
        field : 'nexttime',
        title : '下次任务时间',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    }, */
     {
        field : 'cron',
        title : '表达式',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:50// 宽度
    }, {
        field : 'runcount',
        title : '运行次数',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:30,// 宽度
        formatter : function(value, row, index) {
            if(value && row.status!='NONE' ){
                return value;
            }
            return '';
        }
    }, {
        field : 'description',
        title : '任务描述',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:150// 宽度
    }, {
        field : 'status',
        title : '运行状态',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50,
        formatter : function(value, row, index) {
            if(value){
                return quartzStatus[value];
            }
            return '未识别';
        }
    }, {
        field : 'caozuo',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200,
        formatter : function(value, row, index) {
            var returnBtn='';
            if(row.status=='NORMAL' || row.status=='ERROR'){//正常,错误
                returnBtn+= "<button class='btn bgm-gray waves-effect' onclick='pauseJob("+JSON.stringify(row)+")'>暂停</button>";
            }
            if(row.status=='PAUSED' || row.status=='NONE' || row.status=='COMPLETE'){//暂停,未部署
                returnBtn+= "<button class='btn bgm-green waves-effect' onclick='resumeJob("+JSON.stringify(row)+")'>启动</button>";
            }
            if(row.status=='BLOCKED'){//阻塞
                returnBtn+= "<button class='btn bgm-purple waves-effect' onclick='removeJob("+JSON.stringify(row)+")'>移除</button>";
            }
            // if(row.status=='COMPLETE'){//已完成
            //     //无
            // }
            // returnBtn+= "&nbsp;<button  class='btn bgm-lime waves-effect showDetail' itindex='"+index+"' onclick='showDetail(this)'>查看详情</button>"
            returnBtn+= "&nbsp;<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>" +
                        "&nbsp;<button class='btn btn-danger waves-effect' onclick='deleteJob("+JSON.stringify(row)+")'>删除</button>";

            return returnBtn;
        }
    } ]];
    $tableOption.url = cors+'/quartz/quartzMan/list';
    $tableOption.onClickRow=$onClickRow;
    $tableOption.detailView=true;
    $tableOption.detailFormatter=function(index, row) {
        return '<table class="table" style="background-color: #a6e1ec;">' +
                    '<tbody>' +
                        '<tr>'+
                            '<th style="text-align: right;">任务名称:</th>' +
                            '<td style="text-align: left;">'+row.showname+'</td>' +
                            '<th style="text-align: right;">任务组:</th>' +
                            '<td style="text-align: left;">'+row.groupname+'</td>' +
                            '<th style="text-align: right;">运行状态:</th>' +
                            '<td style="text-align: left;">'+(row.status?quartzStatus[row.status]:'未识别')+'</td>' +
                            '<th style="text-align: right;">Cron表达式:</th>' +
                            '<td style="text-align: left;">'+row.cron+'</td>' +
                            '<th style="text-align: right;">运行次数:</th>' +
                            '<td style="text-align: left;">'+row.runcount+'</td>' +
                        '</tr> '+
                        '<tr>'+
                            '<th style="text-align: right;">任务类型:</th>' +
                            '<td style="text-align: left;">'+row.classorbean+'</td>' +
                            '<th style="text-align: right;">调用方法:</th>' +
                            '<td style="text-align: left;">'+row.usemethod+'</td>' +
                            '<th style="text-align: right;">创建时间:</th>' +
                            '<td style="text-align: left;">'+row.createtime+'</td>' +
                            '<th style="text-align: right;">修改时间:</th>' +
                            '<td style="text-align: left;">'+row.modifytime+'</td>' +
                            '<th style="text-align: right;">下次运行时间:</th>' +
                            '<td style="text-align: left;">'+row.nexttime+'</td>' +
                        '</tr> '+
                        '<tr>'+
                        '<th style="text-align: right;">描述:</th>' +
                        '<td style="text-align: left;">'+row.description+'</td>' +
                        '<th style="text-align: right;">&nbsp;</th>' +
                        '<td style="text-align: left;">&nbsp;</td>' +
                        '<th style="text-align: right;">&nbsp;</th>' +
                        '<td style="text-align: left;">&nbsp;</td>' +
                        '<th style="text-align: right;">&nbsp;</th>' +
                        '<td style="text-align: left;">&nbsp;</td>' +
                        '<th style="text-align: right;">&nbsp;</th>' +
                        '<td style="text-align: left;">&nbsp;</td>' +
                        '</tr> '+
                    '</tbody>'+
               '</table>';
    }
    newBootstrapTable.initBootstrapTable();

}


//暂停任务
function pauseJob(lineData){
    getData('post',
            '/quartz/quartzMan/pause',
            lineData,
            'json',
            function(data){
                if(data.code=='0'){
                    //页面刷新
                    reloadTableData();
                }
            }, function(obj){
                showtoastr("inverse", '未知错误');
                return false;
            });
}

//启动任务
function resumeJob(lineData){
    getData('post',
        '/quartz/quartzMan/resume',
        lineData,
        'json',
        function(data){
            if(data.code=='0'){
                //页面刷新
                reloadTableData();
            }
        }, function(obj){
            showtoastr("inverse", '未知错误');
            return false;
        });
}

//删除任务
function deleteJob(lineData){
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该任务？", function(){
        getData('post',
            '/quartz/quartzMan/delete',
            lineData,
            'json',
            function(data){
                if(data.code=='0'){
                    //页面刷新
                    reloadTableData();
                }
            }, function(obj){
                showtoastr("inverse", '未知错误');
                return false;
            });
    }, null);



}

function removeJob(lineData){
    getData('post',
        '/quartz/quartzMan/removeJob',
        lineData,
        'json',
        function(data){
            if(data.code=='0'){
                //页面刷新
                reloadTableData();
            }
        }, function(obj){
            showtoastr("inverse", '未知错误');
            return false;
        });
}

//显示/关闭 详情页面
function showDetail(obj){
    var rowIndex=$(obj).attr('itindex');
    var btnText=$(obj).text();
    if(btnText.indexOf('查看')>-1){
        $editTable.bootstrapTable('collapseAllRows');//先关闭所有的
        $('button.showDetail').text('查看详情');

        $editTable.bootstrapTable('expandRow', rowIndex);
        $(obj).text('关闭详情');
    }else{
        $editTable.bootstrapTable('collapseRow', rowIndex);
        $(obj).text('查看详情');
    }
}




//查询
function serachInfo() {
    var ajaxData={};
    var rwmc=$("#rw_name").val();
    // var rwstatus=$('#rw_status').selectpicker('val');
    if(rwmc!=''){
        // v+=" and showname like '%"+rwmc+"%' ";
        ajaxData.showname=rwmc;
    }
    // if(rwstatus!=''){
    //     // v+=" and status='"+rwstatus+"' ";
    //     ajaxData.status=rwstatus;
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

/*打开新增任务页面*/
var addm;
function openAddModel(){
    //addm=messageConfimDialog(BootstrapDialog.TYPE_INFO,"新增"+model_pre,$('<div></div>').load('oldmaninfo/addOrUpdate.html'),addOrEditSubmit,null,openAddModelInit,null);
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('background/quartz/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            initSelectpicker(null);
        },
        function(){//取消,点关闭按钮
            //showtoastr("inverse", '取消');
        },
        function(){//确定
            formSubmit(addm,'add');
        });
}

/*打开编辑任务页面*/
var updatem;
function openEditModel(lineData){
    updatem=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('background/quartz/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后

            //数据填充
            initFormDatasQuartzAddEdit(lineData);
            // $('#jobgroup').attr('disabled','disabled');
            // $('#jobname').attr('disabled','disabled');

            $('#p_note').show();
            initSelectpicker(lineData);
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(updatem,'update');
        });
}




