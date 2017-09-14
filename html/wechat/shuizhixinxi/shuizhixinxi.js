$(function(){
    var clientH = $(window).height();
    var clientW = $(window).width();
    var  h=clientH-$('#page_top_bar').height();
    $('#page__bd').height(h-30);



    option = {
        title: {
            text: 'XXX图',
            show: false
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data:['DO','CODMn','NH3-N','TP','ORP','Transp']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['08-12','08-13','08-14','08-15','08-16','08-17','08-18']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'DO',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data:[1, 1.5, 1.5, 1.3, 1.5, 1.2, 1.5]
            },
            {
                name:'CODMn',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data:[1.5, 1.5, 1.5, 2.5, 1.3, 1.5, 1.5]
            },
            {
                name:'NH3-N',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data:[0.5, 1.5, 1.5, 0.8, 1.5, 1.0, 1.5]
            },
            {
                name:'TP',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                data:[1, 1.5, 0.5, 1.5, 1.5, 0.5, 1.5]
            },
            {
                name:'ORP',
                type:'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {normal: {}},
                data:[0.5, 1.5, 1.5, 0.3, 1.5, 0.7, 1.5]
            },
            {
                name:'Transp',
                type:'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {normal: {}},
                data:[1.5, 1.3, 1.5, 0.5, 1.5, 1.5, 1.5]
            }
        ]
    };

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
});
