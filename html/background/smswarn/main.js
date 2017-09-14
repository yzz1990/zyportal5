/**
 * Created by yupc on 2017/4/18.
 */
var modelName = '短信预警';
var $editTable;
var newBootstrapTable;

$(document).ready(function() {
    $editTable = $('#main_table1')
    initTable($editTable);//table初始化

    $("#btn_search").click(function() {// 查询
        dataSearch();
    });
    $("#btn_add").click(function() {// 新增
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
        field : 'jobname',
        title : '任务名',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    },{
        field : 'groupname',
        title : '任务分组',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    },{
        field : 'tomans',
        title : '接收人员',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:150// 宽度
    }, {
        field : 'description',
        title : '描述',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    }, {
        field : 'caozuo',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80,
        formatter : function(value, row, index) {
            var returnBtn = "<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>" +
                "&nbsp;<button class='btn btn-danger waves-effect' onclick='deleteJob("+JSON.stringify(row)+")'>删除</button>";
            return returnBtn;
        }
    } ]];
    $tableOption.url = cors+'/sms/warn/warnList';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
}

//刷新
function reloadTableData() {
    if(newBootstrapTable){
        newBootstrapTable.refreshBootstrapTableOptions();
    }
}

//查询
function serachInfo() {
    var ajaxData={};
    var rwmc=$("#rw_name").val();
    if(rwmc!=''){
        ajaxData.jobname=rwmc;
    }    
    newBootstrapTable.ajaxQuery=ajaxData;
    reloadTableData();
}

/*打开新增任务页面*/
var addm;
function openAddModel(){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('background/smswarn/addOrUpdate.html'),
        function($dialogParentDiv){//页面显示前
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            // $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.65);
            // $dialogParentDiv.css('height',clientHeight*0.65);
        },
        function(){//页面显示后
            initSelectpicker(null);
        },
        function(){//取消,点关闭按钮
           
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
        $('<div></div>').load('background/smswarn/addOrUpdate.html'),
        function($dialogParentDiv){//页面显示前
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            // $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.65);
            // $dialogParentDiv.css('height',clientHeight*0.65);
        },
        function() {//页面显示后
            //数据填充
            initFormDatasQuartzAddEdit(lineData);
            $('#p_note').show();
            initSelectpicker(lineData);
            if (lineData){
                //赋值预警人员
                var tomans = lineData.tomans;
                var totels = lineData.totels;
                if (tomans && totels != "") {
                    var tomansArr = tomans.split(',');
                    var totelsArr = totels.split(',');
                    for (var i = 0; i < tomansArr.length; i++) {
                        var toman = tomansArr[i];
                        var totel = totelsArr[i];
                        var tag = toman + ":" + totel;
                        form_tomans_TagObj.addTag(tag);
                    }
                }
                //确认人员
                var formSMSPeople = form_tomans_TagObj.val();
                var formSMSPeopleArray = formSMSPeople.split(",");
                for(var i=0;i<formSMSPeopleArray.length;i++){
                    var tag = formSMSPeopleArray[i];
                    form_tomans_TagObj.removeTag(tag);
                    if(tag.indexOf(":")>-1)form_tomans_TagObj.addTag(tag);
                }
            }
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(updatem,'update');
        });
}

//删除任务
function deleteJob(lineData){
    messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该预警？", function(){
        getData('post',
            '/sms/warn/deleteWarn',
            lineData,
            'json',
            function(data){
                // if(data.code=='0'){
                    //页面刷新
                    reloadTableData();                    
                // }
                showtoastr("inverse",data.desc);
                return true;
            }, function(obj){
                showtoastr("inverse", '未知错误');
                return false;
            });
    }, null);
}
