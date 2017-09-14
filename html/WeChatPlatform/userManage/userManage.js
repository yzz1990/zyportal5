/**
 * Created by yupc on 2017/7/14.
 */

var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在

var newBootstrapTable;
var weChatId;

$(document).ready(function() {
    $editTable = $('#main_table1')

    initgzhselect();
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
            debugger;
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

function inittagselect(){
    getData(
        'post',
        '/WeChatPlatform/tagManage/selectAll',
        null,
        'json',
        function (data) {//success
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $('#taglist').append('<option value="'+data.rows[i].tagid+'">'+data.rows[i].tagname+'</option>');
                }
            }
            $('#taglist').selectpicker({});  //初始化
        },function(obj){//error
            showtoastr("inverse", '分组列表加载异常');
        }
    );
}

/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstrapTable=MyDiyBootstrapTable($table);
    var $tableOption=newBootstrapTable.bootstrapTableOption;
    $tableOption.columns = [ [  {
        field : 'wechatid',
        title : '序号',
        formatter : newBootstrapTable.formatterIndexNo,
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50
    },{
        field : 'headimgurl',
        title : '头像',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,// 宽度
        formatter : function(value, row, index) {
            return "<div><img src='"+value+"' style='width:50px;height:50px'></div>";
        }
    },{
        field : 'nickname',
        title : '昵称',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100,// 宽度
        formatter : function(value, row, index) {
            if(value.length>5){
                return value.substring(0,5)+"...";
            }else{
                return value;
            }
        }
    }, {
        field : 'remark',
        title : '备注名',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
    }, {
        field : 'sex',
        title : '性别',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50,// 宽度
        formatter : function(value, row, index) {
            if(value==1){
                return '男';
            }else if(value==2){
                return '女';
            }else{
                return '未知';
            }
        }
    }, {
        field : 'city',
        title : '地址',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200,// 宽度
        formatter : function(value, row, index) {
            if(!row.province){
                return row.country;
            }else{
                if(!value){
                    return row.country+'—'+row.province;
                }else{
                    return row.country+'—'+row.province+'—'+value;
                }
            }
        }
    }, {
        field : 'subscribe',
        title : '关注状态',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100, // 宽度
        formatter : function(value, row, index) {
            if(value==0){
                return '未关注';
            }else{
                return '已关注';
            }
        }
    }, {
        field : 'subscribeTime',
        title : '关注时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            var d = new Date(value * 1000);
            return getFormatDate(d);
        }
        // 宽度
    }, {
        field : 'tagidList',
        title : '拥有标签',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200,
    }, {
        field : 'openid',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            if(value){
                return "<button class='btn btn-primary waves-effect' onclick='editRemark("+JSON.stringify(row)+")'>修改备注</button>";
            }
        }
    } ]
    ];
    $tableOption.url = cors+'/WeChatPlatform/userManage/selectAll';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
}

function getWeChatId(){
    weChatId = $('#wxgzh').selectpicker('val');
}

//查询
function serachInfo() {
    ajaxData={};
    weChatId=$("#wxgzh").selectpicker('val');
    if(weChatId!=""){
        ajaxData.wechatid=weChatId;
    }
    newBootstrapTable.ajaxQuery=ajaxData;
    $editTable.bootstrapTable('refresh');
}

function synchronize(){
    if(weChatId==''||weChatId==undefined){
        showtoastr("inverse","请选择公众号");
        return;
    }
    $.ajax({
        url: cors+"/WeChatPlatform/userManage/synchronize",
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

/*function getTagNameByTagid(tagid){
    $.ajax({
        url: cors+"/WeChatPlatform/tagManage/selectByTagid",
        datatype: 'json',
        data: {'tagid': tagid},
        type: "Post",
        success: function (data) {

            tagList = data.tagname+',';
        }
    });
}*/

function addtag(){
    var selectedRow = $selectedRowData;
    if (selectedRow == '' || selectedRow == undefined) {
        showtoastr("inverse", "请选择行");
        return;
    }
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "添加分组",
        $('<div></div>').load('WeChatPlatform/userManage/addTag.html'),
        function(){

        },
        function(){
            inittagselect();
            //reload(selectedRow);
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            //submit
            var tagid = $('#taglist').val();
            weChatId = selectedRow.wechatid;
            $.ajax({
                url: cors+"/WeChatPlatform/userManage/addTag",
                datatype: 'json',
                type: "Post",
                data: {'openid':selectedRow.openid,'tagid':tagid, 'weChatId':weChatId},
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


function reload(selectedRow){
    var openid = selectedRow.openid;
    weChatId = selectedRow.wechatid;
    $.ajax({
        url: cors+"/WeChatPlatform/tagManage/selectTagsByUser",
        datatype: 'json',
        data: {'openid':openid,'weChatId':weChatId} ,
        type: "Post",
        success: function (data) {
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $('#taglist').append('<option value="'+data[i].tagid+'">'+data[i].tagname+'</option>');
                }
            }
            $('#taglist').selectpicker({});
        },   headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}


function deletetag(){
    var selectedRow = $selectedRowData;
    if (selectedRow == '' || selectedRow == undefined) {
        showtoastr("inverse", "请选择行");
        return;
    }
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "删除分组",
        $('<div></div>').load('WeChatPlatform/userManage/deleteTag.html'),
        function(){

        },
        function(){
            reload(selectedRow);
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            //submit
            var tagid = $('#taglist').val();
            weChatId = selectedRow.wechatid;
            $.ajax({
                url: cors+"/WeChatPlatform/userManage/deleteTag",
                datatype: 'json',
                type: "Post",
                data: {'openid':selectedRow.openid,'tagid':tagid, 'weChatId':weChatId},
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

function editRemark(row){
    var openid = row.openid;
    weChatId = row.wechatid;
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "修改备注",
        $('<div></div>').load('WeChatPlatform/userManage/editRemark.html'),
        function(){

        },
        function(){
            initFormDatas(row);
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            //submit
            var remark = $('#remark').val();
            $.ajax({
                url: cors+"/WeChatPlatform/userManage/remark",
                datatype: 'json',
                type: "Post",
                data: {'openid':openid,'remark':remark, 'weChatId':weChatId},
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

function initFormDatas(datas){
    dataLoad('#div_container',datas);//普通数据加载
}
