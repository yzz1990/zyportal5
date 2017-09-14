/**
 * Created by yupc on 2017/4/18.
 */

$editTable = $('#main_table1');
var currentPage = 1;
var currentPageSize = 10;
var newBootstrapTable;
var ajaxData={};
var type;
var wechatid;

// 绑定按钮事件
$(document).ready(function() {
    $('#type').selectpicker({});  //初始化
    $('#msgtype').selectpicker({});
    initgzhselect();
    initTable($editTable); // 调用函数，初始化表格

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

function getType(){
    type = $('#type').selectpicker('val');
}

function getWeChatId(){
    wechatid = $("#wxgzh").selectpicker('val');
}

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
        width:50
    }, {
        field : 'fromuser',
        title : '发送人',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50// 宽度
    },{
        field : 'touser',
        title : '发送对象',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80,// 宽度
        formatter : function(value, row, index) {
            if(row.isToAll=='true'){
                return "所有人"
            }else if(row.tagid!=''){
                return row.tagid;
            }else{
                return value;
            }
        }
    }, {
        field : 'msgtype',
        title : '消息类型',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80,// 宽度
        formatter : function(value, row, index) {
            if(row.type==0){
                return '客服消息—'+value;
            }else if(row.type==1){
                return '群发消息—'+value;
            }else{
                return value;
            }

        }
    }, {
        field : 'content',
        title : '消息内容',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80,// 宽度
        formatter : function(value, row, index) {
            if(row.msgtype=='文本消息'){
                if(value.length>5){
                    return "<a href='javascript:void(0);' onclick='getTextContent("+JSON.stringify(row)+")'>"+value.substring(0,5)+"..."+"</a>";
                }else{
                    return value;
                }
            }else if(row.msgtype=='图片消息'){
                return "<a href='javascript:void(0);' onclick='getMessage("+JSON.stringify(row)+")'><img style='width: 50px;height: 50px' src="+row.fileUrl+"></a>";
            }else if(row.msgtype=='图文消息'){
                row.content = row.content.replace(new RegExp("'","gm"),"\"");
                return "<a href='javascript:void(0);' onclick='getMpnews("+JSON.stringify(row)+")'>"+row.title+"</a>";
            }else if(row.msgtype=='语音消息'){
                return "<a href='javascript:void(0);' onclick='getMessage("+JSON.stringify(row)+")'>查看语音</a>";
            }else{
                return "<a href='javascript:void(0);' onclick='getMessage("+JSON.stringify(row)+")'>"+row.title+"</a>";
            }
        }
    }, {
        field : 'sendtime',
        title : '发送时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80,// 宽度
    }, {
        field : 'id',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80,// 宽度
        formatter : function(value, row, index) {
            return "<button class='btn btn-danger waves-effect' onclick='deleteMessage(\""+value+"\")'>删除</button>";
        }
    } ]
    ];

    $tableOption.url = cors+'/WeChatPlatform/message/queryMessage';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
}

//查询
function serachInfo() {
    ajaxData={};
    wechatid=$("#wxgzh").selectpicker('val');
    type = $("#type").selectpicker('val');
    msgtype = $("#msgtype").selectpicker('val');
    if(wechatid!=""){
        ajaxData.wechatid=wechatid;
    }
    if(type!=-1){
        ajaxData.type=type;
    }
    if(msgtype!=""){
        ajaxData.msgtype=msgtype;
    }
    newBootstrapTable.ajaxQuery=ajaxData;
    $editTable.bootstrapTable('refresh');
}

function deleteMessage(id){
    getData(
        'post',
        '/WeChatPlatform/message/delMessage',
        {'id':id},
        'json',
        function (data) {//success
            showtoastr("inverse", data.desc);
            $editTable.bootstrapTable('refresh');
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}

var detailm;
function getMpnews(row){
    detailm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "图文信息",
        $('<div></div>').load('WeChatPlatform/messageHistory/detail.html'),
        function(){

        },
        function(){
            debugger
            $('#mpnews_title').text(row.title);
            $('#timeAndAuthor').text(row.sendtime.substring(0,10)+"  "+row.author);
            $('#pic').attr('src',row.fileUrl);
            myReferer(row.content);
            $('#mpnews_content').html(row.content);
        },
        function(dialogItself){
            //cancel
            //addm.close();
        },
        function(dialogItself){
            detailm.close();
        });
}

var textm;
function getTextContent(row){
    textm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "文本信息",
        $('<div></div>').load('WeChatPlatform/messageHistory/textContent.html'),
        function(){

        },
        function(){
            $('#text_content').text(row.content);
        },
        function(dialogItself){
            //cancel
            //addm.close();
        },
        function(dialogItself){
            textm.close();
        });
}

function getMessage(row){
    if(row.msgtype=='音乐消息'){
        window.open(row.musicurl);
    }else if(row.msgtype=='语音消息'){
        window.open(row.fileUrl.replace(".amr",".mp3"));
    }else{
        window.open(row.fileUrl);
    }
}