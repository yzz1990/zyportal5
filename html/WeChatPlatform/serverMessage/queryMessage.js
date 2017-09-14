/**
 * Created by yupc on 2017/4/18.
 */

$editTable = $('#main_table1');
var currentPage = 1;
var currentPageSize = 10;
var newBootstrapTable;
var ajaxData={};

// 绑定按钮事件
$(document).ready(function() {
    initTable($editTable); // 调用函数，初始化表格

});

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
    },{
        field : 'touser',
        title : '发送对象',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:150// 宽度
    }, {
        field : 'msgtype',
        title : '消息类型',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:50,// 宽度
        formatter : function(value, row, index) {
            if(value=='text'){
                return '文本';
            }else if(value=='image'){
                return '图片';
            }else if(value=='video'){
                return '视频';
            }else if(value=='voice'){
                return '语音';
            }else if(value=='music'){
                return '音乐';
            }else if(value=='news'||value=='mpnews'){
                return '图文';
            }else{
                return '未知';
            }
        }
    }, {
        field : 'content',
        title : '文本消息内容',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    }, {
        field : 'mediaId',
        title : '媒体ID',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    }, {
        field : 'thumbMediaId',
        title : '缩略图的媒体ID',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80// 宽度
    }, {
        field : 'title',
        title : '标题',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100, // 宽度
    }, {
        field : 'description',
        title : '描述',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100, // 宽度
    }, {
        field : 'musicurl',
        title : '音乐链接',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100
    }, {
        field : 'hqmusicurl',
        title : '高品质音乐链接',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200,
    }, {
        field : 'url',
        title : '图文消息链接',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200,
    }, {
        field : 'picurl',
        title : '图文消息图片链接',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200,
    }, {
        field : 'sendtime',
        title : '发送时间',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:200,
    } ]
    ];

    $tableOption.url = cors+'/WeChatPlatform/kfMessage/queryMessage';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
}

