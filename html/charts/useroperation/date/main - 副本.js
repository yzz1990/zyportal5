var $mainChart;
var myChart;
var itemColor=['#F44336', '#9C27B0','#3F51B5','#4CAF50','#CDDC39'];
var selectedItem;
$(document).ready(function(){
    // //计算加载遮盖的宽高
    // $('#loading').css('top',$('#header.zyheader').height());
    // $('#loading').height(clientHeight-$('#zyfooter.zyfooter').height()-$('#header.zyheader').height());
    // $('#loading').css('left',$('#sidebar.zyleftmenu').width());

    //计算chart div容器的宽高
    // $('#mainChart').height($('#chart_body').height());
    // $('.pm-body .card').css('margin-bottom','0');

    // 基于准备好的dom，初始化echarts实例
    $mainChart=$("#mainChart");
    $mainChart.height(chartHeight);
    myChart = echarts.init($mainChart[0]);

    //默认选中第一个
    if($('#ul_changeitem li a:first span').text()){
        $('#sel_title').text($('#ul_changeitem li a:first span').text());
        selectedItem=$('#ul_changeitem li a:first').attr('id');
    }
    $('#ul_changeitem li a').bind("click", function(){
        var itemvalue=$(this).find('span').text();
        $('#sel_title').text(itemvalue);
        selectedItem=$(this).attr('id');
        drawView(myChart);
        $('#dropdown_item').removeClass('open');
    });

    drawView(myChart);



});

//绘制页面
function drawView($chart){
    // $('#loading').show();
    getData(
        'post',
        '/system/chart/userOperationChart',
        {'type':selectedItem} ,
        'json',
        function (data) {//success
            // $('#loading').hide();
            if(data.code=='0'){
                var $data=data.data;
                drawList($data);
                drawChart($chart,$data);
            }else{
                showtoastr("inverse",data.desc);
            }
            return true;
        },function(obj){//error
            // $('#loading').hide();
            showtoastr("inverse", '未知错误');
            return false;
        }
    );

}

//绘制列表
function drawList($data){
    $('#top5list').empty();
    var seriesList=$data.seriesList;
    for(var i=0;i<seriesList.length;i++){
        var seriesInfo=seriesList[i];
        var legend=seriesInfo.legend;
        var totalCount=seriesInfo.totalCount;
        //'+(i==0?"active":"")+'
        var insertHtml='<div id="leftlist'+i+'" onclick="listSelected(this)" class="lv-item media active listchild ">'+
                            '<div class="lv-avatar pull-left" style="background-color:'+itemColor[i]+';">'+(i+1)+'</div>'+
                                '<div class="media-body">'+
                                    '<div class="lv-title div_legend" thisIndex="'+i+'">'+legend+'</div>'+
                                '<div class="lv-small" style="color: #9E9E9E;">操作次数：'+totalCount+'</div>'+
                            '</div>'+
                        '</div>';
        $('#top5list').append(insertHtml);
    }
}

//左侧列表控制图例
function listSelected(thisobj){
    if($(thisobj).hasClass('active')){
        $(thisobj).removeClass('active');
        myChart.dispatchAction({//取消选中图例
            type: 'legendUnSelect',
            name: $(thisobj).find('.div_legend').text()// 图例名称
        });
    }else{
        $(thisobj).addClass('active');myChart.dispatchAction({//选中图例
            type: 'legendSelect',
            name: $(thisobj).find('.div_legend').text()// 图例名称
        });

    }
}

//绘制图表
function drawChart($chart,$data){
// 指定图表的配置项和数据
    //top5操作统计

    var czMax=0;//操作最大值
    var dlMax=0;//登录最大值
    var xData=$data.xDatas;//x轴坐标

    var legendArr=[];
    var seriesArr=[];//时间,每日操作总次数,登录次数
    var seriesList=$data.seriesList;
    for(var i=0;i<seriesList.length;i++){
        var seriesInfo=seriesList[i];
        var legend=seriesInfo.legend;
        legendArr.push(legend);
        var seriesData=seriesInfo.seriesData;
        var oneSeries = {};
        oneSeries.name=legend;
        oneSeries.type='scatter';
        oneSeries.itemStyle=itemStyle;
        oneSeries.data=seriesData;
        seriesArr.push(oneSeries);

        //筛选的最大值
            //操作次数
        for(var j=0;j<seriesData.length;j++){
            var seriesDataChild=seriesData[j];
            if(seriesDataChild[1]>czMax){
                czMax=Math.ceil(seriesDataChild[1]/10)*10;
            }
            if(seriesDataChild[2]>dlMax){
                dlMax=Math.ceil(seriesDataChild[2]/10)*10;
            }
        }



    }

    var option = {
        title:{
            show: true,
            text: $('#sel_title').text()+'操作分析 Top'+seriesArr.length,
            textStyle:{
                color: '#fff',
                fontSize: 25,

            },
            padding: [20, 10, 5, 10,],
            //subtext: '单位: 次 ',
            top : 'top',
            left : 'center'
        },
        backgroundColor: '#404a59',
        color: itemColor,
        legend: {
            // y: 'top',
            top :'bottom',
            left: 'center',
            padding : 15,
            // orient: 'vertical',
            data: legendArr,
            textStyle: {
                color: '#fff',
                fontSize: 16
            }
        },
        grid: {
            x: '10%',
            x2: 150,
            y: '18%',
            y2: '10%'
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj.value;
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                    +obj.seriesName+'：'+value[0]+
                    '</div>'+
                    schema[2].text + '：' + value[2] + '<br>'+
                    schema[1].text + '：' + value[1] + '<br>';
            }
        },
        xAxis: {
            type: 'category',
            name: '日期',
            nameGap: 16,
            nameTextStyle: {
                color: '#fff',
                fontSize: 14
            },
            data: xData,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#eee'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '次数',
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                color: '#fff',
                fontSize: 16
            },
            axisLine: {
                lineStyle: {
                    color: '#eee'
                }
            },
            splitLine: {
                show: false
            }
        },
        visualMap: [
            {
                left: 'right',
                top: '10%',
                dimension: 2,//指定用数据的『哪个维度』
                min: 0,
                max: dlMax,
                itemWidth: 30,
                itemHeight: 120,
                calculable: true,
                precision: 0.1,
                text: ['圆形大小：登录次数'],
                textGap: 30,
                textStyle: {
                    color: '#fff'
                },
                inRange: {
                    symbolSize: [10, 35]
                },
                outOfRange: {
                    symbolSize: [10, 35],
                    color: ['rgba(255,255,255,.2)']
                },
                controller: {
                    inRange: {
                        color: ['#c23531']
                    },
                    outOfRange: {
                        color: ['#444']
                    }
                }
            },
            {
                left: 'right',
                bottom: '5%',
                dimension: 1,
                min: 0,
                max: czMax,
                itemHeight: 120,
                calculable: true,
                precision: 0.1,
                text: ['明暗：操作次数'],
                textGap: 30,
                textStyle: {
                    color: '#fff'
                },
                inRange: {
                    // colorLightness: [1, 0.5]
                    colorSaturation: [1, 0.9]
                },
                outOfRange: {
                    color: ['rgba(255,255,255,.2)']
                },
                controller: {
                    inRange: {
                        color: ['#c23531']
                    },
                    outOfRange: {
                        color: ['#444']
                    }
                }
            }
        ],
        series: seriesArr
    };

    // 使用刚指定的配置项和数据显示图表。
    $chart.setOption(option);

    //图例切换
    $chart.on('legendselectchanged', function (params) {
        var leftmenutext=params.name;
        $("#top5list div.listchild div.div_legend").each(function(){
            if($(this).text()==leftmenutext){
                var thisIndex=$(this).attr('thisIndex');
                $('#leftlist'+thisIndex).click();
            }
        });
    });
}

var itemStyle = {
    normal: {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
};

var schema = [
    {name: 'date', index: 0, text: '日期'},
    {name: 'oCount', index: 1, text: '操作次数'},
    {name: 'lCount', index: 2, text: '登录次数'}
];