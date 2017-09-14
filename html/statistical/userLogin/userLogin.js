/**
 * Created by admin on 2017/8/3.
 */
var loginpa="user";
$(document).ready(function(){
    $("#treegridrow").height(clientHeight - 225);
    // 基于准备好的dom，初始化echarts实例
// 使用刚指定的配置项和数据显示图表。
    myjedate();
/*    creatEcharts(loginpa);*/
    $("#olUser").click();
    $("[data-toggle='popover']").popover();
/*    getDatesBetweenChoose();*/
})


function  creatEcharts(va) {
    var date = [];
    var data=[];
    var mytitle="";
    var startDate=$('#startDate').val();
    var endDate=$('#endDate').val();
    getData_async(
        'post',
        "/system/log/queryUserLoginLog",
        {
            uri:"/Permission/auth/token",
            startDate:startDate,
            endDate:endDate
        } ,
        'json',
        function (values) {
            var mydays=[];
          mydays=getDatesBetweenChoose(startDate,endDate);
              if(va=="user"){
                var mydata=values.data.user;
                var sqldate=[]

                  for(var i=0;i<mydata.length;i++){
                      sqldate.push(mydata[i].time);
                }

                for(var i=0;i<mydata.length;i++){
                      for(var a=0;a<mydays.length;a++){
                          var sq=sqldate.indexOf(mydays[a]);
                          var das=date.indexOf(mydays[a]);
                          if(sq>-1&&das<0){
                              data.push(mydata[i].count);
                              date.push(mydata[i].time);
                              break;
                          }else if(das<0){
                              data.push(0);
                              date.push(mydays[a]);
                          }
                      }
                }
                mytitle=olUser+"登录统计";
            }else if(va=="all"){
                var mydata=values.data.all;
                  var sqldate=[]
                  for(var i=0;i<mydata.length;i++){
                      sqldate.push(mydata[i].time);
                  }
                  for(var i=0;i<mydata.length;i++){
                      for(var a=0;a<mydays.length;a++){
                          var sq=sqldate.indexOf(mydays[a]);
                          var das=date.indexOf(mydays[a]);
                          if(sq>-1&&das<0){
                              data.push(mydata[i].count);
                              date.push(mydata[i].time);
                              break;
                          }else if(das<0){
                              data.push(0);
                              date.push(mydays[a]);
                          }
                      }
                  }
                mytitle="所有用户登录统计";
            }
        },function(obj){
            showtoastr("inverse", '未知错误');
            return false;
        }
    );

    var myChart = echarts.init(document.getElementById('treegridrow'));
    option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: mytitle,
        },
        toolbox: {
            show : true,
            right:"10%",
            feature : {
                /*myTool3: {
                    show: true,
                    title: '当前用户和所有用户切换',
                    icon: 'path://M24 24.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918zM10.225 24.854c1.728-1.13 3.877-1.989 6.243-2.513-0.47-0.556-0.897-1.176-1.265-1.844-0.95-1.726-1.453-3.627-1.453-5.497 0-2.689 0-5.228 0.956-7.305 0.928-2.016 2.598-3.265 4.976-3.734-0.529-2.39-1.936-3.961-5.682-3.961-6 0-6 4.029-6 9 0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h8.719c0.454-0.403 0.956-0.787 1.506-1.146z' ,
                    onclick: function (){
                        if(loginpa=="user"){
                            loginpa="all";
                        }else {
                            loginpa="user";
                        }
                        creatEcharts(loginpa);
                    }
                },*/
                saveAsImage : {show: true}
            }
        } ,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date,
            name:'登录日期'
        },
        yAxis: {
            type: 'value',
            minInterval : 1,
            boundaryGap: [0, '100%'],
            name:'登录次数'
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                name:'用户登录次数',
                type:'line',
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },
                data: data
            }
        ]
    };
    myChart.setOption(option);
    window.onresize = myChart.resize;

}

function searchpa() {
    $("#olUser").click();
    creatEcharts("user");
}

function myjedate() {
    var d = new Date();
    var year = d.getFullYear();
    var month=d.getMonth();
    var dqmonth=d.getMonth()+1;
    var day=d.getDate();
    if (day>= 0 && day<= 9) {
        day = "0" + day;
    }
    dqmonth=dqmonth>10?dqmonth:'0'+dqmonth;
    month=month>10?month:'0'+month;

    var dqsj=year+'-'+dqmonth+"-"+day;
    $("#startDate").jeDate({
        maxDate: dqsj,
        format:"YYYY-MM-DD"
    })
    $("#endDate").jeDate({
        maxDate: dqsj,
        format:"YYYY-MM-DD",
        isinitVal:true
    })
    $("#startDate").val(year+'-'+month+'-'+day);
}
function loginUser(loginpas) {
    if(loginpas=="user"){
        loginpas="user";
    }else {
        loginpas="all";
    }
    creatEcharts(loginpas);
}
