var $editTable;
var currentPage = 1;
var currentPageSize = 10;
var modelName = '数据库表单维护';
var v = '';
//Selection
var newBootstrapTable;
//模糊查询
function serachtable() {
    currentPage=1;
    ajaxData={};
    var serachinfo = $('#serachtable').val();
    if(serachinfo!=""){
        ajaxData.sqlParam=serachinfo;
    }
    newBootstrapTable.bootstrapTableOption.method = 'get';
    newBootstrapTable.ajaxQuery=ajaxData;
    $editTable.bootstrapTable('refresh');
    // var serachinfo = $('#serachtable').val();
    // v = serachinfo;
    // $editTable.bootstrapTable('refresh');
}

// 绑定按钮事件
$(document).ready(function () {
    $editTable = $('#main_table1');
    initTable($editTable); // 调用函数，初始化表格

    $("#btn_addnew").click(function () {
        openAddModel();
    });
    $("[data-toggle='popover']").popover();
});
/* 初始化表格,根据json的字段名称绑定数组,field和数据源中字段对应 */
function initTable($table) {
    newBootstrapTable =MyDiyBootstrapTable($table);
    var $tableOption=newBootstrapTable.bootstrapTableOption;
    $tableOption.columns = [[{
        field: 'xh',
        title: '序号',
        formatter: function (value, row, index) {
            return index + 1 + (currentPage - 1) * currentPageSize;
        },
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 50
    }, {
        field: 'tablename',
        title: '表名称',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 270
        // 宽度
    }, {
        field: 'tabledesc',
        title: '表描述',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 100
        // 宽度
    }, {
        field: 'synchronous',
        title: '是否同步',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 50,
        // 宽度
        formatter: function (value, row, index) {
            if (value == 1) {
                return "<i class='zmdi zmdi-check zmdi-hc-fw'style='color: #76EE00'></i>";
            } else if (value == 0) {
                return "<i class='zmdi zmdi-circle-o zmdi-hc-fw'style='color: #FFC107'></i>";
            } else if (value == 2) {
                return "<i class='zmdi zmdi-close zmdi-hc-fw'style='color: #E91E63'></i>";
            }
        }
    }, {
        field: 'createtime',
        title: '创建时间',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 150
    }, {
        field: 'modifytime',
        title: '修改时间',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 150
    }, {
        field: 'id',
        title: '操作',
        align: 'center',
        valign: 'middle',// 垂直居中
        width: 150,
        formatter: function (value, row, index) {
            if (value) {
                return "<button class='btn btn-primary waves-effect' onclick='openEditModel(\"" + value + "\")'>编辑</button>  " +
                    " <button class='btn btn-danger waves-effect' onclick='deleteArea(\"" + value + "\")'>删除</button>";
            }
        }
    }]

    ];
    $tableOption.method = 'get';
    $tableOption.detailView = false;
    $tableOption.url = cors + '/tables/administration/getTables';
    $tableOption.onClickRow = $onClickRow;
    $tableOption.height = clientHeight - 230;
    // initBootstrapTable($editTable, $tableOption, null);
    $tableOption.onClickRow=$onClickRow;
    newBootstrapTable.initBootstrapTable();
    // var $tableOption = $bootstrapTableOption;
    // $tableOption.columns = [[{
    //     field: 'xh',
    //     title: '序号',
    //     formatter: function (value, row, index) {
    //         return index + 1 + (currentPage - 1) * currentPageSize;
    //     },
    //     align: 'center',
    //     valign: 'middle',// 垂直居中
    //     width: 50
    // }, {
    //     field: 'tablename',
    //     title: '表名称',
    //     align: 'center',
    //     valign: 'middle',// 垂直居中
    //     width: 300
    //     // 宽度
    // }, {
    //     field: 'tabledesc',
    //     title: '表描述',
    //     align: 'center',
    //     valign: 'middle',// 垂直居中
    //     width: 100
    //     // 宽度
    // }, {
    //     field: 'synchronous',
    //     title: '是否同步',
    //     align: 'center',
    //     valign: 'middle',// 垂直居中
    //     width: 50,
    //     // 宽度
    //     formatter: function (value, row, index) {
    //         if (value == 1) {
    //             return "<i class='zmdi zmdi-check zmdi-hc-fw'style='color: #76EE00'></i>";
    //         } else if (value == 0) {
    //             return "<i class='zmdi zmdi-circle-o zmdi-hc-fw'style='color: #FFC107'></i>";
    //         } else if (value == 2) {
    //             return "<i class='zmdi zmdi-close zmdi-hc-fw'style='color: #E91E63'></i>";
    //         }
    //     }
    // }, {
    //     field: 'createtime',
    //     title: '创建时间',
    //     align: 'center',
    //     valign: 'middle',// 垂直居中
    //     width: 150
    // }, {
    //     field: 'modifytime',
    //     title: '修改时间',
    //     align: 'center',
    //     valign: 'middle',// 垂直居中
    //     width: 150
    // }, {
    //     field: 'id',
    //     title: '操作',
    //     align: 'center',
    //     valign: 'middle',// 垂直居中
    //     width: 150,
    //     formatter: function (value, row, index) {
    //         if (value) {
    //             return "<button class='btn btn-primary waves-effect' onclick='openEditModel(\"" + value + "\")'>编辑</button>  " +
    //                 " <button class='btn btn-danger waves-effect' onclick='deleteArea(\"" + value + "\")'>删除</button>";
    //         }
    //     }
    // }]
    //
    // ];
    // $tableOption.detailView = false;
    // $tableOption.url = cors + '/tables/administration/getTables';
    // $tableOption.onClickRow = $onClickRow;
    // $tableOption.height = clientHeight - 230;
    // initBootstrapTable($editTable, $tableOption, null);

}


/*打开新增任务页面*/
function openAddModel() {
    addm = messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增",
        $('<div></div>').load('DBtables/tabletdetails.html'),
        function () {

        },
        function () {
        },
        function (dialogItself) {
            //cancel
        },
        function (dialogItself) {
            var tablename = $('#tablename').val();
            var tabledesc = $("#tabledesc").val();
            if (tablename == "" || tablename == undefined) {
                showtoastr("inverse", "请填写完整信息！");
                return;
            }
            var tablePropertys = totablepropertys();
            if (tablePropertys == undefined || tablePropertys == '') {
                showtoastr("inverse", "字段名称和数据长度不能为空！");
                return;
            }
            getData("Post",
                "/tables/administration/saveOrUpdateTable",
                {'tablename': tablename, 'tabledesc': tabledesc, 'tablePropertys': tablePropertys},
                'json',
                function (data) {
                    addm.close();
                    showtoastr("inverse", data.desc + data.num + '条失败');
                    $editTable.bootstrapTable('refresh');
                }, null
            )
        });
}

function openEditModel(value) {
    addm = messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "编辑",
        $('<div></div>').load('DBtables/tabletdetails.html'),
        function () {

        },
        function () {
            reload(value);
        },
        //取消
        function (dialogItself) {
        },
        //确定
        function (dialogItself) {
            var tablename = $('#tablename').val();
            var tabledesc = $("#tabledesc").val();
            var tablePropertys = totablepropertys();
            if (tablePropertys == undefined || tablePropertys == '') {
                showtoastr("inverse", "字段名称和数据长度不能为空！");
                return;
            }
            ;
            getData("Post", "/tables/administration/saveOrUpdateTable", {
                'tableid': value,
                'tablename': tablename,
                'tabledesc': tabledesc,
                'tablePropertys': tablePropertys,
                'delist': delist
            }, 'json', function (data) {
                addm.close();
                showtoastr("inverse", data.desc + data.num + '条失败');
                $editTable.bootstrapTable('refresh');
                delist = '';
            }, null);
        });

}

function reload(id) {
    getData("Post",
        "/tables/administration/getTableProperty",
        {'id': id},
        'json', function (data) {
            $("#tablename").val(data.data.tablename);
            $("#tablename").attr("disabled", true);
            $("#tabledesc").val(data.data.tabledesc);
            eachdata(data.data.tablePropertys);
        }, null)
}

function deleteArea(value) {
    BootstrapDialog.show({
        type: BootstrapDialog.INFO,
        title: "删除",
        message: "同时删除表<a style='color: red'>会删除数据库中的这张表</a>，请确认此操作",
        buttons: [{
            label: '取消',
            icon: 'glyphicon glyphicon-remove',
            cssClass: 'btn bgm-gray waves-effect btn-icon-text',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }, {
            label: '删除',
            icon: 'glyphicon glyphicon-ok',
            cssClass: 'btn btn-icon-text waves-effect btn-primary',
            action: function (dialogItself) {
                delajax(value, 'F');
                dialogItself.close();
            }
        }, {
            label: '同时删除表',
            icon: 'zmdi zmdi-alert-circle-o zmdi-hc-fw',
            cssClass: 'btn btn-danger waves-effect',
            action: function (dialogItself) {
                delajax(value, 'T');
                dialogItself.close();
            }
        }]
    });
}

function delajax(id, type) {
    getData("Post",
        "/tables/administration/delTable",
        {'id': id, 'type': type, '_method': 'DELETE'},
        'json',
        function (data) {
            showtoastr("inverse", data.desc + data.message);
            $editTable.bootstrapTable('refresh');
        }, null)
}

function synchronousTable() {
    messageConfimDialog(BootstrapDialog.INFO, "提示", "将数据库所有表更新至此列表，请确认此操作",
        function () {
            $.ajax({
                url: cors + "/tables/administration/synchronousTables",
                datatype: 'json',
                data: {'command': true},
                type: "Post",
                beforeSend: function () {
                    showtoastr("info", "loading...");
                },
                success: function (data) {
                    showtoastr("inverse", "同步已完成，失败条数：" + data.num);
                    $editTable.bootstrapTable('refresh');
                },
                error: function (obj) {
                    //{"code":"10006","error":"Internal Server Error","desc":"服务端错误"}
                    showtoastr("inverse", obj.code+':'+obj.desc);
                    $editTable.bootstrapTable('refresh');
                },
                headers: {
                    "Authorization": "Bearer " + getLocalStorage('token'),
                    "Accept": "application/json;charset=UTF-8"
                }
            });
        }, null);
}

function createTable() {
    var selectedRow = $selectedRowData;
    if (selectedRow == '' || selectedRow == undefined) {
        showtoastr("inverse", "请选择行");
        return;
    }
    messageConfimDialog(BootstrapDialog.INFO, "提示", "在数据库生成或更新此表，请确认此操作",
        function () {
            getData("Post", "/tables/administration/createTable", {'tableid': selectedRow.id}, 'json', function (data) {
                var e = '';
                if (typeof (data.error) != 'undefined') {
                    e = data.error;
                }
                showtoastr("inverse", data.desc + e);
                $editTable.bootstrapTable('refresh');
            }, null)
        }, null);
}
// function getData(type, url, data, dataType, success, error)
function datapage(value) {

    var selectedRow = $selectedRowData;
    if (selectedRow == '' || selectedRow == undefined) {
        showtoastr("inverse", "请选择行");
        return;
    }
    console.log(JSON.stringify(selectedRow));
    window.open('DBtables/tabledata.html?seed=' + selectedRow.id + '&token=' + getLocalStorage('token'), '_blank');
}
