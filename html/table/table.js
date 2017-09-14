/**
 * Created by yupc on 2017/4/18.
 */
$editTable = $('#main_table1');
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var currentPage = 1;
var currentPageSize = 10;

var modelName = '餐饮用户使用燃气记录';
var v = '';
//Selection

/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable() {
    v+=' and isusegas=1 ';//只查询使用过燃气的
    var $tableOption = $bootstrapTableOption;
    $tableOption.columns = [ [ {
     title : "",// 标题
     field : 'danxuan',
     align : "center",// 水平
     valign : 'middle',// 垂直居中
     checkbox : true
     }, {
        field : 'xh',
        title : '序号',
        formatter : function(value, row, index) {
            return index + 1 + (currentPage - 1) * currentPageSize;
        },
        align : 'center',
        valign : 'middle',// 垂直居中
        width:70
    }, {
        field : 'ssqyMc',
        title : '所属区域',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'restaurantname',
        title : '用户名称',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:150
        // 宽度
    }, {
        field : 'restaurantpeople',
        title : '负责人',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'restauranttel',
        title : '联系方式',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100
    }, {
        field : 'restaurantsafetyofficer',
        title : '安全员',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100
    }, {
        field : 'isscan',
        title : '绑定二维码情况',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            if(value==0){
                return '<span class="label label-danger icon_state_myDiy">否</span>';
            }else if(value==1){
//				return '<button class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="left" title="Refresh inbox"><i class="fa fa-refresh"></i> Refresh</button>';
                return '<span class="label label-success icon_state_myDiy" data-toggle="tooltip" data-placement="right" title="绑定二维码:'+row.scancode+'">是</span>';
            }else{
                return '-';
            }
        }
    } ] ];
    $tableOption.url = 'table/package.json';
    $tableOption.onClickRow=$onClickRow;
    $tableOption.height=clientHeight - 230;
    initBootstrapTable($editTable, $tableOption, null);

}
// 绑定按钮事件
$(document).ready(function() {
    $("#roleName").selectpicker({});  //初始化
    initTable(); // 调用函数，初始化表格
    $("#btn_search").click(function() {// 查询
        dataSearch();
    });
    $("#btn_GasHis").click(function() {//燃气历史
        openAddModel();
    });
});
/*打开新增定时任务页面*/
var addm;
function openAddModel(){
    addm=messageConfimDialog(BootstrapDialog.TYPE_INFO,"新增"+modelName,$('<div></div>').load('table/add.html'),addOrEditSubmit,null,openAddModelInit,null);
}
function openAddModelInit(){
    // validForm();
    // $("#zgh").hide();
}

function validForm(){
    return $("#addOrUpdatefrom").valid();
}

/*打开编辑定时任务页面*/
var updatem;
var updateData;
function openEditModel(){
    if($selectedRowIndex==undefined || $selectedRowData==undefined){
        showtoastr("warning", noSelectedRowInfo);
    }else{
        updateData=$selectedRowData;
        updatem=messageConfimDialog(BootstrapDialog.TYPE_INFO,"编辑"+modelName,$('<div></div>').load(ctx+'/foreground/jdxxgl/aqjcxx/addOrEdit.jsp'),addOrEditSubmit,null,dataLoadEx,['#addOrEditDiv',$selectedRowData,initEditPageAQJCXX]);
    }
//	var row = $editTable.bootstrapTable('getSelections');
}