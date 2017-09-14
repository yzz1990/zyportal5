$(document).ready(function () {
    $("#mainEchart").height(clientHeight - 180);
    $("[data-toggle='popover']").popover();
    initDate();
})
var geoCoordMap = {};
var data = [];
function initDate() {
    getData(
        'post',
        '/system/ip/getLocationCount',
        null,
        'json',
        function (obj) {
//                data = obj.data;
            data = dataDesign(obj.ipLst);
//                console.log('orginal:' + JSON.stringify(obj.rows));
//                $.each(obj.ipLst, function (index, cell) {
//                    var zkey = cell.location;
//                    var lng = parseFloat(cell.lng);
//                    var lat = parseFloat(cell.lat);
//                    var vaule = [lng, lat];
//                    geoCoordMap[zkey] = vaule;
//                });
            createEchartView();
        },
        function (obj) {
            showtoastr("inverse", '未知错误');
            return false;
        }
    );
}
//    var shengfen = ["北京", "天津", "上海", "重庆", "河北", "山西", "辽宁", "吉林", "黑龙江", "江苏", "浙江", "安徽", "福建", "江西", "山东",
//        "河南", "湖北", "湖南", "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾", "内蒙", "广西", "西藏",
//        "宁夏", "新疆", "香港", "澳门"];
var shengfen = '北京天津上海重庆河北山西辽宁吉林黑龙江江苏浙江安徽福建江西山东河南湖北湖南广东海南四川贵州云南陕西甘肃青海台湾内蒙古广西西藏宁夏新疆香港澳门';
function dataDesign(obj) {
    var fakedata = [];
    //原数据中location为带省份和市的格式，需要提取出省份名称还不能带省字，并将地区提取出来计算相同地区的有多少个
    $.each(obj, function (index, cell) {
        var loc = '';
        if (cell.location != null && cell.location.length >= 2) {
            loc = cell.location.substr(0, 2);
            if (loc == "黑龙") {
                loc = "黑龙江";
            } else if (loc == "内蒙") {
                loc = "内蒙古";
            }
            var i = shengfen.indexOf(loc);
            if (i != -1) {
                cell.area = loc;
            } else {
                cell.area = '其他地区';
            }
        } else {
            cell.area = '其他地区';
        }
        fakedata.push(cell.area);
    });
    //统计相同地区的数据数量
    //[{"name":"浙江","value":"2"},{"name":"江苏省无锡市","value":"8"},{"name":"上海","value":"1"},{"name":"IANA","value":"1"},{"name":"四川","value":"1"}]
    var res = [];
    fakedata.sort();
    for (var i = 0; i < fakedata.length;) {
        var count = 0;
        var js = {}
        for (var j = i; j < fakedata.length; j++) {
            if (fakedata[i] == fakedata[j]) {
                count++;
            }
        }
        js.name = fakedata[i];
        js.value = count;
        js.detail = encodata(obj, fakedata[i]);
        res.push(js);
        i += count;
    }
    return res;
}
/**将原数组中的相同数据提取出来成一个新的数组，并且地区、数量的json里加入这个数组用来在tip框中显示这个地区详细有哪些人那些信息
 */
function encodata(obj, area) {
    var detail = [];
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].area == area) {
            detail.push(obj[i]);
        }
    }
    return detail;
}
//柱形图的高度计算
function heightDesign() {
    var divh = $('#mainEchart').height();
    var i = data.length;
    var h = i * 20 + i * 10;
    var bottom = divh - h - 100 - 20;
    if (bottom <= 40) {
        bottom = 40;
    }
    return bottom;
}
function NumDescSort(a, b) {
    return a.value - b.value;
}
function createEchartView() {
    var chart = echarts.init(document.getElementById('mainEchart'));
    var titledata = [];
    data.sort(NumDescSort);
    for (var i = 0; i < data.length; i++) {
        var d0 = {
            name: data[i].name,
            value: data[i].value
        };
        titledata.push(data[i].name)
    }
    option = {
        backgroundColor: '#fff',
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
        title: [{
            text: '用户操作分布图',
            subtext: '显示个区域用户的位置信息和统计各区域用户数量',
            left: 'left',
        }, {
            text: "区域分布数量",
            right: 120,
            top: 40,
            width: 100,
            textStyle: {
                fontSize: 16
            }
        }],
        tooltip: {
            trigger: 'item',
            formatter: function (params, ticket, callback) {
                var name = params.name;
                var count = isNaN(params.value) ? '0' : params.value;
                var str = '';
                if (typeof (params.data.detail) != 'undefined') {
                    $.each(params.data.detail, function (index, cell) {
                        var rowstr = "用户：" + cell.recentOperator + " 位置：" + cell.location + " 时间：" + cell.operatingTime + "<br/>";
                        str += rowstr;
                    })
                }
                return "信息" + "<br />" +
                    "区域：" + name + "<br />" +
                    "数量：" + count + "<br />" + str;
            }
        },
        visualMap: {
            min: 0,
            max: data.length,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            colorLightness: [0.2, 100],
            color: ['#269dbf', '#27c5e8', '#27dcff'],
            dimension: 0
        },
        toolbox: {
            feature: {
                restore: {
                    title: '刷新'
                },
                saveAsImage: {
                    type: 'jpeg',
                }
            },
            right: '2%'
        },
        grid: {
            z: 10,
            right: '5%',
            top: 100,
            bottom: heightDesign(),
            containLabel: true,
            width: '30%',
        },
        xAxis: [{
            z: 3,
            position: 'top',
            type: 'value',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
        }],
        yAxis: [{
            z: 3,
            type: 'category',
            data: titledata,
            axisTick: {
                alignWithLabel: true
            }
        }],
        series: [{
            z: 1,
            name: '分布信息',
            type: 'map',
            map: 'china',
            right: 'auto',
            center: [117.275266, 34.296689],
            top: 100,
            zoom: 1.5,
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                emphasis: {
                    areaColor: '#40E0D0',
                }
            },
            roam: true,
            data: data
        }, {
            z: 2,
            type: 'bar',
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                emphasis: {
                    areaColor: '#40E0D0',
                    color: "rgb(254,153,78)"
                }
            },
            data: data,
            id: 'bar',
            barMaxWidth: 30,
            barGap: '50%',
            symbol: 'none',
        }]
    };

    chart.setOption(option);
    window.onresize = chart.resize;
}