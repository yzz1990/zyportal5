/**
 * Created by yupc on 2017/4/18.
 */
var $addparams;
$editTable = $('#main_table1');
var $editTable1;
var ajaxData={};
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在
var newBootstraptreegridTable;
var currentPage = 1;
var currentPageSize = 10;
var modelName = '参数信息';
var v = '';
//Selection
//模糊查
/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstraptreegridTable=MyDiyBootstrapTable($table);
    var $tableOption= newBootstraptreegridTable.bootstrapTableOption;
    $tableOption.columns = [ [  {
        field : 'groupType',
        title : '',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:500
        // 宽度

    }
    ]
    ];
    $tableOption.pagination=false;
    $tableOption.url = cors+'/Param/Parameter/getGroup';
    $tableOption.onExpandRow=function (index, row, $Subdetail) {
        getChildTalbe(index, row, $Subdetail);
    };
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
    $tableOption.detailView=true;
    newBootstraptreegridTable.ajaxQuery=ajaxData;
    newBootstraptreegridTable.initBootstrapTable();
    newBootstraptreegridTable.ajaxQuery="";
}
function initChildTable($table) {
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
        title : '参数名称',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'myid',
        title : '参数编码',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'state',
        title : '是否启用',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            if("Y"==row.state){
                var str="是";
                return "<font name='state' data-value='Y' color='green'>"+str+"</font>";
            }else {
                var str="否";
                return "<font name='state' data-value='N' color='red'>"+str+"</font>";
            }

        }

    }, {
        field : 'value',
        title : '参数值',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            if(row.value=="true"){
                return "<font name='param' data-value='t' color='green'>是<font>";
            }else if(row.value=="false"){
                return "<font name='param' data-value='f' color='red'>否<font>";
            }else{
                return  "<font name='params' >"+ row.value;+"<font>";

            }

        }

    }, {
        field : 'description',
        title : '参数描述',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150,
        formatter : function(value, row, index) {
            if(value!=""){
                return  "<font name='descr' >"+ row.description+"<font>";
            }else{
                return  "<font name='descr' >&nbsp;<font>";
            }

        }
    }]

    ];

    $tableOption.detailView=false;

    $tableOption.pagination=false, //启动分页
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
    $tableOption.url = cors+'/Param/Parameter/getParam';
    $tableOption.height=clientHeight - 400;
    $tableOption.onLoadSuccess=$onLoadSuccess;
    newBootstraptreegridTable.ajaxQuery=ajaxData;
    newBootstraptreegridTable.initBootstrapTable();

}
var $onLoadSuccess=function(data) {

    $("[name='state']").editable({
        url: function (params) {
            var sName = $(this).attr("name");
            var parameterId= curRow.parameterId;
            var description=curRow.description;
            var values=curRow.value;
            var state=params.value;
            $.ajax({
                type: 'POST',
                url: cors+"/Param/Parameter/Update",
                data: {"parameterId":parameterId,"description":description,"value":values,"state":state},
                dataType: 'JSON',
                success: function (data, textStatus, jqXHR) {
                    showtoastr("inverse", data.desc);
                    $editTable1.bootstrapTable('refresh');
                },headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                },
                error: function () {  $editTable1.bootstrapTable('refresh');}
            });
        },
        type: 'select',
        title: '是否启用',
        source: function () {
            var result = [];
            result.push({ value:"Y", text:"是"});
            result.push({ value:"N", text:"否" });
            return result;
        }
    });
    //更新下拉框参数值
    $("[name='param']").editable({
        url: function (params) {
            var sName = $(this).attr("name");
            var parameterId= curRow.parameterId;
            var description=curRow.description;
            var values=params.value;
            if(values=="t"){
                values="true";
            }else {
                values="false";
            }
            var state=curRow.state;
            $.ajax({
                type: 'POST',
                url:cors+"/Param/Parameter/Update",
                data: {"parameterId":parameterId,"description":description,"value":values,"state":state},
                dataType: 'JSON',
                success: function (data, textStatus, jqXHR) {
                    showtoastr("inverse", data.desc);
                    $editTable1.bootstrapTable('refresh');
                },headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                },
                error: function () {  $editTable1.bootstrapTable('refresh');}
            });
        },
        type: 'select',
        title: '参数值',
        source: function () {
            var result = [];
            result.push({ value:"t", text:"是"});
            result.push({ value:"f", text:"否" });
            return result;
        }
    });
    //更新描述
    $("[name='descr']").editable({
        url: function (params) {
            var sName = $(this).attr("name");
            var parameterId= curRow.parameterId;
            var description=params.value;
            var value=curRow.value;
            var state=curRow.state;
            $.ajax({
                type: 'POST',
                url: cors+"/Param/Parameter/Update",
                data: {"parameterId":parameterId,"description":description,"value":value,"state":state},
                dataType: 'JSON',
                success: function (data, textStatus, jqXHR) {
                    showtoastr("inverse", data.desc);
                    $editTable1.bootstrapTable('refresh');
                }, headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
            },
                error: function () { $editTable1.bootstrapTable('refresh');}
            });
        },
        type: 'text',
        title: '参数描述'
    });
    //更新text参数值
    $("[name='params']").editable({
        url: function (params) {
            var sName = $(this).attr("name");
            var parameterId= curRow.parameterId;
            var description=curRow.description;
            var values=params.value;
            var state=curRow.state;
            $.ajax({
                type: 'POST',
                url: cors+"/Param/Parameter/Update",
                data: {"parameterId":parameterId,"description":description,"value":values,"state":state},
                dataType: 'JSON',
                success: function (data, textStatus, jqXHR) {
                    showtoastr("inverse", data.desc);
                    $editTable1.bootstrapTable('refresh');
                },headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                },
                error: function () { $editTable1.bootstrapTable('refresh');}
            });
        },
        type: 'text',
        title: '参数值'
    });
};
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
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('parameter/addparam.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.35);
        },
        function(){
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            insertParam(addm);

        });
}
function validForm(){
    return $("#addOrUpdatefrom").valid();
}

/*打开编辑任务页面*/
var updatem;
var updateData;
function openEditModel(value){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load(''),
        function(){

        },
        function(){
            reload(value);
        },
        function(dialogItself){

        },
        function(dialogItself){

        });

}
function  getChildTalbe(index, row, $Subdetail) {
    newBootstraptreegridTable.ajaxQuery="";
    ajaxData={};
   $editTable1= $Subdetail.html('<table id="child_table"></table>').find('table');
/*   v="";*/
   if(row.groupType!=""){
       ajaxData.groupType=row.groupType;
      /* v="AND GROUP_TYPE = '"+row.groupType+"'";*/
   }
    initChildTable($editTable1);
}
var parameditor="{'options':{'off':false,'on':true},'type':'checkbox'}";
function insertParam(addm) {
    if(jqueryValidForm($addparams)){
        var groupType=$("#groupType").val();
        var name=$("#name").val();
        var myid=$("#myid").val();
        var state=$("#state").val();
        var editorType=$("#editorType").val();
        var value=$("#value").val();
        var description=$("#description").val();
        getData(
            'post',
            '/Param/Parameter/Insert',
            {'groupType': groupType, 'name': name,'myid':myid,'state':state,'editorType':editorType,'value':value,'description':description,'editor':parameditor},
            'json',
            function (data) {//success
                addm.close();
                showtoastr("inverse", data.desc);
                $editTable.bootstrapTable('refresh');
            },function(obj){//error
                showtoastr("inverse", '数据加载异常');
            }
        );
    }

}
function delparm() {
    var parmId=curRow.parameterId;
    var myId=curRow.myid;
    var name=curRow.name;
    if(parmId==undefined){
        showtoastr("inverse","请选择需要删除的系统参数");
        return;
    }
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除系统参数"+name+"？", function(){
        $.ajax({
            url: cors+"/Param/Parameter/Delete",
            datatype: 'json',
            data: {'parameterId':parmId,"myid":myId} ,
            type: "Post",
            success: function (data) {
                showtoastr("inverse",data.desc);
                $editTable.bootstrapTable('refresh');
            },   headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });
    }, null);
}
