(function ($) {
    "use strict";
    var rows=[];
    var opt;
    $.fn.treegridData = function (options, param) {
        //如果是调用方法
        if (typeof options == 'string') {
            return $.fn.treegridData.methods[options](this, param);
        }
        opt=options;
        //如果是初始化组件
        options = $.extend({}, $.fn.treegridData.defaults, options || {});
        var target = $(this);
        //得到根节点
        target.getRootNodes = function (data) {
            var result = [];
            $.each(data, function (index, item) {
                if (!item[options.parentColumn]) {
                    result.push(item);
                }
            });
            return result;
        };
        var j = 0;
        //递归获取子节点并且设置子节点
        target.getChildNodes = function (data, parentNode, parentIndex, tbody) {
            var data_sort=[];
            $.each(data, function (i, item) {
                if (item[options.parentColumn] == parentNode[options.id]) {
                    data_sort.push(item);
                }
            });
            if(data_sort.length==0){
                j=j+100;
                return;
            }
            if(data_sort.length>1&&data_sort[0].sort){
                data_sort=quickSort(data_sort);
            }

            $.each(data_sort, function (i, item) {
                    var tr = $('<tr></tr>');
                    j++;
                    var nowParentIndex = (parentIndex + (j) + 1);
                    tr.addClass('treegrid-' + nowParentIndex);
                    tr.addClass('treegrid-parent-' + parentIndex);
                    $.each(options.columns, function (index, column){
                        var td = $('<td></td>');
                        if(column.formatter){
                            td.html(column.formatter(item[column.field],item,index));
                        }else{
                            td.html(item[column.field]);
                        }
                        tr.append(td);
                        td.unbind('click').click(function(e){
                            if(e.target.tagName=='SPAN'){
                                return;
                            }
                            row=item;
                        });
                    });
                    tbody.append(tr);
                    target.getChildNodes(data, item, nowParentIndex, tbody)

            });
        };
        target.addClass('table');
        if (options.striped) {
            target.addClass('table-striped');
        }
        if (options.bordered) {
            target.addClass('table-bordered');
        }
        if (options.url) {
            $(this).parent().append('<div id="treeinfo" style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 15%;text-align: center;width: 80%;margin-left: 10%;" class="filenone"><i class="zmdi zmdi-bike zmdi-hc-fw"></i>玩命加载中,请稍候...</div>');
            $.ajax({
                type: options.type,
                url: options.url,
                data: options.ajaxParams,
                dataType: "JSON",
                success: function (jsondt, textStatus, jqXHR) {
                    $('#treeinfo').remove();
                    if(options.isSuccess(jsondt).status){
                        var data=options.isSuccess(jsondt).data;
                        rows=data;
                        //构造表头
                        var thr = $('<tr></tr>');
                        var sum_width=0;
                        $.each(options.columns, function (i, item) {
                            if(item.width&&item.width>0&&item.width<=100){
                                sum_width+=item.width;
                            }
                        });
                        $.each(options.columns, function (i, item) {
                            var twidth='';
                            if(item.width&&item.width>0&&item.width<=100){
                                twidth='width:'+item.width/sum_width*100+'%';
                            }
                            var th = $('<th style="padding:10px;'+twidth+'"></th>');
                            th.text(item.title);
                            thr.append(th);
                        });
                        var thead = $('<thead></thead>');
                        thead.append(thr);
                        target.append(thead);

                        //构造表体

                        var tbody = $('<tbody></tbody>');
                        var rootNode = target.getRootNodes(data);
                        if(rootNode.length>1&&rootNode[0].sort){
                            rootNode=quickSort(rootNode);
                        }
                        $.each(rootNode, function (i, item) {
                            var tr = $('<tr></tr>');
                            tr.addClass('treegrid-' + (j + i));

                            $.each(options.columns, function (index, column) {
                                var td = $('<td></td>');
                                if(column.align){
                                    td.css({'text-align':column.align});
                                }
                                if(column.formatter){
                                    td.html(column.formatter(item[column.field],item,index));
                                }else{
                                    td.html(item[column.field]);
                                }
                                td.unbind('click').click(function(e){
                                    if(e.target.tagName=='SPAN'){
                                        return;
                                    }
                                    row=item;
                                });
                                tr.append(td);
                            });
                            tbody.append(tr);
                            target.getChildNodes(data, item, (j + i), tbody);
                        });
                        tbody.find('tr').click(function(e){
                            if(e.target.tagName=='SPAN'){
                                return;
                            }
                            var bc=$(this).css('background-color');
                            tbody.find('tr').css('background-color','#FFF');
                            if(bc!='rgb(255, 252, 190)'){
                                $(this).css('background-color','#FFFCBE');
                            }else{
                                row=null;
                            }
                        })
                        target.append(tbody);
                        target.treegrid({
                            expanderExpandedClass: options.expanderExpandedClass,
                            expanderCollapsedClass: options.expanderCollapsedClass
                        });
                        if (!options.expandAll) {
                            target.treegrid('collapseAll');
                        }
                    }else{
                        alert('加载失败');
                    }
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });

        }
        else {
            //也可以通过defaults里面的data属性通过传递一个数据集合进来对组件进行初始化....有兴趣可以自己实现，思路和上述类似
        }
        return target;
    };
    var row=null;
    $.fn.treegridData.methods = {
        getAllNodes: function (target, data) {
            return target.treegrid('getAllNodes');
        },
        getRow:function(){
            return row;
        },
        getRows:function(){
            return rows;
        },
        getPRow:function(){
            for(var i=0;i<rows.length;i++){
                if(row[opt.parentColumn]==rows[i][opt.id]){
                    return rows[i];
                }
            }
            return null;
        }
        //组件的其他方法也可以进行类似封装........
    };

    $.fn.treegridData.defaults = {
        id: 'Id',
        parentColumn: 'ParentId',
        data: [],    //构造table的数据集合
        type: "GET", //请求数据的ajax类型
        url: null,   //请求数据的ajax的url
        isSuccess:function (dt){
            return {'status':true,'data':dt};
        },//是否成功的方法
        ajaxParams: {}, //请求数据的ajax的data属性
        expandColumn: null,//在哪一列上面显示展开按钮
        expandAll: true,  //是否全部展开
        striped: false,   //是否各行渐变色
        bordered: false,  //是否显示边框
        columns: [],
        expanderExpandedClass: 'glyphicon glyphicon-chevron-down',//展开的按钮的图标
        expanderCollapsedClass: 'glyphicon glyphicon-chevron-right'//缩起的按钮的图标
    };

    function quickSort(arr){
        for(var i=0;i<arr.length;i++) {
            if (arr[i].sort == '') {
                arr[i].sort = 0;
            } else {
                arr[i].sort = parseInt(arr[i].sort);
            }
        }
        // 如果只有一位，就没有必要比较
        if(arr.length<=1){
            return arr;
        }
        // 获取中间值的索引
        var len = Math.floor(arr.length/2);
        // 截取中间值
        var cur = arr.splice(len,1);
        // 小于中间值放这里面
        var left = [];
        // 大于的放着里面
        var right = [];
        for(var i=0;i<arr.length;i++){
            // 判断是否大于
            if(cur[0].sort>arr[i].sort){
                left.push(arr[i]);
            }else{
                right.push(arr[i]);
            }
        }
        // 通过递归，上一轮比较好的数组合并，并且再次进行比较。
        return quickSort(left).concat(cur[0],quickSort(right));
    }
})(jQuery);