var $hisTable;
var newBootstrapTableHis;
var sTime;
var eTime;
var pardata;

$(function () {

});

function initView(machineBase){
    pardata=machineBase
    $hisTable = $('#his_table1');

    var myTimeSetting = inputTimeSelSetting;
    myTimeSetting.format = 'YYYY-MM-DD hh:mm:ss';
    var nowDate=getFormatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
    myTimeSetting.maxDate=nowDate;//最大时间为当天
    $('#starttime,#endtime').jeDate(myTimeSetting);
    $('#starttime').val(nowDate.substring(0,10)+' 00:00:00');
    $('#endtime').val(nowDate);

    initHisTable($hisTable);

}

function initHisTable($table) {
    newBootstrapTableHis = MyDiyBootstrapTable($table);
    var $tableOption = newBootstrapTableHis.bootstrapTableOption;
    $tableOption.columns = [[{
        field: 'xh',
        title: '序号',
        formatter: newBootstrapTableHis.formatterIndexNo,
        align: 'right',
        valign: 'middle',// 垂直居中
        width: 50
    }, {
        field: 'linkedtime',
        title: '连接时间',
        align: 'left',
        valign: 'middle',// 垂直居中
        width: 100 // 宽度
    }, {
        field: 'distime',
        title: '断开时间',
        align: 'left',
        valign: 'middle',// 垂直居中
        width: 100// 宽度
    }, {
        field: 'getdatatime',
        title: '数据获取时间',
        align: 'left',
        valign: 'middle',// 垂直居中
        width: 100// 宽度
    }, {
        field: 'data',
        title: '数据<i id="his_data_help" data-trigger="hover" data-toggle="popover" data-placement="bottom" data-content="鼠标悬浮查看完整数据" title="" data-original-title="提示" class="zmdi zmdi-help-outline zmdi-hc-fw"></i>',
        align: 'left',
        valign: 'middle',// 垂直居中
        width: 300,// 宽度
        formatter : function(value, row, index) {
            return '<span title="'+value+'">'+value+'</span>';
        }
    }]
    ];
    $tableOption.url = cors + '/system/machineMan/machineHis';
    $tableOption.onClickRow = $onClickRow;
    $tableOption.onPostHeader=function(){
        $("[data-toggle='popover']").popover();
        $("[data-toggle='tooltip']").tooltip();
    }
    newBootstrapTableHis.bootstrapTableOption.pagination=false;
    newBootstrapTableHis.bootstrapTableOption.height=400;

    var ajaxQData=pardata;
    ajaxQData.startTime=$('#starttime').val();
    ajaxQData.endTime=$('#endtime').val();
    newBootstrapTableHis.ajaxQuery=ajaxQData;
    newBootstrapTableHis.initBootstrapTable();

}

function serachHis(){
    var sD=new Date($('#starttime').val().replace(/-/g,"/"));
    var eD=new Date($('#endtime').val().replace(/-/g,"/"));
    if(sD.getTime()>eD.getTime()){
        showtoastr("inverse",'起始时间不能大于结束时间');
        return;
    }
    var ajaxQData=pardata;
    ajaxQData.startTime=$('#starttime').val();
    ajaxQData.endTime=$('#endtime').val();
    newBootstrapTableHis.ajaxQuery=ajaxQData;
    if(newBootstrapTableHis){
        newBootstrapTableHis.refreshBootstrapTableOptions();
    }
}