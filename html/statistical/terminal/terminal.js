$(function () {
    $("#treegridrow").height(clientHeight - 225);
   echartsIE();
})
function echartsIE() {
    var datatitle=[];
    var mydata=[];
    var innerDatas=[];
    var OuterDatas=[];
    getData_async(
        'post',
        "/system/user/getAllBrowsers",
        "",
        'json',
        function (values) {
            var Idatas=[];
            var Odatas=[];

           Idatas=values.data.inner;
           Odatas=values.data.outer;
           for (var i=0;i<Idatas.length;i++){
              var myIndata={}
               datatitle.push(Idatas[i].browsertype);
              if(i==0&&Idatas.length>1){
                  myIndata={
                      value:Idatas[i].count,
                      name:Idatas[i].browsertype,
                      selected:true
                  }
              }else {
                  myIndata={
                      value:Idatas[i].count,
                      name:Idatas[i].browsertype,
                  }
              }
               innerDatas.push(myIndata);
           }
           for (var i=0;i<Odatas.length;i++){
               var myOuterData={};
               datatitle.push((Odatas[i].browsertype.replace(",","-")));
               myOuterData={
                   value:Odatas[i].count,
                   name:Odatas[i].browsertype.replace(",","-")
               }
                   OuterDatas.push(myOuterData);
           }
        },function(obj){
            showtoastr("inverse", '未知错误');
            return false;
        }
    );
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },

        title : {
            text: '系统用户浏览器使用统计',
            x:'center'
        }, legend: {
            orient: 'vertical',
            x: 'left',
            data:datatitle
        },
        series: [
            {
                name:'浏览器类型',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '40%'],

                label: {
                    normal: {
                        position: 'inner'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:innerDatas
            },
            {
                name:'版本号',
                type:'pie',
                radius: ['50%', '75%'],
                data:OuterDatas
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('treegridrow'));
    myChart.setOption(option);
    window.onresize = myChart.resize;
}
function osSystem() {
    var datatitle=[];
    var mydata=[];
    getData_async(
        'post',
        "/system/user/getOsType",
        "",
        'json',
        function (values) {
            var datas=[];
             datas=values.data;
            for(var i=0;i<datas.length;i++){
                datatitle.push(datas[i].ostype);
                var osJson={};
                osJson={
                    value:datas[i].count,
                    name:datas[i].ostype
                }
             mydata.push(osJson);
            }
        },function(obj){
            showtoastr("inverse", '未知错误');
            return false;
        }
    );
    option = {
        title : {
            text: '系统用户使用操作系统统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data:datatitle
        },
        series : [
            {
                name: '操作系统类型',
                type: 'pie',
                radius : ['50%', '70%'],
                avoidLabelOverlap: false,
                data:mydata,
                label: {
                    normal: {
                        show: false,
                        position: 'center',

                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }
                }
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('treegridrow'));
    myChart.setOption(option);
  /*  var currentIndex = -1;
    setInterval(function(){
        var dataLen = option.series[0].data.length;
        // 取消之前高亮的图形
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
        currentIndex = (currentIndex + 1) % dataLen;
        // 高亮当前图形
        myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
        // 显示 tooltip
        myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
    }, 1000);*/
    window.onresize = myChart.resize;
}
function takeMyType(value) {
    echarts.dispose(document.getElementById('treegridrow'));
    if(value=="os"){
        osSystem();
    }else if(value=="browser"){
        echartsIE();
    }
    
}
$(".waves-effect").click(function () {
    $(this).addClass("active").siblings().removeClass('active');
})