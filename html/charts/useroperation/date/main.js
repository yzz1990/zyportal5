var $mainChart;
var myChart;
var itemColor=['#F44336', '#9C27B0','#3F51B5','#4CAF50','#CDDC39'];
var selectedItem;
$(document).ready(function(){
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
        var insertHtml='<div id="leftlist'+i+'" class="lv-item media  listchild ">'+
                            '<div class="lv-avatar pull-left" style="background-color:'+itemColor[i]+';">'+(i+1)+'</div>'+
                                '<div class="media-body">'+
                                    '<div class="lv-title div_legend" thisIndex="'+i+'">'+legend+'</div>'+
                                '<div class="lv-small" style="color: #9E9E9E;">操作次数：'+totalCount+'</div>'+
                            '</div>'+
                        '</div>';
        $('#top5list').append(insertHtml);
    }
}


//绘制图表
function drawChart($chart,$data){
    //top5操作统计
    var czMax=0;//操作最大值
    var dlMax=0;//登录最大值
    var xData=$data.xDatas;//x轴坐标

    var seriesList=$data.seriesList;//按top 类别获取额详细分类

    var schema = [
        {name: 'date', index: 0, text: '日期'},
        {name: 'totalCount', index: 1, text: '当天Top5操作总次数'},
        {name: 'loginCount', index: 2, text: '当天登录次数'}
    ];
    for(var i=0;i<seriesList.length;i++) {
        var seriesInfo = seriesList[i];
        var legend = seriesInfo.legend;

        var oneSchema={};
        oneSchema.name='top'+(i+1);
        oneSchema.index=i+3;
        oneSchema.text=legend;
        schema.push(oneSchema);
    }

    //数据整理归纳
    var relSeriesData=[];
    var loginCountArr=[];
    var allCzCountArr=[];
    for(var i=0;i<xData.length;i++){
        var zlData=[];
        var allC=0;
        zlData.push(xData[i]);//时间
        //总操作次数
        for(var j=0;j<seriesList.length;j++){
            allC=parseInt(allC)+parseInt(seriesList[j]['seriesData'][i][1]);
        }
        zlData.push(parseInt(allC));
        allCzCountArr.push(parseInt(allC));
        //登录次数,取第一条数据的
        zlData.push(seriesList[0]['seriesData'][i][2]);
        loginCountArr.push(seriesList[0]['seriesData'][i][2])
        //top5  操作次数
        for(var j=0;j<seriesList.length;j++){
            zlData.push(seriesList[j]['seriesData'][i][1]);
            allC=parseInt(allC)+parseInt(seriesList[j]['seriesData'][i][1]);
        }
        relSeriesData.push(zlData);
    }

    dlMax=Math.ceil(Math.max.apply(null, loginCountArr)/10)*10;
    czMax=Math.ceil(Math.max.apply(null, allCzCountArr)/10)*10;

    console.log(schema);

    var option = {
        title:{
            show: true,
            text: $('#sel_title').text()+'操作分析 Top'+seriesList.length,
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
        legend: {
            // y: 'top',
            show: false,
            top :'bottom',
            data: ['Top5'],
            left: 'center',
            padding : 15,
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
                var fv= '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                    +schema[0].text+'：'+value[0]+'<br>'+
                    // +schema[1].text+'：'+value[1]+'<br>'+
                    '</div>';
                fv +='<div style="color: #a6e1ec;">'+schema[1].text + '：' + value[1] + '</div>';
                fv +='<div style="color: #cad96c">'+schema[2].text + '：' + value[2] + '</div>';
                for(var i=3;i<schema.length;i++){
                    fv +=schema[i].text + '：' + value[i] + '<br>';
                }
                return fv;
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
            name: '总次数',
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
                    symbolSize: [10, 50]
                },
                outOfRange: {
                    symbolSize: [10, 50],
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
                text: ['明暗：操作总次数'],
                textGap: 30,
                textStyle: {
                    color: '#fff'
                },
                inRange: {
                    colorLightness: [1, 0.5]
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
        series: [
            {
                name: 'Top5',
                type: 'scatter',
                itemStyle: itemStyle,
                data: relSeriesData
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    $chart.setOption(option);

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
