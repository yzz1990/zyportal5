var daily_life_question=[
    {
        title:'进食',
        name:'food',
        desc:'指用餐具将食物由容器送到口中，包括用筷子、勺或叉取食物、咀嚼、吞咽等过程',
        options:[
            {
                point:10,
                desc:'可独立进食（在合理的时间内独立进食准备好的食物）'
            },{
                point:5,
                desc:'需部分帮助（前述某个步骤需要一定帮助）'
            },{
                point:0,
                desc:'需极大帮助或完全依赖他人，或需留置胃管'
            }
        ]
    },{
        title:'洗澡',
        name:'bath',
        desc:'',
        options:[
            {
                point:5,
                desc:'准备好洗澡水后，可自己独立完成洗澡过程'
            },{
                point:0,
                desc:'在洗澡过程中需他人帮助'
            }
        ]
    },{
        title:'修饰',
        name:'modified',
        desc:'指洗脸、刷牙、梳头、刮脸等',
        options:[
            {
                point:5,
                desc:'可自己独立完成'
            },{
                point:0,
                desc:'需他人帮助'
            }
        ]
    },{
        title:'穿衣',
        name:'dressing',
        desc:'指穿脱衣服、系扣、拉拉链、穿脱鞋袜、系鞋带',
        options:[
            {
                point:10,
                desc:'可独立完成'
            },{
                point:5,
                desc:'需部分帮助（能自己穿脱，但需他人帮助整理衣物、系扣/鞋带、拉拉链）'
            },{
                point:0,
                desc:'需极大帮助或完全依赖他人'
            }
        ]
    },{
        title:'大便控制',
        name:'stool',
        desc:'',
        options:[
            {
                point:10,
                desc:'可控制大便'
            },{
                point:5,
                desc:'偶尔失控（每周<1次），或需要他人提示'
            },{
                point:0,
                desc:'完全失控'
            }
        ]
    },{
        title:'小便控制',
        name:'urinate',
        desc:'',
        options:[
            {
                point:10,
                desc:'可控制小便'
            },{
                point:5,
                desc:'偶尔失控（每天<1次，但每周>1次），或需要他人提示'
            },{
                point:0,
                desc:'完全失控，或留置导尿管'
            }
        ]
    },{
        title:'如厕',
        name:'toilet',
        desc:'',
        options:[
            {
                point:10,
                desc:'可独立完成'
            },{
                point:5,
                desc:'需部分帮助（需他人搀扶去厕所、需他人帮忙冲水或整理衣裤等）'
            },{
                point:0,
                desc:'需极大帮助或完全依赖他人'
            }
        ]
    },{
        title:'床椅转移',
        name:'bedChairMove',
        desc:'',
        options:[
            {
                point:15,
                desc:'可独立完成'
            },{
                point:10,
                desc:'需部分帮助（需他人搀扶或使用拐杖）'
            },{
                point:5,
                desc:'需极大帮助（较大程度上依赖他人搀扶和帮助）'
            },{
                point:0,
                desc:'完全依赖他人'
            }
        ]
    },{
        title:'平地行走',
        name:'walk',
        desc:'',
        options:[
            {
                point:15,
                desc:'可独立在平地上行走45m'
            },{
                point:10,
                desc:'需部分帮助（因肢体残疾、平衡能力差、过度衰弱、视力等问题，在一定程度上需他人地搀扶或使用拐杖、助行器等辅助用具）'
            },{
                point:5,
                desc:'需极大帮助（因肢体残疾、平衡能力差、过度衰弱、视力等问题，在较大程度上依赖他人搀扶，或坐在轮椅上自行移动）'
            },{
                point:0,
                desc:'完全依赖他人'
            }
        ]
    },{
        title:'上下楼梯',
        name:'stairs',
        desc:'',
        options:[
            {
                point:10,
                desc:'可独立上下楼梯（连续上下10-15个台阶）'
            },{
                point:5,
                desc:'需部分帮助（需扶着楼梯、他人搀扶，或使用拐杖等）'
            },{
                point:0,
                desc:'需极大帮助或完全依赖他人'
            }
        ]
    }
]

var mental_state=[
    {
        title:'认知功能',
        name:'cognitiveFunction',
        desc:'<p>“我说三样东西，请重复一遍，并记住，一会儿会问您”：苹果、手表、国旗</p><p>(1)画钟测验：“请在这儿画一个圆形时钟，在时钟上标出10点45分</p><p>(2)回忆词语：“现在请您告诉我，刚才我要您记住的三样东西是什么？”</p>',
        options:[
            {
                point:0,
                desc:'画钟正确（画出一个闭锁圆，指针位置准确），且能回忆出2-3个词'
            },{
                point:1,
                desc:'画钟错误（画的圆不闭锁，或指针位置不准确），或只回忆出0-1个词'
            },{
                point:2,
                desc:'已确诊为认知障碍，如老年痴呆'
            }
        ]
    },{
        title:'攻击行为',
        name:'aggressiveBehavior',
        desc:'',
        options:[
            {
                point:0,
                desc:'无身体攻击行为（如打/踢/推/咬/抓/摔东西）和语言攻击行为（如骂人、语言威胁、尖叫）'
            },{
                point:1,
                desc:'每月有几次身体攻击行为，或每周有几次语言攻击行为'
            },{
                point:2,
                desc:'每周有几次身体攻击行为，或每日有语言攻击行为'
            }
        ]
    },{
        title:'抑郁症状',
        name:'depressionSymptoms',
        desc:'',
        options:[
            {
                point:0,
                desc:'无'
            },{
                point:1,
                desc:'情绪低落、不爱说话、不爱梳洗、不爱活动'
            },{
                point:2,
                desc:'有自杀念头或自杀行为'
            }
        ]
    }
]

var perceived=[
    {
        title:'意识水平',
        name:'awarenessLevel',
        desc:'',
        options:[
            {
                point:0,
                desc:'神志清醒，对周围环境警觉'
            },{
                point:1,
                desc:'嗜睡，表现为睡眠状态过度延长。当呼唤或推动患者的肢体时可唤醒，并能进行正确的交谈或执行指令，停止刺激后又继续入睡'
            },{
                point:2,
                desc:'昏睡，一般的外界刺激不能使其觉醒，给予较强烈的刺激时可有短时的意识清醒，醒后可简短回答提问，当刺激减弱后又很快进入睡眠状态'
            },{
                point:3,
                desc:'昏迷，处于浅昏迷时对疼痛刺激有回避和痛苦表情；处于深昏迷时对刺激无反应（若评定为昏迷，直接评定为重度失能，可不进行以下项目的评估）'
            }
        ]
    },{
        title:'视力',
        name:'vision',
        desc:'若平日带老花镜或近视镜，应在佩戴眼镜的情况下评估',
        options:[
            {
                point:0,
                desc:'能看清书报上的标准字体'
            },{
                point:1,
                desc:'能看清楚大字体，但看不清书报上的标准字体'
            },{
                point:2,
                desc:'视力有限，看不清报纸大标题，但能辨认物体'
            },{
                point:3,
                desc:'辨认物体有困难，但眼睛能跟随物体移动，只能看到光、颜色和形状'
            },{
                point:4,
                desc:'没有视力，眼睛不能跟随物体移动'
            }
        ]
    },{
        title:'听力',
        name:'listening',
        desc:'若平时佩戴助听器，应在佩戴助听器的情况下评估',
        options:[
            {
                point:0,
                desc:'可正常交谈，能听到电视、电话、门铃的声音'
            },{
                point:1,
                desc:'在轻声说话或说话距离超过2米时听不清'
            },{
                point:2,
                desc:'正常交流有些困难，需在安静的环静或大声说话才能听到'
            },{
                point:3,
                desc:'讲话者大声说话或说话很慢，才能部分听见'
            },{
                point:4,
                desc:'完全听不见'
            }
        ]
    },{
        title:'沟通交流',
        name:'communication',
        desc:'包括非语言沟通',
        options:[
            {
                point:0,
                desc:'无困难，能与他人正常沟通和交流'
            },{
                point:1,
                desc:'能够表达自己的需要及理解别人的话，但需要增加时间或给予帮助'
            },{
                point:2,
                desc:'表达需要或理解有困难，需频繁重复或简化口头表达'
            },{
                point:3,
                desc:'不能表达需要或理解他人的话'
            }
        ]
    }
]


var social_participation=[
    {
        title:'生活能力',
        name:'survivalSkills',
        desc:'',
        options:[
            {
                point:0,
                desc:'除个人生活自理外（如饮食、洗漱、穿戴、二便），能料理家务（如做饭、洗衣）或当家管理事务'
            },{
                point:1,
                desc:'除个人生活自理外，能做家务，但欠好，家庭事务安排欠条理'
            },{
                point:2,
                desc:'个人生活能自理；只有在他人帮助下才能做些家务，但质量不好'
            },{
                point:3,
                desc:'个人基本生活事务能自理（如饮食、二便），在督促下可洗漱'
            },{
                point:4,
                desc:'个人基本生活事务（如饮食、二便）需要部分帮助或完全依赖他人帮助'
            }
        ]
    },{
        title:'工作能力',
        name:'abilityWork',
        desc:'',
        options:[
            {
                point:0,
                desc:'原来熟练的脑力工作或体力技巧性工作可照常进行'
            },{
                point:1,
                desc:'原来熟练的脑力工作或体力技巧性工作能力有所下降'
            },{
                point:2,
                desc:'原来熟练的脑力工作或体力技巧性工作明显不如以往，部分遗忘'
            },{
                point:3,
                desc:'对熟练工作只有一些片段保留，技能全部遗忘'
            },{
                point:4,
                desc:'对以往的知识或技能全部磨灭'
            }
        ]
    },{
        title:'时间/空间定向',
        name:'timespaceOrientation',
        desc:'',
        options:[
            {
                point:0,
                desc:'时间观念（年、月、日、时）清楚；可单独出远门，能很快掌握新环境的方位'
            },{
                point:1,
                desc:'时间观念有些下降，年、月、日清楚，但有时相差几天；可单独来往于近街，知道现住地的名称和方位，但不知回家路线'
            },{
                point:2,
                desc:'时间观念较差，年、月、日不清楚，可知上半年或下半年；只能单独在家附近行动，对现住地只知名称，不知道方位'
            },{
                point:3,
                desc:'时间观念很差，年、月、日不清楚，可知上午或下午；只能在左邻右舍间串门，对现住地不知名称和方位'
            },{
                point:4,
                desc:'无时间观念；不能单独外出'
            }
        ]
    },{
        title:'人物定向',
        name:'characterOrientation',
        desc:'',
        options:[
            {
                point:0,
                desc:'知道周围人们的关系，知道祖孙、叔伯、姑姨、侄子侄女等称谓的意义；可分辨陌生人的大致年龄和身份，可用适当称呼'
            },{
                point:1,
                desc:'只知家中亲密近亲的关系，不会分辨陌生人的大致年龄，不能称呼陌生人'
            },{
                point:2,
                desc:'只能称呼家中人，或只能照样称呼，不知其关系，不辨辈分'
            },{
                point:3,
                desc:'只认识常同住的亲人，可称呼子女或孙子女，可辨熟人和生人'
            },{
                point:4,
                desc:'只认识保护人，不辨熟人和生人'
            }
        ]
    },{
        title:'社会交往能力',
        name:'socialCommunication',
        desc:'',
        options:[
            {
                point:0,
                desc:'参与社会，在社会环境有一定的适应能力，待人接物恰当'
            },{
                point:1,
                desc:'能适应单纯环境，主动接触人，初见面时难让人发现智力问题，不能理解隐喻语'
            },{
                point:2,
                desc:'脱离社会，可被动接触，不会主动待人，谈话中很多不适词句，容易上当受骗'
            },{
                point:3,
                desc:'勉强可与人交往，谈吐内容不清楚，表情不恰当'
            },{
                point:4,
                desc:'难以与人接触'
            }
        ]
    }
]


function addQuestions(){

    var options=[
        {id:'daily_lifeT',data:daily_life_question,idx:0},
        {id:'mental_stateT',data:mental_state,idx:1},
        {id:'perceivedT',data:perceived,idx:2},
        {id:'social_participationT',data:social_participation,idx:3},
    ]

    for(var z=0;z<options.length;z++){
        var arr=options[z].data;
        var T=options[z].id;
        var idx=options[z].idx;
        if(arr){
            $('#'+T).html('');
            var navhtml= '<ul class="pointnav">';
            for(var i=0;i<arr.length;i++) {
                navhtml+=
                    '<li>'+
                    '<a href="javascript:navpoint(\''+arr[i].name+'\');">'+
                    '<div class="status" id="'+arr[i].name+'_f"></div>'+
                    arr[i].title+'</a>'+
                    '</li>';
                var html =
                    '<tr>' +
                    '<td style="width:30%">' +
                    '<p><strong>' +(i+1)+'.'+ arr[i].title + '：</strong></p><p>' + arr[i].desc +'</p>'+
                    '</td>' +
                    '<td style="width:5%" class="text-center" id="'+arr[i].name+'">--分</td>' +
                    '<td style="padding-left:30px;">';

                var op = '';
                for (var j = 0; j < arr[i].options.length; j++) {
                    op += '<div class="radio m-b-15" style="width:70%">' +
                        '<label>' +
                        '<input type="radio" value="'+arr[i].options[j].point+'" name="'+arr[i].name+'" class="point" idx="'+idx+'">' +
                        '<i class="input-helper"></i>' + arr[i].options[j].point + '分，' + arr[i].options[j].desc +
                        '</label>' +
                        '</div>';
                }

                html += op + '</td></tr>';
                $('#' + T).append(html);
            }
            navhtml+= '</ul>';
            $('#' + T).parent().prepend(navhtml);
            $('.point').unbind("click").click(function(e){
                var sss='#'+$(this).attr('name')+'_f';
                $('#'+$(this).attr('name')+'_f').css('background-color','#5CB85C');
                $(this).parent().parent().parent().prev().html($(this).val()+'分')
                $('#'+$(this).attr('name')+'_name-error').remove();
                var idx=$(this).attr('idx');
                var levels=level1rating();
                $('#level1rating_td').append('<p>日常生活等级:'+abilityLevels[levels[0].level]+'</p>')
                switch(idx){
                    case '0':
                        $('#damaged0').html(abilityLevels[levels[0].level]);
                        $('#jqmeter0').jQMeter({
                            goal:'10',
                            raised:$('#daily_lifeT input:checked').length+'',
                            orientation:'vertical',
                            width:'20px',
                            height:'285px',
                            barColor:'#5CB85C',
                            animationSpeed:500,
                            displayTotal:false
                        });
                        break;
                    case '1':
                        $('#damaged1').html(abilityLevels[levels[1].level]);
                        $('#jqmeter1').jQMeter({
                            goal:'3',
                            raised:$('#mental_stateT input:checked').length+'',
                            orientation:'vertical',
                            width:'20px',
                            height:'75px',
                            barColor:'#5CB85C',
                            animationSpeed:500,
                            displayTotal:false
                        });
                        break;
                    case '2':
                        $('#damaged2').html(abilityLevels[levels[2].level]);
                        //$('#progress2').css('width',$('#perceivedT input:checked').length*25+'%');
                        $('#jqmeter2').jQMeter({
                            goal:'4',
                            raised:$('#perceivedT input:checked').length+'',
                            orientation:'vertical',
                            width:'20px',
                            height:'105px',
                            barColor:'#5CB85C',
                            animationSpeed:500,
                            displayTotal:false
                        });
                        break;
                    case '3':
                        $('#damaged3').html(abilityLevels[levels[3].level]);
                        //$('#progress3').css('width',$('#social_participationT input:checked').length*20+'%');
                        $('#jqmeter3').jQMeter({
                            goal:'5',
                            raised:$('#social_participationT input:checked').length+'',
                            orientation:'vertical',
                            width:'20px',
                            height:'135px',
                            barColor:'#5CB85C',
                            animationSpeed:500,
                            displayTotal:false
                        });
                        break;
                }
            });
        }
    }
}
function navpoint(id){
    $('html,body').animate({scrollTop: $("#"+id).offset().top-75}, 200);
}
