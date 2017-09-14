/**
 * Created by yupc on 2017/4/18.
 */
var $addparams1;
var a=1;
$editTable = $('#main_table1');
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在
var newBootstraptreegridTable;
var ajaxData={};
var currentPage = 1;
var currentPageSize = 10;

var modelName = '添加富文本编辑器';
var v = '';
//Selection
//模糊查询
function serachAreaInfo() {
    currentPage=1;
    ajaxData={};
    var name=$("#serachName").val();
    var note=$("#serachNote").val();
    var des=$("#serachDes").val();
  /*  var street=$("#serachStreet").val();*/
    if(name!=""){
        ajaxData.name=name;

    }
    if(note!=""){
        ajaxData.description=note;

    }
    if(des!=""){
        ajaxData.basename=des;

    }
    newBootstraptreegridTable.ajaxQuery=ajaxData;
    $editTable.bootstrapTable('refresh');
}
/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstraptreegridTable=MyDiyBootstrapTable($table);
    var $tableOption= newBootstraptreegridTable.bootstrapTableOption;
    $tableOption.columns = [ [  {
        field : 'xh',
        title : '序号',
        formatter : function(value, row, index) {
            return index + 1 + (currentPage - 1) * currentPageSize;
        },
        align : 'center',
        valign : 'middle',// 垂直居中
        width:70
    }, {
        field : 'name',
        title : '标题',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'description',
        title : '具体描述',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'createtime',
        title : '创建时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150
    },  {
        field : 'id',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150,
        formatter : function(value, row, index) {
            if(value){
                return "<button class='btn btn-primary waves-effect' onclick='openEditModel(\""+value+"\")'>预览</button> &nbsp;<button class='btn bgm-green waves-effect' onclick='changeModel(\""+value+"\")'>编辑</button>&nbsp; <button class='btn btn-danger waves-effect' onclick='deleditor(\""+value+"\")'>删除</button>";
            }
        }
    } ]

    ];
    $tableOption.url = cors+'/Editor/SystemEditor/getEditors';
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
    newBootstraptreegridTable.initBootstrapTable();
    newBootstraptreegridTable.ajaxQuery="";

}
// 绑定按钮事件
$(document).ready(function() {
    $("#roleName").selectpicker({});  //初始化
    initTable($editTable); // 调用函数，初始化表格

    $("#btn_search").click(function() {// 查询
        dataSearch();
    });
    $("#btn_GasHis").click(function() {//燃气历史
        openAddModel();
    });
    $("[data-toggle='popover']").popover();
});
/*打开新增任务页面*/
function openAddModel(){
    addmeditor=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('editor/addeditor.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            $dialogParentDiv.css('height','');
        },
        function(){
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            //submit
            if(jqueryValidForm($addparams1)){
                var content=encodeURIComponent(editor.txt.html());
                var deec=$("#editordescr").val();
                var name=$("#name").val();
                var fileurl=$("#fileUrl").val();
                var fileBaseName=$("#fileBaseName").val();
                $.ajax({
                    type: 'POST',
                    url: cors+"/Editor/SystemEditor/Insert",
                    data: {"content":content,"description":deec,"name":name,"fileurl":fileurl,"basename":fileBaseName},
                    dataType: 'JSON',
                    success: function (data, textStatus, jqXHR) {
                        addmeditor.close();
                        showtoastr("inverse", data.desc);
                        $editTable.bootstrapTable('refresh');
                    },headers: {
                        "Authorization":"Bearer "+getLocalStorage('token') ,
                        "Accept":"application/json;charset=UTF-8"
                    },
                    error: function () {  $editTable1.bootstrapTable('refresh');}
                });
            }


        });
}
function validForm(){
    return $("#addOrUpdatefrom").valid();
}

/*打开编辑任务页面*/
var updatem;
var updateData;
function openEditModel(value){
    window.open("editor/previeweditor.html?"+value+"");

}


function deleditor(editorId) {
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该富文本编辑器信息？", function(){
        $.ajax({
            url: cors+"/Editor/SystemEditor/Del",
            datatype: 'json',
            data: {'id':editorId} ,
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
function  changeModel(id) {
    addmeditor1=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "富文本编辑器修改",
        $('<div></div>').load('editor/addeditor.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            $dialogParentDiv.css('height','');
        },
        function(){
            changeEditor(id);
        },
        function(dialogItself){

        },
        function(dialogItself){
            if(jqueryValidForm($addparams1)){
                var content=encodeURIComponent(editor.txt.html());
                var deec=$("#editordescr").val();
                var name=$("#name").val();
                var fileurl=$("#fileUrl").val();
                var fileBaseName=$("#fileBaseName").val();
                $.ajax({
                    type: 'POST',
                    url: cors+"/Editor/SystemEditor/Update",
                    data: {"content":content,"description":deec,"name":name,"fileurl":fileurl,"basename":fileBaseName,"id":id},
                    dataType: 'JSON',
                    success: function (data, textStatus, jqXHR) {
                        addmeditor1.close();
                        showtoastr("inverse", data.desc);
                        $editTable.bootstrapTable('refresh');
                    },headers: {
                        "Authorization":"Bearer "+getLocalStorage('token') ,
                        "Accept":"application/json;charset=UTF-8"
                    },
                    error: function () {  $editTable1.bootstrapTable('refresh');}
                });
            }

        });
}

function changeEditor(id) {
    $.ajax({
        url: cors+"/Editor/SystemEditor/SelectEditorById",
        datatype: 'json',
        data: {'id':id} ,
        type: "Post",
        success: function (data) {
            data=data.data;
            var preBasename=data.basename.split(",");
            var preUrl=data.fileurl.split(",");
            for(var i=0;i<preBasename.length;i++){
                var he=$("#fj").height();
                if(preBasename[i]!=undefined&&preBasename[i]!=""&&i!="unique") {
                    $("#fjtable").append('<tr><td><a target="_blank" href=\"'+urlPathPre+preUrl[i]+'\" download=\"'+preBasename[i]+'\">'+preBasename[i]+'</a></td><td><button  class="btn bgm-green btn-icon-text waves-effect pull-right" onclick="delfuj(this,\''+preUrl[i]+'\',\''+preBasename[i]+'\')"><i class="zmdi zmdi-delete zmdi-hc-fw" ></i> 删除</button></td></tr>');
                    if(a!=1){
                        $("#fj").height(he+40);
                    }else if (a==1){
                        $("#fj").height(he+30);
                    }
                    a=a+1;
                }

            }
            myReferer(decodeURIComponent(data.content));
           editor.txt.html(decodeURIComponent(data.content));
            $("#name").val(data.name);
            $("#editordescr").val(data.description);
            $("#fileUrl").val(data.fileurl);
            $("#fileBaseName").val(data.basename);
        },   headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}