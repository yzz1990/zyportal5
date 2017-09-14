var dataListUrl;
var pdkIndex;

$(function(){
    // $("#ul_left").css("height",clientHeight-170);
    // $(".myPrintAreat").css("height",clientHeight-120);
    // scrollBar('#ul_left', 'minimal-dark', 'y');
    // scrollBar('.myPrintAreat', 'minimal-dark', 'y');

    // $('input[type="radio"]').attr('readonly','readonly');


    dataListUrl='/pgda/pgdaInfo/pgdaInfoList';
    getDatas();

    $('.pgdaPhoto').css('width',photoW);
    $('.pgdaPhoto').css('height',photoH);


});

//数据源获取
var pageDataCache;//缓存数据

function getDatas(){
    var $oldId=getLocalStorage('$oldId');
    var pageSize=10;//每一页最多几条数据
    var currentPage = 1;
    getData(
        'post',
        dataListUrl,
        {'param':'','oldManid':$oldId,'pageSize': pageSize,'currentPage':currentPage} ,
        'json',
        function (rdata) {//success
            pageDataCache=rdata;
            if(rdata.code==0){//成功
                // //翻页绘制
                var options = {
                    currentPage: rdata.data.baselist.pageNum, //当前页数
                    totalPages: rdata.data.baselist.pages, //总页数
                    //点击事件，用于通过Ajax来刷新整个list列表
                    onPageClicked: function (event, originalEvent, type, page) {
                        //清空原来的
                        viewClean();
                        getData('post',
                            dataListUrl,
                            {'param': '','oldManid':$oldId, 'pageSize': pageSize,'currentPage':page},
                            'json', function(jdata1){
                                pageDataCache=jdata1;
                                if(jdata1.code==0){//成功
                                    dataCl(jdata1);//处理数据
                                }else{
                                    showtoastr("inverse",jdata1.desc);
                                    viewClean();
                                }
                            }, function(obj){
                                showtoastr("inverse", '未知错误');
                                viewClean();
                            });
                    }
                };
                dataCl(rdata);//处理数据
                $('#dangandetails-list-pagination').bootstrapPaginator(options);
            }else{
                showtoastr("inverse",rdata.desc);
                viewClean();
            }
        },function(obj){//error
            showtoastr("inverse", '未知错误');
            viewClean();
        }
    );

}

//数据处理
function dataCl(rdata){
    var data=rdata.data;
    var baselist=data.baselist.list;
    if(baselist!=undefined&&baselist!=""&&baselist.length>0){
        viewClean();//清空
        var infoDetails=data.infoDetails;
        for(var i=0;i<baselist.length;i++){
            var oneBase=baselist[i];
            var oneDataObj=infoDetails[oneBase.id];
            var evaluationOldmaninfo=oneDataObj.evaluationOldmaninfo;//老人信息
            var evaluationRecent=oneDataObj.evaluationRecent;//老人近况
            var evaluationPoint=oneDataObj.evaluationPoint;//评估量表
            var evaluationReport=oneDataObj.evaluationReport;//评估报告

            drawLeftView(i,oneBase,evaluationOldmaninfo,evaluationRecent,evaluationPoint,evaluationReport);

            //默认选中第一个
            $('#ul_left').find('li:first-child').click();

        }
    }else{
        viewClean();
        showtoastr("inverse",'查无评估档案记录');
        $('#ul_left').append('<li class="list-group-item" style="color: red;text-align: center;"><strong>无数据</strong></li>');

    }
}



    //绘制左侧列表
function drawLeftView($index,$base,$oldmaninfo,$recent,$point,$report){
    var leftName=$oldmaninfo.name;//名字
    var leftdj= valarrPgdj[$oldmaninfo.recentrating];//评估等级
    var leftcs=$base.count;//评定次数
    var leftpgy=$report.assessor;//评估员
    var lefttime=$base.createTime.substr(0,10);//时间

    // var leftdjColorClass='c-green';
    // if(leftdj=='能力完好'){
    //
    // }else if(leftdj=='轻度失能'){
    //
    // }else if(leftdj=='中度失能'){
    //
    // }else if(leftdj=='重度失能'){
    //     leftdjColorClass='c-red';
    // }
    var leftdjColor=getPgdjColor($oldmaninfo.recentrating);
    $('#ul_left').append('<li index="'+$index+'" class="list-group-item" onclick="lipagechange(this)">  ' +
                            '<div class="small m-t-xs"> ' +
                                '<p> ' +
                                    '<small class="pull-right f-700 " style="color: '+leftdjColor+' "> '+leftdj+'</small> ' +
                                    '<strong>'+leftName+'</strong> ' +
                                '</p> ' +
                            '</div> ' +
                            '<div class="small m-t-xs"> ' +
                                '<p>评定次数：第'+leftcs+'次 </p> ' +
                                '<p>评定人：'+leftpgy+' </p> ' +
                                '<p>评定时间：'+lefttime+' </p> ' +
                            '</div> ' +
                         '</li>');
}
    //绘制主页面
function drawMainView($oldmaninfo,$recent,$point,$report){
    drawLrjbxx($oldmaninfo);
    drawLrjk($recent);
    drawPglb($point,$report);
    drawPdk($report);//判定卡
    drawPgbg($report,$oldmaninfo);
}

//老人基本信息
function drawLrjbxx($oldmaninfo){
    $('#dalrjbxx_name').text($oldmaninfo.name);
    $('#dalrjbxx_sex').text(valarrSex[$oldmaninfo.sex]);
    if($oldmaninfo.hasreligion==1){
        $('#dalrjbxx_zjxy').text(valarrzjjp[$oldmaninfo.religion]);
    }
    $('#dalrjbxx_sfz').text($oldmaninfo.pcardid);
    $('#dalrjbxx_whcd').text(valarrWhcd[$oldmaninfo.culture]);
    $('#dalrjbxx_hjdz').text($oldmaninfo.registeraddress);
    $('#dalrjbxx_czdz').text($oldmaninfo.residentaddress);
    $('#dalrjbxx_jzzk').text(valarrJzqk[$oldmaninfo.livingstatus]);
    var jjArrs=$oldmaninfo.economicsfrom==undefined?[]:$oldmaninfo.economicsfrom.split(',');
    if(jjArrs.length>0){
        var jjStr='';
        for(var j=0;j<jjArrs.length;j++){
            if(j==0){
                jjStr+=valarrJjly[jjArrs[j]];
            }else{
                jjStr+=','+valarrJjly[jjArrs[j]];
            }
        }
        $('#dalrjbxx_jjly').text(jjStr);
    }
    var ylzfArr=$oldmaninfo.medicalpaytype==undefined?[]:$oldmaninfo.medicalpaytype.split(',');
    if(ylzfArr.length>0){
        var ylzfStr='';
        for(var j=0;j<ylzfArr.length;j++){
            if(j==0){
                ylzfStr+=valarrYlzffs[ylzfArr[j]];
            }else{
                ylzfStr+=','+valarrYlzffs[ylzfArr[j]];
            }
        }
        $('#dalrjbxx_ylzf').text(ylzfStr);
    }
    $('#dalrjbxx_hyzk').text(valarrHyzk[$oldmaninfo.maritalstatus]);
    $('#dalrjbxx_cs').text($oldmaninfo.birth);
    $('#dalrjbxx_sbkh').text($oldmaninfo.socialcardid);
    $('#dalrjbxx_mz').text(nations[$oldmaninfo.famousfamily]);
    $('#dalrjbxx_lxr').text($oldmaninfo.contactperson);
    $('#dalrjbxx_lxdh').text($oldmaninfo.contacttel);
    $('#dalrjbxx_photo').attr('src',urlPathPre+$oldmaninfo.photourl);
}



//老人近况
function drawLrjk($recent){
    $('#dalrjk_chidai').text(chidaiJson[$recent.dementia]);
    $('#dalrjk_jsjb').text(jsjbJson[$recent.mentalIllness]);
    $('#dalrjk_mxjb').text($recent.chronicDisease);
    $('#dalrjk_qtjb').text($recent.otherDiseases);
    $('#dalrjk_dd').text(countJson[$recent.fall]);
    $('#dalrjk_zoushi').text(countJson[$recent.lost]);
    $('#dalrjk_ys').text(countJson[$recent.chokingFood]);
    $('#dalrjk_zisha').text(countJson[$recent.suicide]);
    $('#dalrjk_qita').text($recent.other);
    $('#dalrjk_xxtgz').text($recent.providerName);
    $('#dalrjk_ylrgx').text(xxtgzgxJson[$recent.providerRelationship]);
}

//评估量表
function drawPglb($point,$report){
    var options=[
        {id:'daily_lifeT',data:daily_life_question},
        {id:'mental_stateT',data:mental_state},
        {id:'perceivedT',data:perceived},
        {id:'social_participationT',data:social_participation},
    ]
    for(index in options){
        var arr=options[index].data;
        var T=options[index].id;
        if(arr){
            $('#'+T).html('');
            for(var i=0;i<arr.length;i++) {
                var html =
                    '<tr>' +
                    '<td style="width:35%;vertical-align: middle;">' +
                    '<p><strong>' +(i+1)+'.'+ arr[i].title + '：</strong></p><p>' + arr[i].desc +'</p>'+
                    '</td>' +
                    '<td style="width:5%;vertical-align: middle;" class="text-center">'+$point[arr[i].name]+'分</td>' +
                    '<td style="padding-left:10px;">';

                var op = '';
                for (var j = 0; j < arr[i].options.length; j++) {
                    //if(arr[i].options[j].point==$point[arr[i].name]){
                        op += '<div class="">' +
                                    '<label>' +arr[i].options[j].point + '分，'+
                                               arr[i].options[j].desc +
                                    '</label>' +
                              '</div>';
                    // }
                }
                html += op + '</td></tr>';
                $('#' + T).append(html);
            }
            $('.point').unbind("click").click(function(e){
                $(this).parent().parent().parent().prev().html($(this).val()+'分')
                $('#'+$(this).attr('name')+'_name-error').remove();
            });
        }
    }

    var level1ratingArr=getScoreLevel($report);
    var v1=level1ratingArr[0];
    var v2=level1ratingArr[1];
    var v3=level1ratingArr[2];
    var v4=level1ratingArr[3];
    $('#pdkLevel1').html(getPgdj(v1)).css('color',getPgdjColor(v1));
    $('#pdkLevel2').html(getPgdj(v2)).css('color',getPgdjColor(v2));
    $('#pdkLevel3').html(getPgdj(v3)).css('color',getPgdjColor(v3));
    $('#pdkLevel4').html(getPgdj(v4)).css('color',getPgdjColor(v4));

}

//判定卡
function drawPdk($report){
    var level1ratingArr=getScoreLevel($report);
    var v1=level1ratingArr[0];
    var v2=level1ratingArr[1];
    var v3=level1ratingArr[2];
    var v4=level1ratingArr[3];
    initPdkTable(parseInt(v1),parseInt(v2),parseInt(v3),parseInt(v4));
}

//获取判定分级
function getScoreLevel($report){
    return $report.level1rating.split(',');
}

//填充判定卡的颜色,获得判定等级
function initPdkTable(v1,v2,v3,v4){
    var c=getPgdjColor('-1');
    //还原最初状态
    $('#td_pddj').html('');
    $('#table_pdk td').css('background-color',c);
    //去掉"✔"
    $("#table_pdk").find("tr").eq(pdkIndex).find('td').html('');
    $("#table_pdk").find("tr").eq(pdkIndex).find('td').eq(0).html(pdkIndex-2);
    pdkIndex=2+v1;
    var $tableRow=$("#table_pdk").find("tr").eq(pdkIndex);
    var pdjgStr=getPgdjByScore(v1,v2,v3,v4);
    c=getPgdjColor(pdjgStr);
    // if(pdjgStr==1){
    //     c='#25CF2D';
    // }else if(pdjgStr==2){
    //     c='#FFCA00';
    // }else if(pdjgStr==3){
    //     c='#4B98FF';
    // }else if(pdjgStr==4){
    //     c='#6F008F';
    // }

    var $colV1=$tableRow.find("td").eq(0).css('background-color',c).html(v1+'✔');
    var $colV2=$tableRow.find("td").eq(1+v2).css('background-color',c).html('✔');
    var $colV3=$tableRow.find("td").eq(1+v3+4).css('background-color',c).html('✔');
    var $colV4=$tableRow.find("td").eq(1+v4+8).css('background-color',c).html('✔');
    $('#td_pddj').text(valarrPgdj[pdjgStr]);
}



//评估报告
function drawPgbg($report,$oldmaninfo){
    $('#dapgbg_no').text($report.no);
    $('#dapgbg_dateReport').text($report.dateReport);
    $('#dapgbg_cause').text(pgyyJson[$report.cause]);
    $('#dapgbg_name').text($report.name);
    $('#dapgbg_gender').text(valarrSex[$report.gender]);
    $('#dapgbg_dateBirth').text($report.dateBirth);
    $('#dapgbg_agency').text($report.agency);//评估机构
    $('#dapgbg_assessor').text($report.assessor);//评估人员
        //一级指标分级
    var level1ratingArr=$report.level1rating.split(',');
    var level1ratingStr='日常生活活动：'+valarrPgdj[level1ratingArr[0]]+'；' +
                        '精神状态：'+valarrPgdj[level1ratingArr[1]]+'；' +
                        '感知觉与沟通：'+valarrPgdj[level1ratingArr[2]]+'；' +
                        '社会参与评估：'+valarrPgdj[level1ratingArr[3]];
    $('#dapgbg_level1rating').text(level1ratingStr);
        //老年人初步等级
    $('#dapgbg_preliminaryLevel').text(valarrPgdj[$report.preliminaryLevel]);
        //变更条款
    $('#dapgbg_gradeChangeClause').text(clause[$report.gradeChangeClause]);
        //最终等级
    $('#dapgbg_finalGrade').text(valarrPgdj[$report.finalGrade]);
        //护理等级
    $('#dapgbg_nursingGrade').text(nursingGrade[$report.nursingGrade]);
    $('#dapgbg_photo').attr('src',urlPathPre+$oldmaninfo.photourl);
}




//页面清空
function viewClean(){
    $('#ul_left').empty();
    $('.tdclean').html('&nbsp;');
    $('#dalrjbxx_photo,#dapgbg_photo').attr('src','');
    $('#daily_lifeT,#mental_stateT,#perceivedT,#social_participationT').html('');
}




//左侧ul 点击切换
function lipagechange(obj){
    //$('#ul_left li').css('background-color','#F3F2F1');
    //$(obj).css('background-color','white');
    $('#ul_left li').removeClass('active');
    $(obj).addClass('active');

    var data=pageDataCache.data;
    var baselist=data.baselist.list;
    var infoDetails=data.infoDetails;
    var thisIndex=$(obj).attr('index');

    var oneBase=baselist[thisIndex];
    var oneDataObj=infoDetails[oneBase.id];
    var evaluationOldmaninfo=oneDataObj.evaluationOldmaninfo;//老人信息
    var evaluationRecent=oneDataObj.evaluationRecent;//老人近况
    var evaluationPoint=oneDataObj.evaluationPoint;//评估量表
    var evaluationReport=oneDataObj.evaluationReport;//评估报告

    drawMainView(evaluationOldmaninfo,evaluationRecent,evaluationPoint,evaluationReport);
}


//顶部tab及页面切换
function tabpagechange(obj){
    $('#ul_toptitle li').removeClass('active');
    $(obj).addClass('active');
    //$('#pgdahis_title').text($(obj).find('a').text());// 标题切换
    //页面切换
    $('.tabpagemodel').removeClass('active');
    var hrefStr=$(obj).find('a').attr('href');
    var $idStr=hrefStr.split('/')[0]+hrefStr.split('#/')[1];
    $($idStr).addClass('active');
}


//打印
function pgdahisPrint(){
    var hrefStr=$('#ul_toptitle li.active').find('a').attr('href');
    var $idStr=hrefStr.split('/')[0]+hrefStr.split('#/')[1];

    var keepAttr = [];
    keepAttr.push('class');
    keepAttr.push('id');
    keepAttr.push('style');
    var options = {
        mode : 'iframe',//   打印模式:iframe或popup
        popClose : true,//Popup模式下有效
        extraCss :'' ,//额外的样式
        retainAttr : keepAttr,
        extraHead : ''
    };
    $($idStr+" .myPrintArea .myPrintAreaContent").printArea(options);
}


