/**
 * Created by Administrator on 2017/7/6 0006.
 */
var $table = $('#main_table');
var tabledata;
var $addrow = $('#btn_add');
var $delrow = $('#btn_del');
var $rowsub = $('#btn_sub');
var token;

$(document).ready(function () {
    initpage();
});

function initpage() {
    var id = GetQueryString('seed');
    token = GetQueryString('token');
    // setLocalStorage('token', GetQueryString('token'));
    $.ajax({
        url: cors + "/tables/administration/getTableProperty",
        datatype: 'json',
        data: {'id': id, 'toshow': true},
        type: "Post",
        success: function (data) {
            if (data.data != '') {
                tabledata = data.data;
                $('#title').html(tabledata.tablename);
                initTable();
            }else {
                $('#errorspan').css('display','block');
                $('#toolbar').css('display', 'none');
            }

        },
        error: function () {
            $('#toolbar').css('display', 'none');
            swal({
                title: "验证失败",
                text: "您没有权限浏览这个页面，请联系管理员!",
                type: "warning",
                // showCancelButton: true,
                confirmButtonColor: "#dd201e",
                // confirmButtonText: "确认",
                closeOnConfirm: true
            }, function () {
                window.opener = null;
                window.close();
            });
        },
        headers: {
            // "Authorization": "Bearer " + getLocalStorage('token'),
            "Authorization": "Bearer " + token,
            "Accept": "application/json;charset=UTF-8"
        },
    });
}
// function getLocalStorage(key) {
//     return localStorage.getItem(key);
// }
// function setLocalStorage(key, val) {
//     return localStorage.setItem(key, val);
// }
// function getUserInfo() {
//     return JSON.parse(getLocalStorage("userInfo"));
// }

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
var cols;
function initTable() {
    var c = '[{field: \'state\',checkbox: true,formatter:stateFormatter,class:\'select-box\'},';
    $.each(tabledata.tablePropertys, function (index, obj) {
        c += '{field:' + '\'' + obj.fieldname + '\'' + ',title:' + '\'' + obj.fieldname + '\''
            + ',align:\'center\',valign: \'middle\',width:150,editable:true,formatter:dataFarmatter},';
    });
    c = c.substring(0, c.length - 1);
    c += ']';
    cols = eval("(" + c + ")");
    $table.empty();
    $table.bootstrapTable('destroy').bootstrapTable({
        columns: [cols],//列
        url: cors + '/tables/administration/getData',
        method: 'get',
        striped: true,
        cache: false,
        queryParams: function queryParams(params) { //设置查询参数
            var param = {
                pageNumber: params.pageNumber,
                pageSize: params.pageSize,
                sortOrder: params.sortOrder,
                sortName: params.sortName,
                tableId: tabledata.id,
                tablename: tabledata.tablename
            };
            return param;
        },
        clickToSelect: true,
        ajaxOptions: {
            headers: {
                // "Authorization": "Bearer " + getLocalStorage('token'),
                "Authorization": "Bearer " + token,
                "Accept": "application/json;charset=UTF-8"
            }
        },
        undefinedText: '_',
        toolbar: '#toolbar',
        toolbarAlign: 'right',
        dataType: 'json',
        contenType: 'application/json',
        width: $(window).width(),
        showColumns: true,
        pagination: true,
        paginationLoop: true,
        pagination: true,//是否开启分页（*）
        pageNumber: 1,//初始化加载第一页，默认第一页
        pageSize: 10,//每页的记录行数（*）
        pageList: [10, 25, 50, 100],//可供选择的每页的行数（*）
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
        showRefresh: true,//刷新按钮
        search: true,//是否显示表格搜索，此搜索是客户端搜索，不会进服务端
//            showToggle: true,
        showPaginationSwitch: true,
        showExport: true,
        exportDataType: "all",//导出类型
//            detailView: true,
        detailFormatter: function (index, row) {
            var html = [];
            $.each(row, function (key, value) {
                html.push('<p><b>' + key + ':</b> ' + value + '</p>');
            });
            return html.join('');
        },
        searchAlign: 'left',
        onEditableSave: function (field, row, oldValue, $el) {
            if (!enableajax) {
                intermediary[field] = row[field];
            }
            row[field] = oldValue;
            var a = JSON.stringify(row);
            a = a.replace(/"/g, '\'');
            var v = $('.input-sm').val();
            if (enableajax) {
                $.ajax({
                    type: 'Post',
                    url: cors + "/tables/administration/UpdateData",
                    data: {
                        'tablename': tabledata.tablename,
                        'fieldname': field,
                        'value': v,
                        'row': a
                    },
                    dataType: 'JSON',
                    success: function (data) {
                        if (typeof (data.error) != 'undefined') {
                            showtoastr("inverse", data.error);
                        }
                        $table.bootstrapTable('refresh');
                    }, headers: {
                        // "Authorization": "Bearer " + getLocalStorage('token'),
                        "Authorization": "Bearer " + token,
                        "Accept": "application/json;charset=UTF-8"
                    }
                });
            }
        }
    });
    function stateFormatter(value, row, index) {
        if (row.id === 2) {
            return {
                disabled: true,
                checked: true
            };
        }
        if (row.id === 0) {
            return {
                disabled: true,
                checked: true
            }
        }
        return value;
    }

    function dataFarmatter(value, row, index) {
        return value;
    }

    $('#toolbar').find('select').change(function () {
        $table.bootstrapTable('destroy').bootstrapTable({
            exportDataType: $(this).val()
        });
    });
    setTimeout(function () {
        $table.bootstrapTable('resetView');
    }, 200);
}


$delrow.click(function () {
    $.map($table.bootstrapTable('getSelections'), function (row) {
        var a = JSON.stringify(row);
        a = a.replace(/"/g, '\'');
        $.ajax({
            type: 'Post',
            url: cors + "/tables/administration/deleteData",
            data: {
                'tablename': tabledata.tablename,
                'row': a,
                '_method': 'DELETE'
            },
            dataType: 'JSON',
            success: function (data) {
                if (typeof (data.error) != 'undefined') {
                    showtoastr("inverse", data.error);
                }
                $table.bootstrapTable('refresh');
            }, headers: {
                // "Authorization": "Bearer " + getLocalStorage('token'),
                "Authorization": "Bearer " + token,
                "Accept": "application/json;charset=UTF-8"
            }
        })
    });
});


var intermediary = {};
var enableajax = true;
$addrow.click(function () {
    if (!enableajax) {
        showtoastr("inverse", '请先提交新增的数据');
        return;
    }
    enableajax = false;
    var rowvalue = {};
    $.each(tabledata.tablePropertys, function (index, obj) {
        rowvalue[obj.fieldname] = '';
    });
    var s = $table.bootstrapTable('insertRow', {
        index: 0,
        row: rowvalue
    });
});
$rowsub.click(function () {

    var a = JSON.stringify(intermediary);
    a = a.replace(/"/g, '\'');
    if (a == '{}') {
        showtoastr("inverse", '请选择数据');
        return;
    }
    $.ajax({
        type: 'Post',
        url: cors + "/tables/administration/saveData",
        data: {
            'tablename': tabledata.tablename,
            'row': a
        },
        dataType: 'JSON',
        success: function (data) {
            if (typeof (data.error) != 'undefined') {
                showtoastr("inverse", data.error);
            } else {
                $table.bootstrapTable('refresh');
                enableajax = true;
            }
        }, headers: {
            // "Authorization": "Bearer " + getLocalStorage('token'),
            "Authorization": "Bearer " + token,
            "Accept": "application/json;charset=UTF-8"
        }
    })

});

/*----------------------------------------------toastr操作----------------------------------------------------------------*/
/*操作提示信息 type:error,success,info,warning*/
function showtoastr(type, msg) {
    $.growl({
        message: msg
    }, {
        type: type,
        allow_dismiss: false,
        label: 'Cancel',
        className: 'btn-xs btn-inverse',
        placement: {
            from: 'top',
            align: 'center'
        },
        delay: 2500,
        animate: {
            enter: 'animated fadeIn',
            exit: 'animated fadeOut'
        },
        offset: {
            x: 20,
            y: 85
        }
    });
}
