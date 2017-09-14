/**
 * Created by yupc on 2017/4/18.
 */
var modelName = '通讯人员';

var $editTable;
var addOrEditColNum = undefined;// 当前新增或编辑的行的index,undefined为不存在
var newBookZtree;
var newBootstrapTable;

$(document).ready(function() {
    $editTable = $('#main_table1');
    //table初始化
    initTable($editTable);

    //通讯录下拉查询
    newBookZtree=MyDiyZTreeInputSelect('tree_searchBook',$('#search_bookName'),$('#search_bookId'),null,'/sms/book/bookTree',null,null);
    newBookZtree.setting_SelectInput.check.chkboxType={"Y" : "s", "N" : "ps"};
    newBookZtree.initZtree_SelectInput();

    // 查询
    $("#btn_search").click(function() {
        dataSearch();
    });
    //新增
    $("#btn_add").click(function() {
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
        formatter : newBootstrapTable.formatterIndexNo,
        align : 'center',
        valign : 'middle',// 垂直居中
        width:80
    },{
        field : 'name',
        title : '姓名',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:120 // 宽度
    },{
        field : 'telephone',
        title : '手机号码',
        align : 'left',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    },{
        field : 'bookname',
        title : '所属通讯录',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:150// 宽度
    },{
        field : 'remark',
        title : '备注',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100// 宽度
    }, {
        field : 'caozuo',
        title : '操作',
        align : 'center',
        valign : 'middle',// 垂直居中
        width:100,
        formatter : function(value, row, index) {
            var btnStr="<button class='btn btn-primary waves-effect' onclick='openEditModel("+JSON.stringify(row)+")'>编辑</button>";
            btnStr+="&nbsp;<button class='btn btn-danger waves-effect' onclick='deleteRow("+JSON.stringify(row)+")'>删除</button>";

            return btnStr;
        }
    }]
    ];
    $tableOption.url = cors+'/sms/man/manList';
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
}

//查询
function serachInfo() {
    var ajaxData={};
    var name=$("#name").val();
    var bookid = $('#search_bookId').val();

    if(name!=''){
        ajaxData.name=name;
    }
    if(bookid!=''){
        ajaxData.bookid=bookid;
    }
    newBootstrapTable.ajaxQuery=ajaxData;
    reloadTableData();
}

//刷新
function reloadTableData() {
    if(newBootstrapTable){
        newBootstrapTable.refreshBootstrapTableOptions();
    }
}

/*打开新增页面*/
var addOpt;
function openAddModel(){
    addOpt=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('background/smsman/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            //组织
            var newAddTree=MyDiyZTreeInputSelect('treeBook',$('#form_bookName'),$('#form_bookId'),null,'/sms/book/bookTree',null,null);
            newAddTree.initZtree_SelectInput();
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(addOpt,'add',null);
        });
}

/*打开编辑页面*/
var updateOpt;
function openEditModel(lineData){
    updateOpt=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑"+modelName,
        $('<div></div>').load('background/smsman/addOrUpdate.html'),
        function(){//页面显示前

        },
        function(){//页面显示后
            initFormDatas(lineData);
            //通讯录
            var bookidData=lineData.bookid;
            var bookidArr=[];
            if(bookidData!=null && bookidData!=undefined){
                bookidArr=bookidData.split(',');
            }
            var newEditTree=MyDiyZTreeInputSelect('treeBook',$('#form_bookName'),$('#form_bookId'),null,'/sms/book/bookTree',null,bookidArr);
            newEditTree.initZtree_SelectInput();
        },
        function(){//取消,点关闭按钮

        },
        function(){//确定
            formSubmit(updateOpt,'update',lineData);
        });
}

var deleteOpt;
function deleteRow(lineData){
    deleteOpt=messageConfimDialog(BootstrapDialog.INFO, "提示","是否删除该通讯人员？", function(){
        getData(
            'post',
            '/sms/man/deleteMan',
            lineData ,
            'json',
            function (data) {//success
                //if(data.code=='3'){
                    //页面刷新
                    reloadTableData();
                    //关闭
                    deleteOpt.close();
                //}
                showtoastr("inverse",data.desc);
                return true;
            },function(obj){//error
                showtoastr("inverse", '未知错误');
                return false;
            }
        );
    }, null);
}
