/**
 * Created by yupc on 2017/7/13.
 */

var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var currentPage = 1;
var currentPageSize = 10;
var newBootstrapTable;
var weChatId;
var modelName = '标签';

// 绑定按钮事件
$(document).ready(function() {
    $editTable = $('#main_table1')
    initgzhselect();
    //$('#tagName').selectpicker({});
    initTable($editTable);//table初始化
    $("[data-toggle='popover']").popover();
    $("[data-toggle='tooltip']").tooltip();

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
            weChatId = $('#wxgzh').selectpicker('val');
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}

/*function getTagName(){
    weChatId = $('#wxgzh').selectpicker('val');
    getData(
        'post',
        '/WeChatPlatform/tagManage/selectAll',
        {'wechatid':weChatId},
        'json',
        function (data) {//success
            //  alert(data.rows.length);
            document.getElementById("tagName").options.length=0;
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $('#tagName').append('<option value="'+data.rows[i].tagid+'">'+data.rows[i].tagname+'</option>');
                }
            }
            $('#tagName').selectpicker('refresh');  //初始化
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}*/

/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstrapTable=MyDiyBootstrapTable($table);
    var $tableOption= newBootstrapTable.bootstrapTableOption;
    /*ajaxData={};
    weChatId=$("#wxgzh").selectpicker('val');
    if(weChatId!=""){
        ajaxData.weChatId=weChatId;
    }
    $tableOption.param(ajaxData);*/
    $tableOption.columns = [ [  {
        field : 'xh',
        title : '序号',
        formatter : function(value, row, index) {
            return index + 1 + (currentPage - 1) * currentPageSize;
        },
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200
    }, {
        field : 'tagname',
        title : '标签名称',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:400
        // 宽度
    }, {
        field : 'tagid',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:400,
        formatter : function(value, row, index) {
            if(value){
                return "<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>   <button class='btn btn-danger waves-effect' onclick='deletetag("+JSON.stringify(row)+")'>删除</button>";
            }
        }
    } ]

    ];

    $tableOption.url = cors+'/WeChatPlatform/tagManage/selectAll';
    $tableOption.queryParams({'wechatid':weChatId});
    $tableOption.queryParamsType = 'json';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
}

//查询
function serachInfo() {
    ajaxData={};
    weChatId=$("#wxgzh").selectpicker('val');
    var tagName = $('#tagName').val();
    if(weChatId!=""){
        ajaxData.wechatid=weChatId;
    }
    if(tagName!=""){
        ajaxData.tagname=tagName;
    }
    newBootstrapTable.ajaxQuery=ajaxData;
    $editTable.bootstrapTable('refresh');
}

function getWeChatId(){
    weChatId = $("#wxgzh").selectpicker('val');
}

/*打开新增任务页面*/
function openAddModel(){
    if(weChatId==''||weChatId==undefined){
        showtoastr("inverse","请选择公众号");
        return;
    }
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('WeChatPlatform/tagManage/addOrUpdate.html'),
        function(){

        },
        function(){
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            //submit
            var tagName = $('#addTagName').val();

            $.ajax({
                url: cors+"/WeChatPlatform/tagManage/add",
                datatype: 'json',
                type: "Post",
                data: {'tagName':tagName, 'weChatId':weChatId} ,
                success: function (data) {
                    addm.close();
                    showtoastr("inverse",data.desc);
                    $editTable.bootstrapTable('refresh');
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });

        });
}





/*打开编辑任务页面*/
var updatem;
var updateData;
function openEditModel(row){
    weChatId = row.wechatid;
    var tagid = row.tagid;
    updatem=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('WeChatPlatform/tagManage/addOrUpdate.html'),
        function(){
        },
        function(){
            reload(value);
        },
        function(dialogItself){
        },
        function(dialogItself){
            //submit
            var tagName = $('#addTagName').val();

            $.ajax({
                url: cors+"/WeChatPlatform/tagManage/update",
                datatype: 'json',
                type: "Post",
                data: {'tagid':tagid,'tagName':tagName, 'weChatId': weChatId},
                success: function (data) {
                    updatem.close();
                    showtoastr("inverse",data.desc);
                    $editTable.bootstrapTable('refresh');
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });
        });

    /*var addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('background/menu/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后

        },
        function(){//取消,点关闭按钮
        },
        function(){//确定


        });*/


}
function reload(tagid) {
    $.ajax({
        url: cors+"/WeChatPlatform/tagManage/selectByTagid",
        datatype: 'json',
        data: {'tagid':tagid} ,
        type: "Post",
        success: function (data) {
            $('#addTagName').val(data.tagName);
        },   headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}


function  deletetag(row) {
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该标签？", function(){
        $.ajax({
            url: cors+"/WeChatPlatform/tagManage/delete",
            datatype: 'json',
            data: {'tagid':row.tagid,'weChatId': row.wechatid},
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

function synchronize(){
    if(weChatId==''||weChatId==undefined){
        showtoastr("inverse","请选择公众号");
        return;
    }
    $.ajax({
        url: cors+"/WeChatPlatform/tagManage/synchronize",
        datatype: 'json',
        data: {'weChatId': weChatId},
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
}

/*
//刷新
function reloadTableData() {
    if(newBootstrapTable){
        newBootstrapTable.refreshBootstrapTableOptions();
    }
}*/
