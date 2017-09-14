/**
 * Created by yupc on 2017/4/18.
 */
$editTable = $('#main_table1');
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在
var newBootstraptreegridTable;
var ajaxData={};
var currentPage = 1;
var currentPageSize = 10;

var modelName = '养老院信息表';
var v = '';
//Selection
//模糊查询
function serachhomeInfo() {
    currentPage=1;
    ajaxData={};
    var name=$("#homename").val();
    var address=$("#homeaddress").val();
    var area=$("#homearea").val();
    if(name!=""){
        ajaxData.name=name;
    }
    if(address!=""){
        ajaxData.address=address;
    }
    if(area!=""){
        ajaxData.area=area;
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
        title : '养老院名称',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150
        // 宽度
    }, {
        field : 'address',
        title : '养老院地址',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150
        // 宽度
    }, {
        field : 'area',
        title : '所属区',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'phone',
        title : '联系电话',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
    },{
        field : 'createtime',
        title : '创建时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
    },
        {
        field : 'modifytime',
        title : '修改时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
    }, {
        field : 'id',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150,
        formatter : function(value, row, index) {
            if(value){
                return "<button class='btn btn-primary waves-effect' onclick='openEditModel(\""+value+"\")'>编辑</button>   <button class='btn btn-danger waves-effect' onclick='deleteArea(\""+value+"\")'>删除</button>";
            }
        }
    } ]

    ];
    $tableOption.url = cors+'/Pension/OldmanHome/getOldmanHomes';
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
});
/*打开新增定时任务页面*/
function openAddModel(){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div style="width: 100%;"></div >').load('oldmanhome/addhome.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.15);
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.43);

        },
        function(){
            loadareas();
        },
        function(dialogItself){
        },
        function(dialogItself){
            Inserthomeinfo(addm);
        });
}

function validForm(){
    return $("#addOrUpdatefrom").valid();
}

/*打开编辑定时任务页面*/
var updatem;
var updateData;
function openEditModel(value){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div style="height: 80px;width: 600px;"></div>').load('oldmanhome/addhome.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.15);
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.43);
        },
        function(){
            reload(value);
        },
        function(dialogItself){

        },
        function(dialogItself){
            Updatehomeinfo(addm,value);
        });
}
function Inserthomeinfo(addm) {
    var name=$("#name").val();
    var address=$("#address").val();
    var area=$("#arealoda").val();
    var phone=$("#phone").val();
    var reg= new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$");
    var reg2=new RegExp("^(0\\d{2}-\\d{7,8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$");

    if(name==""||address==""||area==""||phone==""){
        showtoastr("inverse","请填写完整养老院信息！");
        return;
    }
    if(!reg.test(phone)&&!reg2.test(phone)){
        showtoastr("inverse","请输入正确的电话号码！");
        return;
    }
    $.ajax({
        url: cors+"/Pension/OldmanHome/Insert",
        datatype: 'json',
        type: "Post",
        data: {'name':name, 'address': address,'area':area,'phone':phone} ,
        success: function (data) {
            addm.close();
            showtoastr("inverse",data.desc);
            $editTable.bootstrapTable('refresh');

        },   headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}
function reload(id) {
    $.ajax({
        url: cors+"/Pension/OldmanHome/SelectOldmanhomeById",
        datatype: 'json',
        data: {'id':id} ,
        type: "Post",
        success: function (data) {
            data=data.data;
            $("#name").val(data.name);
           $("#address").val(data.address);
           $("#phone").val(data.phone);
            loadchoose(data.area);

        },   headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}
function Updatehomeinfo(addm,id) {
    var name=$("#name").val();
    var address=$("#address").val();
    var area=$("#arealoda").val();
    var phone=$("#phone").val();
    var reg= new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{7,8}$");
    var reg2=new RegExp("^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$");

    if(name==""||address==""||area==""||phone==""){
        showtoastr("inverse","请填写完整养老院信息！");
        return;
    }
    if(!reg.test(phone)&&!reg2.test(phone)){
        showtoastr("inverse","请输入正确的电话号码！");
        return;
    }
    $.ajax({
        url: cors+"/Pension/OldmanHome/Update",
        datatype: 'json',
        type: "Post",
        data: {'name':name, 'address': address,'area':area,'phone':phone,'id':id} ,
        success: function (data) {
            addm.close();
            showtoastr("inverse",data.desc);
            $editTable.bootstrapTable('refresh');

        },   headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}
function  deleteArea(value) {
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该养老院信息？", function(){
        $.ajax({
            url: cors+"/Pension/OldmanHome/Del",
            datatype: 'json',
            data: {'id':value},
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
