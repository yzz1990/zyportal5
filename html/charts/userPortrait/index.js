/**
 * Created by jisy on 2017/8/4.
 */

var totalNum;

var maleNum;
var femaleNum;
var sexUnknows;

var ageBelow18;
var ageBetween18and23;
var ageBetween24and29;
var ageBetween30and39;
var ageBetween40and49;
var ageBetween50and59;
var ageAbove60;
var ageUnknown;

$(document).ready(function() {
    $('.portrait').height(clientHeight-200);
    //$("#userPortrait_pie").height(clientHeight);
    //$("#userPortrait_pie").width(500);
    //$("#userPortrait_bar").height(clientHeight);
    //$("#userPortrait_bar").width(500);
    $("[data-toggle='popover']").popover();
    $("[data-toggle='tooltip']").tooltip();
    getAllUserNum();
    getSexNum();
    getAgeNum();
    sexUnknows = totalNum-maleNum-femaleNum;
    ageUnknown = totalNum-ageBelow18-ageBetween18and23-ageBetween24and29
                  -ageBetween30and39-ageBetween40and49-ageBetween50and59-ageAbove60;
    initEcharts();
});

//获取所有用户人数
function getAllUserNum() {
    $.ajax({
        async:false,
        url: cors+"/system/user/getAllUserNum",
        datatype: 'json',
        data: null,
        type: "Post",
        success: function (data) {
            totalNum = data.data;
        },
        headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}

//获取对应性别人数
function getSexNum(sex) {
    $.ajax({
        async:false,
        url: cors+"/system/user/getSexNum",
        datatype: 'json',
        data: {'sex':sex},
        type: "Post",
        success: function (data) {
            maleNum = data.male;
            femaleNum = data.female;
        },
        headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}

//获取年龄段人数数据
function getAgeNum(bottomAge,topAge){
    $.ajax({
        async:false,
        url: cors+"/system/user/getAgeNum",
        datatype: 'json',
        data: {'topAge':topAge,'bottomAge':bottomAge},
        type: "Post",
        success: function (data) {
            ageBelow18 = data.data0;
            ageBetween18and23 = data.data1;
            ageBetween24and29 = data.data2;
            ageBetween30and39 = data.data3;
            ageBetween40and49 = data.data4;
            ageBetween50and59 = data.data5;
            ageAbove60 = data.data6;
        },
        headers: {
            "Authorization":"Bearer "+getLocalStorage('token') ,
            "Accept":"application/json;charset=UTF-8"
        }
    });
}

//初始化图表
function initEcharts(){
    //声明图表实例
    var myChart1 = echarts.init(document.getElementById('userPortrait_pie'));
    var myChart2 = echarts.init(document.getElementById('userPortrait_bar'));

    // 指定图表的配置项和数据
    var option1 = {
        title: {
            text: '男女用户分布环形图',      //标题内容
            x:'center'      //x轴方向位置
        },
        //触发类型
        tooltip: {
            trigger: 'item',    //数据项图形触发（主要用于无类目轴图标），axis为坐标轴触发
            formatter: "{a} <br/>{b}: {c} ({d}%)"   //提示框浮层内容格式器，饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
        },
        //图例组件
        legend: {
            orient: 'vertical',     //图例布局朝向，垂直分布，默认horizontal水平分布
            x: 'left',   //x轴方向位置
            data:['男','女','人妖']
        },
        //系列颜色设置
        color: [
            '#2319DC','pink','gray'
        ],
        //系列列表
        series: [
            {
                name:'用户性别',
                type:'pie',
                radius: ['40%', '55%'],     //饼图半径，第一个参数为内半径，第二个参数为外半径
                avoidLabelOverlap: false,   //是否防止标签重叠，本例需强制所有标签都放在中心位置，设置为false
                label: {
                    //图形在默认状态下的样式
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    //图形在高亮状态下的样式
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                //标签的视觉引导线样式
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                //数据
                data:[
                    {value:maleNum, name:'男'},
                    {value:femaleNum, name:'女'},
                    {value:sexUnknows, name:'人妖'}
                ]
            }
        ]
    };

    var option2 = {
        title: {
            text: '用户年龄分布柱形图',
            x:'center'
        },
        color: ['#3398DB'],
        //弹出框
        tooltip : {
            trigger: 'axis',            //坐标轴触发
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        //直角坐标系内绘图网格
        grid: {
            left: '5%',        //距离容器左侧距离
            right: '5%',        //距离容器右侧距离
            bottom: '5%',       //距离容器底部距离
            containLabel: true  //grid 区域是否包含坐标轴的刻度标签，false适用于多个 grid 进行对齐的场景，true适用于『防止标签溢出』的场景
        },
        //x轴
        xAxis : [
            {
                type : 'category',  //坐标轴类型，'value' 数值轴；'category' 类目轴；'time' 时间轴；'log' 对数轴
                data : ['17岁以下', '18-23岁', '24-29岁', '30-39岁', '40-49岁', '50-59岁', '60岁以上','未知'],//x轴类目名称
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        //y轴
        yAxis : [
            {
                type : 'value'  //坐标轴类型，同x轴
            }
        ],
        //系列列表
        series : [
            {
                name:'用户人数',    //系列名称
                type:'bar',         //图表烈性
                barWidth: '60%',    //柱条宽度，默认自适应
                //数据内容数组
                data:[ageBelow18, ageBetween18and23, ageBetween24and29, ageBetween30and39, ageBetween40and49, ageBetween50and59, ageAbove60,ageUnknown]
}
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(option1);
    myChart2.setOption(option2);
    //图表大小自适应
    window.onresize = myChart1.resize;
    window.onresize = myChart2.resize;


}