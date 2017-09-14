/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */
var model_pre='老人信息';
//初始化分页请求路径
var spaindexUrl;

var rowCount;//几行
var colCount;//几列,值为12的约数

var $spaindex_yanglaoyuan;
var $spaindex_pgdj;
var $spaindex_oldname;
var $spaindex_personID;
var $spaindex_search;
var $indexPagination;
var $spaindex_JZD;

(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();
    spaindexUrl='/oldMan/oldManInfo/getOldManInfoList';
    rowCount=2;
    colCount=4;

    $spaindex_yanglaoyuan=$("#spaindex_yanglaoyuan");
    $spaindex_pgdj=$("#spaindex_pgdj");
    $spaindex_oldname=$('#spaindex_oldname');
    $spaindex_personID=$('#spaindex_personID');
    $spaindex_search=$("#spaindex_search");
    $indexPagination=$('#indexPagination');
    $spaindex_JZD=$('#spaindex_JZD');

    initYlySelect();//初始化养老院下拉
    initPgdjSelect();//评估等级下拉






    $spaindex_search.click(function() {//查询
        btnsearch();
    });
    $("#spaindex_btn_add").click(function() {//新增
        openAddModel();
    });


    initIndexPaginator();

})();




//初始化养老院下拉
function initYlySelect(){
    $spaindex_yanglaoyuan.append('<option value="">请选择养老院</option>');
    getData(
        'post',
        '/Pension/OldmanHome/SelectNameId',
        null,
        'json',
        function (data) {//success
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $spaindex_yanglaoyuan.append('<option value="'+data[i].id+'">'+data[i].name+'</option>');
                }
            }
            $spaindex_yanglaoyuan.selectpicker({});  //初始化
        },function(obj){//error
            showtoastr("inverse", '养老院列表加载异常');
        }
    );
}

//初始化评估等级下拉
function initPgdjSelect(){
    $spaindex_pgdj.append('<option value="">评估等级</option>');
    for(var key in valarrPgdj) {
        $spaindex_pgdj.append('<option value="'+key+'">'+valarrPgdj[key]+'</option>');
    }
    $spaindex_pgdj.selectpicker({});  //初始化,一定要放在赋值下面
}

function btnsearch() {
    initIndexPaginator();
}

//获取查询sql拼接的字段
function getSearchparam(sqlJsonData){
    // var p='';
    var selYlyV=$spaindex_yanglaoyuan.val();
    var oldnameV=$spaindex_oldname.val();
    var personIDV=$spaindex_personID.val();
    var pgdjV=$spaindex_pgdj.val();
    var shequ=$spaindex_JZD.val();


    if(selYlyV!=''){
        // p+=" and  a.NURSINGHOMEID ='"+selYlyV+"' ";
        sqlJsonData.nursinghomeid=selYlyV;
    }
    if(oldnameV!=''){
        // p+=" and a.NAME like '%"+oldnameV+"%' ";
        sqlJsonData.name=oldnameV;
    }
    if(personIDV!=''){
        // p+=" and a.PCARDID='"+personIDV+"' ";
        sqlJsonData.pcardid=personIDV;
    }
    if(pgdjV!=''){
        // p+=" and RECENTRATING='"+pgdjV+"' ";
        sqlJsonData.recentrating=pgdjV;
    }
    if(shequ!=''){
        // p+=" and REGISTERADDRESS like '%"+shequ+"%' ";
        sqlJsonData.registeraddress=shequ;
    }
    return sqlJsonData;
}

//初始化分页
var spaindexUrl='/oldMan/oldManInfo/getOldManInfoList';

function initIndexPaginator(){
    var pageSize=rowCount*colCount;//每一页最多几条数据
    var currentPage = 1;

    var p1={'pageSize': pageSize,'currentPage':currentPage};
    var sqlParam=getSearchparam(p1);
    getData(
        'post',
        spaindexUrl,
        sqlParam,
        'json',
        function (jdata) {//success
            //清空原来的
            $('#indexPageContex').empty();
            bootstrapPaginatorClean($indexPagination);
            if(jdata.code==0){
                var data=jdata.data;//数据
                if(data.size <=0){
                    //无数据页面
                    $indexPagination.empty();
                    $('#indexPageContex').html("<div class='noresult' ></div>");
                }else{
                    var options = {
                        currentPage: data.pageNum, //当前页数
                        totalPages: data.pages, //总页数
                        //点击事件，用于通过Ajax来刷新整个list列表
                        onPageClicked: function (event, originalEvent, type, page) {
                            //清空原来的
                            $('#indexPageContex').empty();
                            var p2={'pageSize': pageSize,'currentPage':page};
                            var sqlParam1=getSearchparam(p2);
                            getData('post',
                                spaindexUrl,
                                sqlParam1,
                                'json', function(jdata1){
                                    if(jdata1.code==0){
                                        var data1=jdata1.data;
                                        getIspaIndexPageView(data1);
                                    }else{
                                        showtoastr("inverse",jdata1.desc );
                                    }
                                }, function(obj){
                                    showtoastr("inverse", '加载异常');
                                });
                        }
                    };
                    $indexPagination.bootstrapPaginator(options);
                    getIspaIndexPageView(data);
                }
            }

        },function(obj){//error
            showtoastr("inverse", '加载异常');
        }
    );

}

var addmUrl,editmUrl;
addmUrl=editmUrl='oldmaninfo/addOrUpdate.html'
//新增
var addm;
function openAddModel(){
    //addm=messageConfimDialog(BootstrapDialog.TYPE_INFO,"新增"+model_pre,$('<div></div>').load('oldmaninfo/addOrUpdate.html'),addOrEditSubmit,null,openAddModelInit,null);
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
                                    "新增"+model_pre,
                                    $('<div></div>').load(addmUrl),
                                    function(){//页面显示前

                                    },
                                    function(){//页面显示后

                                    },
                                    function(){//取消,点关闭按钮
                                        //showtoastr("inverse", '取消');
                                    },
                                    function(){//确定
                                        formSubmit(addm,'add');
                                    });
}
//编辑
var updatem;
function openEditModel(dataIndex){
    if(currentDatas){
        var updateData;
        updatem=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
                                    "编辑"+model_pre,
                                    $('<div></div>').load(editmUrl),
                                    function(){//页面显示前
                                        updateData=currentDatas.list[dataIndex];
                                    },
                                    function(){//页面显示后
                                        //数据填充
                                        initFormDatas(updateData);
                                    },
                                    function(){//取消

                                    },
                                    function(){//确定
                                        formSubmit(updatem,'update');
                                    });
        }else{
            showtoastr("inverse", 'currentDatas异常');
        }
}

//删除
var delUrl='/oldMan/oldManInfo/del';
var deletem;
function delData($delOldManID) {
    deletem = messageConfimDialogCommon(BootstrapDialog.TYPE_WARNING,
                                    "删除"+model_pre,
                                    isNeedDel,
                                    function(){//页面显示前
                                        //获取老人的基本信息
                                    },
                                    function(){//页面显示后

                                    },
                                    function(){//取消

                                    },
                                    function(){//确定
                                        getData(
                                            'post',
                                            delUrl,
                                            {'delId':$delOldManID} ,
                                            'json',
                                            function (data) {//success
                                                if(data.code=='60003'){//删除成功
                                                    if(deletem){
                                                        //刷新页面
                                                        initIndexPaginator();
                                                        deletem.close();//关闭
                                                    }
                                                }
                                                showtoastr("inverse",data.desc);
                                            },function(obj){//error
                                                showtoastr("inverse", '未知错误');
                                            }
                                        );
                                    });
}




//主页数据处理
var currentDatas;//当前页面的数据
function getIspaIndexPageView(jsonData) {
    currentDatas=jsonData;
    /*//清空原来的
    $('#indexPageContex').empty();*/
    // 填充新的
    var lineIndex = -1;
    for (var i = 0; i < jsonData.size; i++) {
        //colCount个一行
        if (i % colCount == 0) {//满colCount个一行后换行
            lineIndex++;
            $('#indexPageContex').append('<div id="div_line' + lineIndex + '" class="rows"></div>');//新增一行
        }
        var dt = jsonData.list[i];//老人信息
        var oldManId=dt.id;//老人的id
        var oldName = dt.name;//老人姓名
        var age = jsGetAge(dt.birth);//年龄
        var ylyName = (dt.ylyName==''||dt.ylyName==undefined)?'&nbsp;':dt.ylyName;
        var pcardid = dt.pcardid;//身份证
        var zjpgdj = getPgdj(dt.recentrating);//最近评估等级
        var evaluationcount = (dt.evaluationcount == null || dt.evaluationcount == undefined || dt.evaluationcount == '' || dt.evaluationcount < 0 ? 0 : dt.evaluationcount);//评估次数
        //性别图标class
        var sexIconClass = (dt.sex == 0 ? 'c-lightblue zmdi zmdi-male zmdi-hc-fw' : 'c-pink zmdi zmdi-female zmdi-hc-fw');
        var sexCardColor=(dt.sex == 0 ?'#A4D3EE':'#EED2EE');
        var photoPath=urlPathPre+dt.photourl;

        var itHtml = '<div class="col-sm-'+(12/colCount)+'">' +
                        '<div class="card profile-view" style="background-color:'+sexCardColor+' ">' +
                            '<div class="pv-header">' +
                                '<img src="'+photoPath+'" class="pv-main" alt="">' +
                                '<ul class="actions actions-alt pull-right">' +
                                    '<li class="dropdown">' +
                                        '<a href="" data-toggle="dropdown" aria-expanded="false">' +
                                            '<i class="zmdi zmdi-more-vert"></i>' +
                                        '</a>' +
                                        '<ul class="dropdown-menu dropdown-menu-right">' +
                                            '<li onclick="openEditModel('+i+')">' +
                                                '<a ><i class="zmdi zmdi-edit"></i>  编辑</a>' +
                                            '</li>' +
                                            '<li onclick="delData(\''+oldManId+'\')">' +
                                                '<a ><i class="zmdi zmdi-delete"></i>  删除</a>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="pv-body">' +
                                '<h2><i class="' + sexIconClass + '"></i>  ' + oldName + '  ' + age + '岁</h2>' +
                                '<small>' + ylyName + '</small>' +
                                '<small>身份证号：' + pcardid + '</small>' +
                                '<div class="pv-follow f-4">' +
                                    '<div style="line-height: 40px;">' +
                                        '<span class="text-left pull-left">最近评估等级：</span>' +
                                        '<span class="text-center  f-700 " style="color:'+getPgdjColor(dt.recentrating)+'">' + zjpgdj + '</span>' +
                                        '<span class="text-right pull-right"><a href="javascript:addPG('+i+');" class="btn bgm-blue btn-icon-text waves-effect ">新增评估</a></span>' +
                                    '</div>' +
                                    '<div style="clear: both;"></div>' +
                                    '<div style="line-height: 40px;">' +
                                            '<span class="text-left pull-left ">评估次数：</span>' +
                                            '<span class="text-center ">共' + evaluationcount + '次</span>' +
                                            '<span class="text-right pull-right">' +
                '                               <a class="btn bgm-amber btn-icon-text waves-effect " onclick="goToPgda(\''+oldManId+'\')" >评估档案</a>' +
                '                           </span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                      '</div>';
        $('#div_line' + lineIndex).append(itHtml);


    }
}
function addPG(dataIndex){
    updateData=currentDatas.list[dataIndex];
    setLocalStorage('updateData',JSON.stringify(updateData));
    pgCount=currentDatas.list[dataIndex].evaluationcount;
    location.href="#/pinggu"
    console.log(updateData)
}

//评估档案
// var pgdam;
// var $oldId;
function goToPgda($selId){
    var $oldId=$selId;
    setLocalStorage('$oldId',$oldId);
    location.href="#/pgdapage"
    // pgdam=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
    //     '评估档案',
    //     $('<div></div>').load('pinggudangan/pgdahis.html'),
    //     function(){//页面显示前
    //
    //     },
    //     function(){//页面显示后
    //
    //     },
    //     function(){//取消,点关闭按钮
    //         //showtoastr("inverse", '取消');
    //     },
    //     function(){//确定
    //         //formSubmit(addm,'add');
    //     });
}







