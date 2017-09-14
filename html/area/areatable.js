/**
 * Created by yupc on 2017/4/18.
 */
$editTable = $('#main_table1');
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var currentPage = 1;
var currentPageSize = 10;
var newBootstraptreegridTable;
var ajaxData={};
var modelName = '行政区域信息表';
var v = '';
//Selection
//模糊查询
function serachAreaInfo() {
    currentPage=1;
    ajaxData={};
    var city=$("#serachCity").val();
    var province=$("#serachProvince").val();
    var area=$("#serachArea").val();
    var street=$("#serachStreet").val();
    if(city!=""){
        ajaxData.city=city;
  /*      v+="and city like '%"+city+"%'";*/
    }
    if(province!=""){
        ajaxData.province=province;
 /*       v+="and province like '%"+province+"%'";*/
    }
    if(area!=""){
        ajaxData.area=area;
/*        v+="and area like '%"+area+"%'";*/
    }
    if(street!=""){
        ajaxData.street=street;
     /*   v+="and street like '%"+street+"%'";*/
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
        field : 'province',
        title : '所属省',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'city',
        title : '所属市',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'area',
        title : '所属区',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
        // 宽度
    }, {
        field : 'street',
        title : '所属街道/社区',
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
    }, {
        field : 'modifytime',
        title : '修改时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150
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
    $tableOption.url = cors+'/Area/AdministrationArea/getAreas';
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
/*打开新增任务页面*/
function openAddModel(){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('area/addarea.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.075);
        },
        function(){
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            //submit
            var choosearea=$("#city").val();
            var areas=choosearea.split("→");
           var province=areas[0];
            var city=areas[1];
            var area=areas[2];
            var street=areas[3];
            if(province==""||province==undefined||city==""||city==undefined||area==""||area==undefined||street==""||street==undefined){
                showtoastr("inverse","请填写完整行政区域信息！");
                return;
            }
            $.ajax({
                url: cors+"/Area/AdministrationArea/Insert",
                datatype: 'json',
                type: "Post",
                data: {'province':province, 'city': city,'area':area,'street':street} ,
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
function validForm(){
    return $("#addOrUpdatefrom").valid();
}

/*打开编辑任务页面*/
var updatem;
var updateData;
function openEditModel(value){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('area/addarea.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.075);
        },
        function(){
            reload(value);
        },
        function(dialogItself){

        },
        function(dialogItself){
            //submit
            var choosearea=$("#city").val();
            var areas=choosearea.split("→");
            var province=areas[0];
            var city=areas[1];
            var area=areas[2];
            var street=areas[3];
            if(province==""||province==undefined||city==""||city==undefined||area==""||area==undefined||street==""||street==undefined){
                showtoastr("inverse","请填写完整行政区域信息！");
                return;
            }
            $.ajax({
                url: cors+"/Area/AdministrationArea/Update",
                datatype: 'json',
                type: "Post",
                data: {'province':province, 'city': city,'area':area,"id":value,'street':street} ,
                success: function (data) {
                    addm.close();
                    showtoastr("inverse",data.desc);
                    $editTable.bootstrapTable('refresh');
                },   headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });
        });

}
function reload(id) {
    $.ajax({
        url: cors+"/Area/AdministrationArea/SelectAreaById",
        datatype: 'json',
        data: {'id':id} ,
        type: "Post",
        success: function (data) {
            data=data.data;
            $("#city").val(data.province+"→"+data.city+"→"+data.area+"→"+data.street);
        },   headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}
function  deleteArea(value) {
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该区域信息？", function(){
        $.ajax({
            url: cors+"/Area/AdministrationArea/Del",
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
