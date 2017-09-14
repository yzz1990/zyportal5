////通过给定的值获取其对应的具体值

//一寸照片的大小
var photoW='130';
var photoH='190px'

//性别
    var valarrSex={
        '0':'男',
        '1':'女'
    }
//是否有信仰宗教
    var valarrIsXyzj={
        '0':'无',
        '1':'有'
    }
//宗教教派
    var valarrzjjp={
        '0':'佛教',
        '1': '道教',
        '2':'基督教',
        '3':'伊斯兰教',
        '4':'神道教',
        '5':'犹太教',
        '6':'印度教',
        '7':'萨满教',
        '-1':'其他'
    }


//文化程度
    var valarrWhcd={
        '0':'文盲',
        '1':'小学',
        '2':'初中',
        '3':'高中',
        '4':'大学'
    }
//居住情况
var valarrJzqk={
    '0':'独居',
    '1':'与子女居住',
    '2':'与父母居住',
    '3':'与兄弟姐妹居住',
    '4':'与非亲属关系的人居住',
    '5':'养老机构'
};
//经济来源
var valarrJjly={
    '0':'退休金/养老金',
    '1':'子女补贴',
    '2':'亲友资助',
    '3':'其他补贴'
};
//评估等级
var valarrPgdj={
    '0':'能力完好',
    '1':'轻度失能',
    '2':'中度失能',
    '3':'重度失能',
    '-1':''
};

//判定卡评估等级显示颜色
var valarrPgdjColor={
    '0':'#FCD5B4',
    '1':'#E6B9B8',
    '2':'#0070C0',
    '3':'#A5A5A5',
    '-1':'#FFFFFF'
}

//医疗支付方式
var valarrYlzffs={
    '0':'城镇职工基本医疗保险',
    '1':'城镇居民基本医疗保险',
    '2':'新型农村合作医疗',
    '3':'贫困救助',
    '4':'商业医疗保险',
    '5':'全公费',
    '6':'全自费'
};
//婚姻状况
var valarrHyzk={
    '0':'未婚',
    '1':'已婚',
    '2':'丧偶',
    '3':'离婚'
};

//痴呆
var chidaiJson={
    '0':'无',
    '1':'轻度',
    '2':'中度',
    '3':'重度'
}
//精神疾病
var jsjbJson={
    '0':'无',
    '1':'精神分裂症',
    '2':'又相情感障碍',
    '3':'偏执性精神障碍',
    '4':'分裂情感障碍',
    '5':'癫痫所致精神障碍',
    '6':'精神发育迟滞伴发精神障碍'

}
//跌倒,走失,噎食,自杀次数
var countJson={
    '0':'无',
    '1':'发生过1次',
    '2':'发生过2次',
    '3':'发生过3次及以上'
}
//信息提供者与老人的关系
var xxtgzgxJson={
    '0':'配偶',
    '1':'子女',
    '2':'其他亲属',
    '3':'雇佣照顾者',
    '4':'养老机构',
    '5':'社工',
    '6':'其他'
}
//评估原因
var pgyyJson={
    '0':'第一次评估',
    '1':'常规评估',
    '2':'状况变化后重新评估',
    '3':'其他'
}


//获取性别
function getSex(value){
    return valarrSex[value];
}

//获取是否有信仰宗教
function isXyzj(value){
    return valarrIsXyzj[value];
}

//获取文化程度
function getWhcd(value){
    return valarrWhcd[value];
}

//获取居住情况
function getJzqk(){
    return valarr[value];
}

//获取经济来源
function getJjly(value){
    return valarrJjly[value];
}

//获取评估等级
function getPgdj(value){
    return valarrPgdj[value];
}

//获取评估等级对应的颜色
function getPgdjColor(value){
    return valarrPgdjColor[value];
}

//获取医疗支付方式
function getYlzffs(value){
    return valarrYlzffs[value];
}

//获取婚姻状况
function getHyzk(value){
    return valarrHyzk[value];
}

//根据分级获得评估等级
function getPgdjByScore(v1,v2,v3,v4){//v1:日常生活活动;v2:精神认知;v3:感知觉与沟通;v4:社会参与
    //先处理特殊情况
    if(v1==0){//日常生活活动为0
        if((v2>=1||v3>=1)||v4>=2){//精神认知、感知觉与沟通有一项为1及以上，或者社会参与为2或以上，判定为轻度失能
            return 1;
        }
    }else if(v1==1){//日常生活活动为1
        if(v2<=1||v3<=1||v4<=1){//后三项有一项为0或1，判定为轻度失能
            return 1;
        }
        if((v2>=2&&v3>=2&&v4>=2)||(v2==3||v3==3||v4==3)){//后三项均为2及以上或一项为3，则判定为中度失能
            return 2;
        }
    }else if(v1==2){//日常生活活动为2时
        if((v2>2&&v3>2&&v4>2)||(v2==3||v3==3||v4==3)){//后三项全部为2以上或某一项为3，判定为重度失能
            return 3;
        }else{//否则为中度失能
            return 2;
        }
    }
    //普通的处理
        //0：能力完好:日常生活活动、精神状态、感知觉与沟通分级均为0，社会参与分级为0或1。
    if(v1==0&&v2==0&&v3==0&&v4<=1){
        return 0;
    }
    // 1轻度失能：
    //       日常生活活动分级为0，但精神状态、感知觉与沟通中至少一项分级为1及以上，或社会参与的分级为2；
    //       或日常生活活动分级为1，精神状态、感知觉与沟通、社会参与中至少有一项的分级为0或1。
    if(v1<=1){
        if((v2>=1||v3>=1)||v4==2){
            return 1;
        }
        if(v2<=1||v3<=1||v4<=1){
            return 1;
        }
    }
//     2中度失能：
//          日常生活活动分级为1，但精神状态、感知觉与沟通、社会参与均为2，或有一项为3；
//          或日常生活活动分级为2，且精神状态、感知觉与沟通、社会参与中有1-2项的分级为1或2。
    if(v1<=2){
        if((v2==2&&v3==2&&v4==2)||(v2==3||v3==3||v4==3)){
            return 2;
        }
    }
//     3重度失能：
//          日常生活活动的分级为3；
//          或日常生活活动、精神状态、感知觉与沟通、社会参与分级均为2或以上；
//          或日常生活活动分级为2，且精神状态、感知觉与沟通、社会参与中至少有一项分级为3。
    if(v1==3||
        (v1>=2||v2>=2||v3>=2||v4>=2)||
        (v1==2&&(v2==3||v3==3||v4==3))){
        return 3;
    }

    return -1;

}

var abilityLevels={
    0:'能力完好',
    1:'轻度受损',
    2:'中度受损',
    3:'重度受损'
}


function level1rating(){
    var sum1=0;
    var sum2=0;
    var sum3=0;
    var sum4=0;
    $('#daily_lifeT .point:checked').each(function(i,item){
        sum1+=parseInt($(this).val());
    })
    $('#mental_stateT .point:checked').each(function(i,item){
        sum2+=parseInt($(this).val());
    })
    $('#perceivedT .point:checked').each(function(i,item){
        sum3+=parseInt($(this).val());
    })
    $('#social_participationT .point:checked').each(function(i,item){
        sum4+=parseInt($(this).val());
    })
    var levels=[];
    var obj1={};

    if(sum1==100){
        obj1.level=0;
    }else if(sum1>=65&&sum1<=95){
        obj1.level=1;
    }else if(sum1>=45&&sum1<=60){
        obj1.level=2;
    }else if(sum1<=40){
        obj1.level=3;
    }
    levels.push(obj1);

    var obj2={};
    if(sum2==0){
        obj2.level=0;
    }else if(sum2==1){
        obj2.level=1;
    }else if(sum2>=2&&sum2<=3){
        obj2.level=2;
    }else if(sum2>=4&&sum2<=6){
        obj2.level=3;
    }
    levels.push(obj2);

    var obj3={};
    //意识

    var awarenessLevel=parseInt($('[name="awarenessLevel"]:checked').val());
    //视力
    var vision=parseInt($('[name="vision"]:checked').val());
    //听力
    var listening=parseInt($('[name="listening"]:checked').val());
    //沟通
    var communication=parseInt($('[name="communication"]:checked').val());

    if((awarenessLevel==0)&&(vision==0||vision==1)&&(listening==0||listening==1)&&(communication==0)){
        obj3.level=0;
    }else if((awarenessLevel==0)&&(vision==2||listening==2)||communication==1){
        obj3.level=1;
    }else if((awarenessLevel==0)&&(vision==3||listening==3)||communication==2){
        obj3.level=2;
    }else if((awarenessLevel==1)&&(vision<=3||listening<=3)&&communication<=2){
        obj3.level=2;
    }else if(((awarenessLevel=='0'||awarenessLevel==1)&&(vision==4||listening==4))||(communication==3)||(awarenessLevel==2||awarenessLevel==3)){
        obj3.level=3;
    }
    levels.push(obj3);

    var obj4={};
    if(sum4>=0&&sum4<=2){
        obj4.level=0;
    }else if(sum4>=3&&sum4<=7){
        obj4.level=1;
    }else if(sum4>=8&&sum4<=13){
        obj4.level=2;
    }else if(sum4>=14&&sum4<=20){
        obj4.level=3;
    }
    levels.push(obj4);
    return levels;
}

var clause={
    1:'有认知障碍/痴呆，在原有能力级别上提高一个等级；',
    2:'近30天内发生过2次及以上跌倒、噎食、自杀、走失者，在原有能力级别上提高一个等级；',
    3:'处于昏迷状态者，直接评定为重度失能；',
    4 :'若初步等级确定为“重度失能”，则不考虑上述1-3中各情况对最终等级的影响，等级不再提高；'
}

var nursingGrade={
    0:'自理老人类',
    1:'三级护理',
    2:'二级护理',
    3:'一级护理'
}

function levelChange(level){
    var json={};
    var clause=[];
    //痴呆
    var dementia=$('[name="dementia"]:checked').val();
    //跌倒
    var fall=$('[name="fall"]:checked').val();
    //走失
    var lost=$('[name="lost"]:checked').val();
    //噎食
    var chokingFood=$('[name="chokingFood"]:checked').val();
    //自杀
    var suicide=$('[name="suicide"]:checked').val();

    if(level!=3){
        if(dementia!='0'){
            level++;
            clause.push(1);
        }
        var sum=parseInt(fall)+parseInt(lost)+parseInt(chokingFood)+parseInt(suicide);
        if(sum>=2){
            level++;
            clause.push(2);
        }
    }else{
        clause.push(4);
    }
    json.level=level;
    json.clause=clause;
    return json;
}