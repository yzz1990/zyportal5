/**
 * Created by yupc on 2017/4/18.
 */
var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var modelName = '在线用户信息';

$(document).ready(function() {
    $editTable = $('#main_table1')

    initTable($editTable);//table初始化



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
    }, {
        field : 'ip',
        title : '登录IP',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    }, {
        field : 'area',
        title : '登录地',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    }, {
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
    } ]

    ];
    $tableOption.url = cors+'/sys/sysRedis/getOnlineUserList';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();

}



//刷新
function reloadTableData() {
    if(newBootstrapTable){
        newBootstrapTable.refreshBootstrapTableOptions();
    }
}

