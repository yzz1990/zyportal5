$(document).ready(function(){
    var pieData = [
        {data: 1, color: '#F44336', label: '小麦'},
        {data: 2, color: '#03A9F4', label: '稻谷'},
        {data: 3, color: '#8BC34A', label: '玉米'},
        {data: 4, color: '#FFEB3B', label: '大豆'},
        {data: 4, color: '#009688', label: '其他'}
    ];
    var pieData1 = [
        {data: 1, color: '#F44336', label: '央储'},
        {data: 2, color: '#03A9F4', label: '省储'},
        {data: 3, color: '#8BC34A', label: '市储'},
        {data: 4, color: '#FFEB3B', label: '县储'},
        {data: 4, color: '#009688', label: '临储'},
        {data: 4, color: '#009688', label: '商品粮'},
        {data: 4, color: '#009688', label: '最低价收购粮'},
        {data: 4, color: '#009688', label: '其他'}
    ];
    var pieData2 = [
        {data: 1, color: '#F44336', label: '一等'},
        {data: 2, color: '#03A9F4', label: '二等'},
        {data: 3, color: '#8BC34A', label: '三等'},
        {data: 4, color: '#FFEB3B', label: '四等'},
        {data: 4, color: '#009688', label: '五等'},
        {data: 4, color: '#009688', label: '等外粮'}
    ];
    
    /* Pie Chart */
    
        $.plot('#pie-chart', pieData, {
            series: {
                pie: {
                    show: true,
                    stroke: { 
                        width: 2,
                    },
                },
            },
            legend: {
                container: '.flc-pie',
                backgroundOpacity: 0.5,
                noColumns: 0,
                backgroundColor: "white",
                lineWidth: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                shifts: {
                    x: 20,
                    y: 0
                },
                defaultTheme: false,
                cssClass: 'flot-tooltip'
            }
            
        });
        $.plot('#pie-chart1', pieData1, {
            series: {
                pie: {
                    show: true,
                    stroke: {
                        width: 2,
                    },
                },
            },
            legend: {
                container: '.flc-pie',
                backgroundOpacity: 0.5,
                noColumns: 0,
                backgroundColor: "white",
                lineWidth: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                shifts: {
                    x: 20,
                    y: 0
                },
                defaultTheme: false,
                cssClass: 'flot-tooltip'
            }

        });
        $.plot('#pie-chart2', pieData2, {
            series: {
                pie: {
                    show: true,
                    stroke: {
                        width: 2,
                    },
                },
            },
            legend: {
                container: '.flc-pie',
                backgroundOpacity: 0.5,
                noColumns: 0,
                backgroundColor: "white",
                lineWidth: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                shifts: {
                    x: 20,
                    y: 0
                },
                defaultTheme: false,
                cssClass: 'flot-tooltip'
            }

        });

    /* Donut Chart */

    if($('#donut-chart')[0]){
        $.plot('#donut-chart', pieData, {
            series: {
                pie: {
                    innerRadius: 0.5,
                    show: true,
                    stroke: { 
                        width: 2,
                    },
                },
            },
            legend: {
                container: '.flc-donut',
                backgroundOpacity: 0.5,
                noColumns: 0,
                backgroundColor: "white",
                lineWidth: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            tooltip: true,
            tooltipOpts: {
                content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                shifts: {
                    x: 20,
                    y: 0
                },
                defaultTheme: false,
                cssClass: 'flot-tooltip'
            }
            
        });
    }
});