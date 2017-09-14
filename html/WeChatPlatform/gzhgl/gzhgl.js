/**
 * Created by yupc on 2017/7/11.
 */
$editTable = $('#main_table1');
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var currentPage = 1;
var currentPageSize = 10;
var newBootstrapTable;
var ajaxData={};
var modelName = '公众号';
var v = '';

(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    $form_addOrUpdate=$('#form_addOrUpdate');

    validateElement($form_addOrUpdate);

})();

// 绑定按钮事件
$(document).ready(function() {
    $('#gzhlx').selectpicker({});
    initgzhselect();
    initTable($editTable); // 调用函数，初始化表格

    $form_addOrUpdate=$('#form_addOrUpdate');
    validateElement($form_addOrUpdate);

});

function initgzhselect(){
    $('#wxgzh').append('<option value="">请选择公众号</option>');
    getData(
        'post',
        '/WeChatPlatform/AccountDevelopInfo/selectAll',
        null,
        'json',
        function (data) {//success
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $('#wxgzh').append('<option value="'+data.rows[i].id+'">'+data.rows[i].name+'</option>');
                }
            }
            $('#wxgzh').selectpicker({});  //初始化
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}

function getgzhselect(){
    var typecode = $('#gzhlx').selectpicker('val');
    getData(
        'post',
        '/WeChatPlatform/AccountDevelopInfo/selectAll',
        {'typecode':typecode},
        'json',
        function (data) {//success
          //  alert(data.rows.length);
            document.getElementById("wxgzh").options.length=0;
            $('#wxgzh').append('<option value="">请选择公众号</option>')
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $('#wxgzh').append('<option value="'+data.rows[i].id+'">'+data.rows[i].name+'</option>');
                }
            }
            $('#wxgzh').selectpicker('refresh');  //初始化
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}

/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstrapTable=MyDiyBootstrapTable($table);
    var $tableOption= newBootstrapTable.bootstrapTableOption;
    $tableOption.columns = [ [  {
        field : 'xh',
        title : '序号',
        formatter : function(value, row, index) {
            return index + 1 + (currentPage - 1) * currentPageSize;
        },
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50
    }, {
        field : 'name',
        title : '公众号名称',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'account',
        title : '账号',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150
        // 宽度
    }, {
        field : 'typecode',
        title : '类型',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    },{
        field : 'iplist',
        title : '白名单',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
    }, {
        field : 'id',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:120,
        formatter : function(value, row, index) {
            if(value){
                return "<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>   <button class='btn btn-danger waves-effect' onclick='deletegzh(\""+value+"\")'>删除</button>";
            }
        }
    } ]

    ];
    $tableOption.url = cors+'/WeChatPlatform/AccountDevelopInfo/selectAll';
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
    $tableOption.height=clientHeight - 230;
    newBootstrapTable.initBootstrapTable();
    newBootstrapTable.ajaxQuery="";

}

//查询
function serachInfo() {
    ajaxData={};
    var id=$("#wxgzh").selectpicker('val');
    var typecode = $("#gzhlx").selectpicker('val');
    if(id!=""){
        ajaxData.id=id;
    }
    if(typecode!=""){
        ajaxData.typecode=typecode;
    }
    newBootstrapTable.ajaxQuery=ajaxData;
    $editTable.bootstrapTable('refresh');
}

var addm;
/*打开新增任务页面*/
function openAddModel(){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('WeChatPlatform/gzhgl/addOrUpdate.html'),
        function(){

        },
        function(){
            $("#typecode").selectpicker({});
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            //submit
            formSubmit(addm,'add',null);

        });
}

/*打开编辑任务页面*/
var updatem;
function openEditModel(lineData){
    updatem=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('WeChatPlatform/gzhgl/addOrUpdate.html'),
        function(){
        },
        function(){
            $("#typecode").selectpicker({});
            initFormDatas(lineData);
        },
        function(dialogItself){

        },
        function(dialogItself){
        //submit
            formSubmit(updatem,'update',lineData);

    });
}


function  deletegzh(value) {
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该公众号信息？", function(){
        $.ajax({
            url: cors+"/WeChatPlatform/AccountDevelopInfo/delete",
            datatype: 'json',
            data: {'id':value} ,
            type: "Post",
            success: function (data) {
                showtoastr("inverse",data.desc);
                $editTable.bootstrapTable('refresh');
            },
            headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });
    }, null);
}


function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        name:{
            required:true
        },
        appid:{
            required:true
        },
        appsecret:{
            required:true,
        }
    };
    newJqueryValidate.jqueryValidate();

}
//刷新
function reloadTableData() {
    if(newBootstrapTable){
        newBootstrapTable.refreshBootstrapTableOptions();
    }
}