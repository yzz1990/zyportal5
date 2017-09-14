/**
 * js公共方法
 */
var clientHeight = $(window).height();
var clientWidth = $(window).width();
var chartHeight=clientHeight - 180;//chart图表高度
var curRow = {};
var olUser="";
//后台接口地址
var cors = 'http://127.0.0.1:8081';
//文件id
var fileid = "";
//文件的前缀
var pre = "file.";
var sysFile = '/Sys_Files';
//新值
var newValue = "";

var curHost = window.location.host;
var curPort = window.location.port;

//文件路径
var urlPathPre = 'http://127.0.0.1:8080/data/files';

//图片上传提示图片地址
var uploadImageUrl = '';

$(function () {
    $("div").on("keypress", "input", function (event) {
        return noNumbers(event);
    });

    $("div").on("keyup", "input", function (event) {
        var value = $(this).val();
        if (value) {
            if (value.indexOf("%") >= 0) {
                $(this).val(value.replace(/%/g, ""));
            }
        }
    });
});
function getLocalStorage(key) {
    return localStorage.getItem(key);
}
function setLocalStorage(key, val) {
    return localStorage.setItem(key, val);
}
function getUserInfo() {
    return JSON.parse(getLocalStorage("userInfo"));
}


//授权检查
function isLogin(data) {
    if (data.desc == "未授权") {
        return false;
    } else {
        return true;
    }
}
//公共AJAX
function getData(type, url, data, dataType, success, error) {
    if (url.indexOf("Permission/auth/token") < 0 && getLocalStorage('token') == null) {
        showtoastr("inverse", "登录超时，2s后自动跳转到登录");
        setTimeout("location.href='login.html'", 2000);
    } else {
        $.ajax({
            type: type,
            url: cors + url,
            cache: false,
            data: data,
            dataType: dataType,
            success: success,
            error: function (obj) {
                var o = obj.responseText;
                if (o != null) {
                    var a = eval("(" + o + ")");
                    if (isLogin(a)) {
                        showtoastr("inverse", a.code + "--" + (a.desc != "undefind" ? a.desc : "异常"));
                    } else {
                        showtoastr("inverse", "登录超时，2s后自动跳转到登录");
                        setTimeout("location.href='login.html'", 2000);
                    }
                } else {
                    showtoastr("inverse", "连接超时");
                }
            },
            headers: {
                "Authorization": "Bearer " + getLocalStorage('token'),
                "Accept": "application/json;charset=UTF-8"
            }
        });
    }
}
function getData_async(type, url, data, dataType, success, error) {
    $.ajax({
        type: type,
        url: cors + url,
        cache: false,
        data: data,
        dataType: dataType,
        success: success,
        async: false,
        error: function (obj) {
            var o = obj.responseText;
            if (o != null) {
                var a = eval("(" + o + ")");
                showtoastr("inverse", a.code + "--" + (a.desc != "undefind" ? a.desc : "异常"));
            } else {
                showtoastr("inverse", "连接超时");
            }
        },
        headers: {
            "Authorization": "Bearer " + getLocalStorage('token'),
            "Accept": "application/json;charset=UTF-8"
        }
    });
}
function createXMLHTTPRequest() {
    var xmlHttpRequest;
    if (window.XMLHttpRequest) {
        xmlHttpRequest = new XMLHttpRequest();
        if (xmlHttpRequest.overrideMimeType) {
            xmlHttpRequest.overrideMimeType("text/xml");
        }
    } else if (window.ActiveXObject) {
        var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        for (var i = 0; i < activexName.length; i++) {
            try {
                xmlHttpRequest = new ActiveXObject(activexName[i]);
                if (xmlHttpRequest) {
                    break;
                }
            } catch (e) {
            }
        }
    }
    return xmlHttpRequest;
}
function request(type, url, data, asy, success, error) {
    var req = createXMLHTTPRequest();
    if (req) {
        req.open(type, url, asy);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    success(req.responseText);
                } else {
                    error();
                }
            }
        }
        req.send(data);
    }
}
function clickMenuItem(idx) {
    localStorage.menuIndex = idx;
}
function clickChildMenu(cidx) {
    localStorage.cMenuIndex = cidx;
}
//所属模块编号
var $moduleid = "";
function selectModuleid(value) {
    $moduleid = value;
}
//所属系统编码
var $syscode = "";
function selectSysCode(value) {
    $syscode = value;
}

// 显示头部时间
function getNowFullTime() {
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date
        .getDay()];
    this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date
        .getMinutes();
    this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date
        .getSeconds();
    var currentTime = "今天是" + this.year + "年" + this.month + "月" + this.date
        + "日 " + this.day;
    return currentTime;
}
/**
 * 利用反射的原理增加对象的前缀
 * 例如：
 *     var obj={id:1,name:'13'};
 *     使用addPrefix(obj,'a.')处理后会变为：
 *     {'a.id':1,'a.name':'13'}
 * @param o 目标对象
 * @param prefix 前缀 比如：'a.'
 * @returns 返回处理后的对象
 */
function addPrefix(o, prefix) {
    var obj = {};
    $.each(o, function (i, n) {
        obj[prefix + i] = n;
    });
    return obj;
}
/**
 * 获取浏览器类型
 */
function getOs() {
    if (isIE = navigator.userAgent.indexOf("MSIE") != -1) {
        return "MSIE";
    }
    if (isFirefox = navigator.userAgent.indexOf("Firefox") != -1) {
        return "Firefox";
    }
    if (isChrome = navigator.userAgent.indexOf("Chrome") != -1) {
        return "Chrome";
    }
    if (isSafari = navigator.userAgent.indexOf("Safari") != -1) {
        return "Safari";
    }
    if (isOpera = navigator.userAgent.indexOf("Opera") != -1) {
        return "Opera";
    }
}
/**
 * 计算两个日期的天数差
 * @param date1 开始时间 格式：yyyy-MM-dd
 * @param date2 结束时间 格式：yyyy-MM-dd
 */
function DateDiff(sDate1, sDate2) {
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为12-18-2006格式
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
    return iDays;
}
/**
 * 计算月份差的函数
 * @param date1 开始时间  格式：yyyy-MM
 * @param date2 结束时间  格式：yyyy-MM
 * @return 结果
 */
function dateMonthDiff(date1, date2) {
    // 拆分年月日
    date1 = date1.split('-');
    // 得到月数
    date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
    // 拆分年月日
    date2 = date2.split('-');
    // 得到月数
    date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
    var m = Math.abs(date1 - date2);
    return m;
}
/**
 * 计算目标日期的前N小时
 * @param targetDate 目标日期 date类型
 * @param hour 要减去的小时数 number类型
 * @param formatstr 格式化日期的格式 例如："yyyy-MM-dd hh"
 * @return 结果
 */
function getPreNHourDate(targetDate, hour, formatstr) {
    var nowTime = targetDate.getTime();
    var threeHourTime = hour * 60 * 60 * 1000;
    var minusTime = nowTime - threeHourTime;
    var nowdate = new Date(minusTime);
    return nowdate.format(formatstr);
}
/**
 * 字符串转日期
 * @param str 字符串日期 格式：yyyy-MM-dd
 * @returns 日期
 */
function strToDate(str) {
    var dateStrs = str.split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10) + 1;
    var date = new Date(year, month, day);
    return date;
}
/**
 * 计算当前时间减去规定的时间
 * @param strdate 开始日期 "yyyy-MM-dd hh:mm:ss"
 * @param minus 减去多少天
 * @return
 */
function getPreNDate(strdate, minus) {
    var arr = strdate.split("-");
    var year = parseInt(arr[0], 10);
    var month = parseInt(arr[1], 10);
    var sub = arr[2].split(" ");
    var day = parseInt(sub[0], 10);
    var v = "";
    if (day <= minus) {
        if (month == 1) {
            year = year - 1;
            v = year + "-12-" + (month + 31 - minus);
        } else {
            var arr1 = new Array([31], [28], [31], [30], [31],
                [30], [31], [31], [30], [31], [30], [31]);
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                arr1[1]++;
            }
            var mm = arr1[month - 1 - 1] - minus;
            v = year + "-"
                + ((month - 1) < 10 ? "0" + (month - 1) : (month - 1))
                + "-" + (day + (mm = 0 ? "" : mm));
        }
    } else {
        v = year + "-" + (month < 10 ? "0" + month : month) + "-"
            + ((day - minus) < 10 ? "0" + (day - minus) : (day - minus));
    }
    if (sub[1] != null && sub[1] != "") {
        v = v + " " + sub[1];
    }
    return v;
}

// 获取系统当前时间，格式为Y-M-D H:M:S
function getSysCurrentTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    var day = now.getDate();
    day = day > 9 ? day : "0" + day;
    var hour = now.getHours();
    hour = hour > 9 ? hour : "0" + hour;
    var minute = now.getMinutes();
    minute = minute > 9 ? minute : "0" + minute;
    var second = now.getSeconds();
    second = second > 9 ? second : "0" + second;

    var time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return time;
}

/**
 * 获取昨天的日期
 * @param data 格式："yyyy-MM-dd"
 */
function getYestoday(date) {
    var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24;
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);

    var strYear = yesterday.getFullYear();
    var strDay = yesterday.getDate();
    var strMonth = yesterday.getMonth() + 1;
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    datastr = strYear + "-" + strMonth + "-" + strDay;
    return datastr;
}

/**
 * 获取明天的日期
 * @param data 格式："yyyy-MM-dd"
 */
function getTomorrow(date) {
    var yesterday_milliseconds = date.getTime() + 1000 * 60 * 60 * 24;
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);

    var strYear = yesterday.getFullYear();
    var strDay = yesterday.getDate();
    var strMonth = yesterday.getMonth() + 1;
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    datastr = strYear + "-" + strMonth + "-" + strDay;
    return datastr;
}

/**
 * 获取昨天的时间
 * @param data 格式："yyyy-MM-dd hh:mm:ss"
 */
function getYestodayTime(date) {
    var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24;
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);

    var strYear = yesterday.getFullYear();
    var strDay = yesterday.getDate();
    var strMonth = yesterday.getMonth() + 1;
    var strHour = yesterday.getHours();
    var strMin = yesterday.getMinutes();
    var strSec = yesterday.getSeconds();
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    if (strHour < 10) {
        strHour = "0" + strHour;
    }
    if (strMin < 10) {
        strMin = "0" + strMin;
    }
    if (strSec < 10) {
        strSec = "0" + strSec;
    }
    datastr = strYear + "-" + strMonth + "-" + strDay + " " + strHour + ":"
        + strMin + ":" + strSec;
    return datastr;
}

/**
 * 获得上个月在昨天这一天的日期
 * @param date 格式："yyyy-MM-dd"
 */
function getLastMonthYestdy(date) {
    var daysInMonth = new Array([0], [31], [28], [31], [30], [31],
        [30], [31], [31], [30], [31], [30], [31]);
    var strYear = date.getFullYear();
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strYear % 4 == 0 && strYear % 100 != 0) {
        daysInMonth[2] = 29;
    }
    if (strMonth - 1 == 0) {
        strYear -= 1;
        strMonth = 12;
    } else {
        strMonth -= 1;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    datastr = strYear + "-" + strMonth + "-" + strDay;
    return datastr;
}

/**
 * 获得上一年在昨天这一天的日期
 * @param date 格式："yyyy-MM-dd"
 */
function getLastYearYestdy(date) {
    var strYear = date.getFullYear() - 1;
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    datastr = strYear + "-" + strMonth + "-" + strDay;
    return datastr;
}
/**
 * 禁止输入特殊字符
 */
function noNumbers(e) {
    var keynum;
    var keychar;
    var numcheck;
    var flag = true;

    if (window.event) // IE
    {
        keynum = e.keyCode;
    } else if (e.which) // Netscape/Firefox/Opera
    {
        keynum = e.which;
    }
    keychar = String.fromCharCode(keynum);
    numcheck = /[%'"<>$&^￥-\s]/g;
    flag = !numcheck.test(keychar);
    return flag;
}
/**
 * fr的中文字符转化
 */
function cjkEncode(text) {
    if (text == null) {
        return "";
    }
    var newText = "";
    for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        if (code >= 128 || code == 91 || code == 93) { //91 is "[", 93 is "]".
            newText += "[" + code.toString(16) + "]";
        } else {
            newText += text.charAt(i);
        }
    }
    return newText;
}

/**
 * @return 项目的根 如：http://localhost:8080/ems
 */
function getRootPath() {
    //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8080
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/ems
    var projectName = pathName
        .substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPath + projectName);
};

function getRootBase() {
    //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8080
    var localhostPath = curWwwPath.substring(0, pos);
    return localhostPath;
}

/************************* 增加对象原型方法 *********************************/

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.Trim = function () {
    return this.trim();
};
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds()
        //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
//转换long型为日期字符串
function getFormatDateByLong(l, pattern) {
    return getFormatDate(new Date(l), pattern);
}
//转换日期对象为日期字符串
function getFormatDate(date, pattern) {
    if (date == undefined) {
        date = new Date();
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
}

/**********************************Cookies操作函数*******************************/
//hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。
function setCookie(name, value, hours, path) {
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + hours * 3600000);
    path = path == "" ? "" : ";path=" + path;
    _expires = (typeof hours) == "string" ? "" : ";expires="
        + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
}
//获取cookie值    方法
function getCookieValue(name) {
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1) { //如果pos值为-1则说明搜索"version="失败
        var start = pos + name.length; //cookie值开始的位置
        var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
        if (end == -1)
            end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie
        var value = allcookies.substring(start, end); //提取cookie的值
        return unescape(value); //对它解码
    } else
        return ""; //搜索失败，返回空字符串
}
//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.GetCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
/**********************************页面操作函数*******************************/
/*加入收藏*/
function AddBookmark(site, url) {
    if (navigator.userAgent.toLowerCase().indexOf('ie') > -1) {
        window.external.addFavorite(url, site)
    } else if (navigator.userAgent.toLowerCase().indexOf('opera') > -1) {
        alert("请使用Ctrl+T将本页加入收藏夹");
    } else {
        alert("请使用Ctrl+D将本页加入收藏夹");
    }
}
/*设为首页，如有参数就设置成参数*/
function SetHome() {
    var img = new Image();
    img.style.behavior = 'url(#default#homepage)';
    if (arguments.length > 0) {
        img.setHomePage(arguments[0]);
    } else {
        img.setHomePage(location.href);
    }
}
/**********************************文件加载函数*******************************/
//页面必须有head元素,Loadfile("test.js", "js"),Loadfile("javascript.php", "js"),Loadfile("test.css", "css")
function loadfile(filename, filetype) {
    var fileref;
    //判断文件类型
    switch (filetype) {
        case "js":
            fileref = document.createElement('script');
            fileref.setAttribute("lang ge", "javascript");
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
            break;
        case "css":
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
            break;
        default:
            break;
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}
/***********************************验证类函数**********************************/
/*  检测字符长度
 @str        字符集
 @s          开始长度
 @l          结束长度
 */
function isLen(str, s, l) {
    str = Trim(str);
    if (str.length > s && str.length < l) {
        return true;
    } else {
        return false;
    }
}
/*  是否是数字型数据
 @str        字符集
 */
function isNumber(str) {
    if (/^\d+$/.test(str)) {
        return true;
    } else {
        return false;
    }
}
/*  是否是自然数型数据
 @str        字符集
 */
function isInt(str) {
    if (/^(\+|-)?\d+$/.test(str)) {
        return true;
    } else {
        return false;
    }
}
/*是否为字母和数字（字符集）*/
function isLetters(str) {
    if (/^[A-Za-z0-9]+$/.test(str)) {
        return true;
    } else {
        return false;
    }
}
/*是否为英文字母（字符集）*/
function isLetter(str) {
    if (/^[A-Za-z]+$/.test(str)) {
        return true;
    } else {
        return false;
    }
}
/*是否为大写字母（字符集）*/
function isUpper(str) {
    if (/^[A-Z]+$/.test(str)) {
        return true;
    } else {
        return false;
    }
}
/*是否为小写字母（字符集）*/
function isLower(str) {
    if (/^[a-z]+$/.test(str)) {
        return true
    } else {
        return false;
    }
}
/*  是否为正确的网址
 @str        字符集
 */
function isUrl(str) {
    var myReg = /^((http:[/][/])?\w+([.]\w+|[/]\w*)*)?$/;
    if (myReg.test(str)) {
        return true;
    } else {
        return false;
    }
}
/*  是否为正确的Email形式
 @str        字符集
 */
function isEmail(str) {
    var myReg = /^([-_A-Za-z0-9\.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    if (myReg.test(str)) {
        return true;
    } else {
        return false;
    }
}
/*  是否为正确的手机号码
 @str        字符集
 */
function isMobile(str) {
    var regu = /(^[1][3][0-9]{9}$)|(^0[1][3][0-9]{9}$)/;
    var re = new RegExp(regu);
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
/**
 * 只软许输入设定精度的double值
 * 写法：onkeyup="keyUpDouble(this,2)"
 * @param obj input对象
 * @param num 精度 如果为0 精度就是1;
 *                如果大于0 就是 1,num
 */
function keyUpDouble(obj, num) {
    var str = "1";
    var targetValue = $(obj).val();
    if (String(parseInt(targetValue)) == 'NaN') {
        newValue = "";
    }
    if (parseInt(num) > 0) {
        str = "1," + num;
    }
    eval("var re = /^((\\d*?)(\\.?)((\\d{" + str + "})?))$/;");
    if (!targetValue.match(re)) {
        $(obj).val(newValue);
    } else {
        newValue = targetValue;
    }
}

/**
 * 判断是否超过预警值
 * @param min 警戒最小值
 * @param max 警戒最大值
 * @param value 实际值
 * @returns 报警：red 不报警：black
 */
function judgwarn(min, max, value) {
    var colorstr = "black";
    if (typeof min != "undefined" && min != null) {
        if (value < min) {
            colorstr = "red";
        }
    }

    if (typeof max != "undefined" && max != null) {
        if (value > max) {
            colorstr = "red";
        }
    }
    return colorstr;
}

function format_yl(value) {
    if (value) {
        return parseFloat(value).toFixed(1);
    } else {
        return value;
    }
}

function format_sw(value) {
    //	if(value==showBar){
    //		return "--";
    //	}else{
    if (value) {
        return parseFloat(value).toFixed(2);
    } else {
        return value;
    }
    //	}
}

//		获取消息提示数据
var allTransactionData;//全部事务数据
function getAlertData() {
    getData('post', 'transaction/transactionAction!findTransactionList.action', null, 'json',
        function (obj) {
            allTransactionData = obj;
            $('#topTipNum').html(obj.length);//事项和通知总个数
            var noticeCount = 0;//通知个数
            var eventCount = 0;//事项个数
            $('#msgList').empty();//通知
            $('#projectList').empty();
            //区分处理通知和事项         通知无需处理(type=2),事项需要处理(type=1)
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].type == '1') {//事项
                    var aaa = JSON.stringify(obj[i]);
                    $('#projectList').append(
                        '<li  >'
                        + '<div class="small pull-right m-t-xs">'
                        + (obj[i].updatetime == undefined ? obj[i].createtime : obj[i].updatetime)
                        + '</div>'
                        + '<h4>'
                        + obj[i].name
                        + '</h4>'
                        + obj[i].content
                        + '<div style="text-align:right;"><button id="' + obj[i].id + '" moduleCode="' + obj[i].modulecode + '" relativeid="' + obj[i].relativeid + '" onclick="removeEvent(this);" type="button" class="btn btn-primary btn-xs">审核</button></div>'
                        + '</li>');
                    eventCount++;
                }
                if (obj[i].type == '2') {//通知
                    if (obj[i].modulecode == 'cybg') {
                        $('#msgList').append(
                            '<li id="notice' + obj[i].id + '">'
                            + '<div class="small pull-right m-t-xs">'
                            + (obj[i].updatetime == undefined ? obj[i].createtime : obj[i].updatetime)
                            + '</div>'
                            + '<h4>'
                            + obj[i].name
                            + '</h4>'
                            + obj[i].content
                            + '<div style="text-align:right;"><button id="' + obj[i].id + '" modulecode="' + obj[i].modulecode + '"  onclick="removeNotice(this);" relativeid="' + obj[i].relativeid + '" type="button" class="btn btn-primary btn-xs">查看</button></div>'
                            + '</li>');
                    } else {
                        $('#msgList').append(
                            '<li id="notice' + obj[i].id + '">'
                            + '<div class="small pull-right m-t-xs">'
                            + (obj[i].updatetime == undefined ? obj[i].createtime : obj[i].updatetime)
                            + '</div>'
                            + '<h4>'
                            + obj[i].name
                            + '</h4>'
                            + obj[i].content
                            + '<div style="text-align:right;"><button id="' + obj[i].id + '" modulecode="' + obj[i].modulecode + '" onclick="removeNotice(this);" relativeid="' + obj[i].relativeid + '" type="button" class="btn btn-primary btn-xs">知道了</button></div>'
                            + '</li>');
                    }


                    noticeCount++;
                }
            }
            $('#rightNoteTip').html(noticeCount);//通知个数
            $('#projectTotalNum').html(eventCount);//事项个数
        });


}
// getAlertData();
//Interval(getAlertData, 1000*30);

var fatherMenuIndex = $('#jcxxgl').attr('pmenuindex');
var childMenuIndex = $('#jcxxgl_cyyhbgjl').attr('cmenuindex');

//通知按钮点击
function removeNotice(obj) {//将事务移除
//	alert($(obj).attr('id'));
    $.post("transaction/transactionAction!whenKownTheTransaction.action", {"objId": $(obj).attr('id')},
        function (data) {
            if (data.status) {
                $('#notice' + $(obj).attr('id')).remove();//移除元素
                var count = $('#rightNoteTip').html();
                count--;
                $('#rightNoteTip').html(count < 0 ? 0 : count);//个数减少一个
                $('#topTipNum').html(parseInt($('#projectTotalNum').html()) + count);//总数改变
            }
        }, "json");

    if ($(obj).attr('modulecode') == 'cybg') {//跳转到餐饮用户变更记录页面
        var hrefPath = "http://" + curHost + "/zyportal_v4_main/foreground/jcxxgl/cyyhbgjl/index.jsp?Id=" + $(obj).attr('relativeid');
        location.href = hrefPath;
        localStorage.menuIndex = fatherMenuIndex;
        localStorage.cMenuIndex = childMenuIndex;
    }


}

//事项按钮点击
var showEventMsg;
//var updatem1;
var updatem;
var transactionEventData;
var transactionEventData1;
var transactionEventData2;
var $sckgss;
function removeEvent(obj) {

//		alert($(obj).attr('id'));

//	jbxxgl = messageConfimDialog(BootstrapDialog.TYPE_INFO,"事项解决(名字可自定义)", $('<div></div>').load(
//			ctx + '/foreground/jdxxgl/jbxxgl/detail.jsp'),dataLoadEx, [ null, null,null]);

    //transactionId=$(obj).attr('id');
    var modCode = $(obj).attr('modulecode');
    var relaId = $(obj).attr('relativeid');

    if (modCode == 'jbxxgl') {
        $.post("jbxx/jbxxAction!queryMainList.action", {
                "pageNumber": 1,
                "pageSize": 1000,
                "sqlParam": " and id ='" + relaId + "' "
            },//获取对应的举报
            function (data) {
                transactionEventData = data.rows;
                updatem = (BootstrapDialog.TYPE_INFO, "事项解决", $('<div></div>').load(
                    ctx + '/foreground/jdxxgl/jbxxgl/addOrEdit.jsp'), addOrEditSubmitjb, null, dataLoadEx, ['#addOrEditDiv', data.rows[0], gotoSolvePromble]);
            }, "json");
    } else if (modCode == 'aqjcgl') {
        $.post("aqjcxx/aqjcxxAction!queryMainList.action", {
                "pageNumber": 1,
                "pageSize": 1000,
                "sqlParam": "and sckid='" + relaId + "'and type='1'"
            },//获取行业检查
            function (data) {
                transactionEventData1 = data.rows;
                $sckgss = transactionEventData1[0].sckgss;
                updatem = messageConfimDialog(BootstrapDialog.TYPE_INFO, "事项解决", $('<div></div>').load(
                    ctx + '/foreground/jdxxgl/aqjcxx/addOrEdit.jsp'), addOrEditSubmit, null, dataLoadEx, ['#addOrEditDiv', transactionEventData1[0], gotoSolvePrombleAQJC]);
            }, "json");

    } else {
        $.post("aqjcxx/aqjcxxAction!queryMainList.action", {
                "pageNumber": 1,
                "pageSize": 1000,
                "sqlParam": "and sckid='" + relaId + "'and type='2'"
            },//获取属地巡查
            function (data) {
//					console.log(data.rows);
                transactionEventData2 = data.rows;
                $sckgss = transactionEventData2[0].sckgss;
                updatem = messageConfimDialog(BootstrapDialog.TYPE_INFO, "事项解决", $('<div></div>').load(
                    ctx + '/foreground/jdxxgl/sdxcgl/addOrEdit.jsp'), addOrEditSubmit, null, dataLoadEx, ['#addOrEditDiv', transactionEventData2[0], gotoSolvePrombleSDXC]);
            }, "json");
    }

}

function gotoSolvePromble() {
    if (transactionEventData[0].filebasename != undefined) {
        var $filebasename = transactionEventData[0].filebasename;
//		var $filebasename="";
        setDivImgName($filebasename);
    } else {
        $filebasename = "";
        setDivImgName($filebasename);
    }
}
function gotoSolvePrombleAQJC() {
    var $issue = transactionEventData1[0].issue;
    initIssue($issue);
    var $filebasename = transactionEventData1[0].filebasename == undefined ? "" : transactionEventData1[0].filebasename;
    setDivImgName($filebasename);

    var sqlAqjcV = '';
    var $aqjcAreaCode = transactionEventData1[0].areacode;
    if ($aqjcAreaCode != '') {
        sqlAqjcV += " and areacode like '%" + $aqjcAreaCode + "%' ";
    }
    //加载供应站下拉框
//	var region=$('#Area').val();alert(region);
    $.post("gyzxx/gyzxxAction!getGyzSelect.action", {"gyzSqlParam": sqlAqjcV},
        function (data) {
            $.each(data, function (n, value) {
                if ($sckgss == value[0]) {
                    $('#sckgss').append('<option value="' + value[0] + '" selected="selected">' + value[1] + '</option>');
                } else {
                    $('#sckgss').append('<option value="' + value[0] + '">' + value[1] + '</option>');
                }
            });
        }, "json");
}
function gotoSolvePrombleSDXC() {
    var $issue = transactionEventData2[0].issue;
    initIssue($issue);
    var $filebasename = transactionEventData2[0].filebasename == undefined ? "" : transactionEventData2[0].filebasename;
    setDivImgName($filebasename);
    var sqlSdxcV = '';
    var $SdxcArea = transactionEventData2[0].areacode;
    if ($SdxcArea != "") {
        sqlSdxcV += " and areacode like '%" + $SdxcArea + "%' ";
    }
    //加载商户企业下拉框
//	var region=$('#areacode').val();
    $.post("cyyhxx/cyyhxxAction!getCyyhSelect.action", {"cyyhSqlParam": sqlSdxcV},
        function (data) {
            $.each(data, function (n, value) {
                if ($sckgss == value[0]) {
                    $('#restaurant').append('<option  value="' + value[0] + '" selected="selected">' + value[1] + '</option>');
                } else {
                    $('#restaurant').append('<option  value="' + value[0] + '">' + value[1] + '</option>');
                }
            });
        }, "json");
}
/*新增或编辑提交*/
function addOrEditSubmitjb() {
    $.ajax({
        url: "jbxx/jbxxAction!addOrUpdate.action",
        data: $("#addOrUpdatefrom").serialize(),
        dataType: "json",
        type: "post",
        success: function (data) {
            if (data.status) {
                reloadTableData();
                showtoastr("success", data.message);
                if (updatem) {
                    updatem.close();
                }
            } else {
                showtoastr("error", data.message);
            }
        }
    });

}
function addOrEditSubmit() {
//	if(validForm()){
    $.ajax({
        url: "aqjcxx/aqjcxxAction!addOrUpdate.action",
        data: $("#addOrUpdatefrom").serialize(),
        dataType: "json",
        type: "post",
        success: function (data) {
            if (data.status) {
                reloadTableData();
                showtoastr("success", data.message);
                if (updatem) {
                    updatem.close();
                }
            } else {
                showtoastr("error", data.message);
            }
        }
    });
//	}
}
/*----------------------------------------------右侧获取消息提示列表----------------------------------------------------------------*/
function getMsgList() {
    getData('post', 'foreground/common/data/message_data.json', '', 'json',
        function (obj) {
            var msgNum = obj.message.content.length;
            var unreadNum = 0;
            for (var i = 0; i < msgNum; i++) {
                if (obj.message.content[i].state == '未读') {
                    unreadNum++;
                }
            }
            $('#msgList').empty();
            for (var j = 0; j < unreadNum; j++) {
                $('#msgList').append(
                    '<div class="sidebar-message">'
                    + '<a href="index/msglist.jsp">'
                    + '<div class="media-body">'
                    + obj.message.content[j].detail + '<br>'
                    + '<small class="text-muted">'
                    + obj.message.content[j].date + '</small>'
                    + '</div>' + '</a>' + '</div>');
            }
        });
}
//getMsgList();
//setInterval(getMsgList, 900000);

/*----------------------------------------------右侧获取代办事项列表----------------------------------------------------------------*/
function getProjectList() {
    getData(
        'post',
        'foreground/common/data/project_data.json',
        '',
        'json',
        function (obj) {
            $('#projectTotalNum').html(obj.project.num.totalNum);
            $('#projectTodoNum').html(obj.project.num.todoNum);
            var projectNum = obj.project.content.length;
            $('#projectList').empty();
            for (var i = 0; i < projectNum; i++) {
                $('#projectList')
                    .append(
                        '<li>'
                        + '<a href="index/todolist.jsp">'
                        + '<div class="small pull-right m-t-xs">'
                        + obj.project.content[i].date
                        + '</div>'
                        + '<h4>'
                        + obj.project.content[i].title
                        + '</h4>'
                        + obj.project.content[i].detail
                        + '<div class="small">进度&nbsp;'
                        + obj.project.content[i].state
                        + '</div>'
                        + '<div class="progress progress-mini">'
                        + '<div style="width: '
                        + obj.project.content[i].state
                        + ';" class="progress-bar progress-bar-success"></div>'
                        + '</div>'
                        + '<div class="small text-muted m-t-xs">'
                        + obj.project.content[i].deadline
                        + '</div>' + '</a>' + '</li>');
            }
        });
}
//getProjectList();
//setInterval(getProjectList, 900000);

/*----------------------------------------------top天气信息----------------------------------------------------------------*/
function getWeatherData() {
    getData(
        'get',
        'http://op.juhe.cn/onebox/weather/query?cityname=%E6%97%A0%E9%94%A1&key=688fbddfa97c62a96b091910ff22cddb',
        '',
        'jsonp',
        function (obj) {
            $('#temperature').html(
                obj.result.data.weather[0].info.night[2] + '~'
                + obj.result.data.weather[0].info.day[2] + '℃');
            $('#temperature').css(
                'background',
                'url("foreground/common/image/weatherIcon/'
                + obj.result.data.weather[0].info.day[0]
                + '.png") no-repeat right center/auto 100%');
            $('#weatherDescrip').html(
                obj.result.data.weather[0].info.day[1]);
            $('#windInfo').html(
                obj.result.data.realtime.wind.direct + ' '
                + obj.result.data.realtime.wind.power);
        });
}
// getWeatherData();
// setInterval(getWeatherData, 1800000);

/*----------------------------------------------top日历----------------------------------------------------------------*/
function getDate() {
    var date = getCurrentDateTime();
    var week = showWeek();
    var calendar = showCal();
    $("#currentDate1").text(date);
    $("#currentDate2").text(week + " 农历：" + calendar);
}
setInterval(getDate, 1000);

/*----------------------------------------------日期操作----------------------------------------------------------------*/
/*获取当前日期*/
function getCurrentDateTime() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var week = d.getDay();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    /*时分秒*/
    /*var hours = d.getHours();
     var minutes = d.getMinutes();
     var seconds = d.getSeconds();
     var ms = d.getMilliseconds();*/
    var curDateTime = year;
    if (month > 9)
        curDateTime = curDateTime + "-" + month;
    else
        curDateTime = curDateTime + "-0" + month;
    if (date > 9)
        curDateTime = curDateTime + "-" + date;
    else
        curDateTime = curDateTime + "-0" + date;
    if (hour > 9)
        curDateTime = curDateTime + " " + hour;
    else
        curDateTime = curDateTime + " 0" + hour;
    if (min > 9)
        curDateTime = curDateTime + ":" + min;
    else
        curDateTime = curDateTime + ":0" + min;
    if (sec > 9)
        curDateTime = curDateTime + ":" + sec;
    else
        curDateTime = curDateTime + ":0" + sec;
    /*if (hours > 9)
     curDateTime = curDateTime + " " + hours;
     else
     curDateTime = curDateTime + " 0" + hours;
     if (minutes > 9)
     curDateTime = curDateTime + ":" + minutes;
     else
     curDateTime = curDateTime + ":0" + minutes;
     if (seconds > 9)
     curDateTime = curDateTime + ":" + seconds;
     else
     curDateTime = curDateTime + ":0" + seconds;*/
    curDateTime = curDateTime;
    return curDateTime;
}
function showWeek() {
    var d = new Date();
    var week = d.getDay();
    var weekday = "";
    if (week == 0)
        weekday = "星期日";
    else if (week == 1)
        weekday = "星期一";
    else if (week == 2)
        weekday = "星期二";
    else if (week == 3)
        weekday = "星期三";
    else if (week == 4)
        weekday = "星期四";
    else if (week == 5)
        weekday = "星期五";
    else if (week == 6)
        weekday = "星期六";
    return weekday;
}
/*获取当前农历*/
function showCal() {
    var D = new Date();
    var yy = D.getFullYear();
    var mm = D.getMonth() + 1;
    var dd = D.getDate();
    var ww = D.getDay();
    var ss = parseInt(D.getTime() / 1000);
    if (yy < 100)
        yy = "19" + yy;
    return GetLunarDay(yy, mm, dd);
}

//定义全局变量
var CalendarData = new Array(100);
var madd = new Array(12);
var tgString = "甲乙丙丁戊己庚辛壬癸";
var dzString = "子丑寅卯辰巳午未申酉戌亥";
var numString = "一二三四五六七八九十";
var monString = "正二三四五六七八九十冬腊";
var weekString = "日一二三四五六";
var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
var cYear, cMonth, cDay, TheDate;
CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957,
    0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E,
    0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D,
    0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B,
    0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE,
    0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD,
    0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B,
    0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F,
    0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E,
    0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D,
    0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57,
    0x52B, 0xA93, 0x40E95);
madd[0] = 0;
madd[1] = 31;
madd[2] = 59;
madd[3] = 90;
madd[4] = 120;
madd[5] = 151;
madd[6] = 181;
madd[7] = 212;
madd[8] = 243;
madd[9] = 273;
madd[10] = 304;
madd[11] = 334;

function GetBit(m, n) {
    return (m >> n) & 1;
}
//农历转换
function e2c() {
    TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0],
        arguments[1], arguments[2]);
    var total, m, n, k;
    var isEnd = false;
    var tmp = TheDate.getYear();
    if (tmp < 1900) {
        tmp += 1900;
    }
    total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4)
        + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
    if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
        total++;
    }
    for (m = 0; ; m++) {
        k = (CalendarData[m] < 0xfff) ? 11 : 12;
        for (n = k; n >= 0; n--) {
            if (total <= 29 + GetBit(CalendarData[m], n)) {
                isEnd = true;
                break;
            }
            total = total - 29 - GetBit(CalendarData[m], n);
        }
        if (isEnd)
            break;
    }
    cYear = 1921 + m;
    cMonth = k - n + 1;
    cDay = total;
    if (k == 12) {
        if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth = 1 - cMonth;
        }
        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth--;
        }
    }
}

function GetcDateString() {
    var tmp = "";
    /*显示农历年：（ 如：甲午(马)年 ）*/
    /*tmp+=tgString.charAt((cYear-4)%10);
     tmp+=dzString.charAt((cYear-4)%12);
     tmp+="(";
     tmp+=sx.charAt((cYear-4)%12);
     tmp+=")年 ";*/
    if (cMonth < 1) {
        tmp += "(闰)";
        tmp += monString.charAt(-cMonth - 1);
    } else {
        tmp += monString.charAt(cMonth - 1);
    }
    tmp += "月";
    tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
    if (cDay % 10 != 0 || cDay == 10) {
        tmp += numString.charAt((cDay - 1) % 10);
    }
    return tmp;
}

function GetLunarDay(solarYear, solarMonth, solarDay) {
    //solarYear = solarYear<1900?(1900+solarYear):solarYear;
    if (solarYear < 1921 || solarYear > 2020) {
        return "";
    } else {
        solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
        e2c(solarYear, solarMonth, solarDay);
        return GetcDateString();
    }
}

/*----------------------------------------------toastr操作----------------------------------------------------------------*/
/*操作提示信息 type:error,success,info,warning*/
function showtoastr(type, msg) {
    $.growl({
        message: msg
    }, {
        type: type,
        allow_dismiss: false,
        label: 'Cancel',
        className: 'btn-xs btn-inverse',
        placement: {
            from: 'top',
            align: 'center'
        },
        delay: 2500,
        animate: {
            enter: 'animated fadeIn',
            exit: 'animated fadeOut'
        },
        offset: {
            x: 20,
            y: 85
        }
    });
}
/*
 * Notifications
 */
function donotify(title, msg, from,align,even) {
    $.growl({
        title: title,
        message: msg,
        url: ''
    }, {
        element: 'body',
        allow_dismiss: true,
        placement: {
            from: from,
            align: align
        },
        offset: {
            x: 20,
            y: 85
        },
        spacing: 10,
        z_index: 1031,
        delay: 2500,
        timer: 1000,
        url_target: '_blank',
        mouse_over: false,
        // animate: {
        //     enter: animIn,
        //     exit: animOut
        // },
        icon_type: 'class',
        template: '<div data-growl="container" class="alert" role="alert">' +
        '<button type="button" class="close" data-growl="dismiss">' +
        '<span aria-hidden="true">&times;</span>' +
        '<span class="sr-only">Close</span>' +
        '</button>' +
        '<span data-growl="icon"></span>' +
        '<span data-growl="title"></span>' +
        '<span data-growl="message"></span>' +
        // '<a href="JavaScript:'+even+'" data-growl="url"></a>' +
        '</div>'
    });
};

/*----------------------------------------------dialog操作----------------------------------------------------------------*/
/*消息提示框1        参数  type:提示类型      title:标题       message:提示消息    */
function messageDialog(type, title, message, btntype) {
    return BootstrapDialog.show({
        type: type,
        title: title,
        message: message,
        buttons: [{
            label: '确定',
            icon: 'glyphicon glyphicon-ok',
            cssClass: 'btn-outline ' + btntype,
            action: function (dialogItself) {
                dialogItself.close();
            }
        }]
    });
}

/*交互的消息提示框     有确定和取消两个按钮     title:标题       message:提示消息      fn调用的方法  args调用方法的参数      onshownFn 显示后执行的函数，onshownArgs 显示后执行的函数的参数，以此类推
 type: BootstrapDialog.TYPE_WARNING SUCCESS TYPE_DANGER  INFO TYPE_PRIMARY TYPE_DEFAULT
 */
function messageConfimDialog(type, title, message, fn, args, onshownFn, onshownArgs) {
    return BootstrapDialog.show({
        type: type,
        title: title,
        message: message,
        onshow: function () {//显示前执行

        },
        onshown: function () {//显示后执行
            if (onshownFn != null) {
                onshownFn.apply(null, onshownArgs);
            }
        },
        buttons: [{
            label: '取消',
            icon: 'glyphicon glyphicon-remove',
            cssClass: 'btn btn-icon-text waves-effect btn-danger',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }, {
            label: '确定',
            icon: 'glyphicon glyphicon-ok',
            cssClass: 'btn btn-icon-text waves-effect btn-primary',
            action: function (dialogItself) {
                if (fn != null) {
                    fn.apply(null, args);
                    dialogItself.close();
                }
            }
        }]
    });
}

function messageConfimDialogCommon(type, title, message, onshow, onshown, cancelFn, okFn) {
    return BootstrapDialog.show({
        type: type,
        title: title,
        message: message,
        onshow: function (dialogRef) {
            var $dialogParentDiv = dialogRef.getMessage();
            $dialogParentDiv.css('overflow-x', 'hidden');
            $dialogParentDiv.css('overflow-y', 'auto');
            $dialogParentDiv.css('height', clientHeight * 0.6);
            onshow($dialogParentDiv);
        },//显示前执行
        onshown: function (dialogRef) {
            // var $dialogParentDiv=dialogRef.getMessage();
            // $dialogParentDiv.css('width',$dialogParentDiv.width()-100);

            onshown();
        },//显示后执行
        buttons: [{
            label: '取消',
            icon: 'glyphicon glyphicon-remove',
            cssClass: 'btn btn-icon-text waves-effect btn-danger',
            action: function (dialogItself) {
                if (cancelFn != null) {
                    cancelFn();
                }
                dialogItself.close();
            }
        }, {
            label: '确定',
            icon: 'glyphicon glyphicon-ok',
            cssClass: 'btn btn-icon-text waves-effect btn-primary',
            action: function (dialogItself) {
                if (okFn != null) {
                    okFn();
                }
            }
        }]
    });
}

function messageConfimDialogWithoutOK(type, title, message, onshownFn,
                                      onshownArgs) {
    return BootstrapDialog.show({
        type: type,
        title: title,
        message: message,
        onshow: function () {//显示前执行

        },
        onshown: function () {//显示后执行
            if (onshownFn != null) {
                onshownFn.apply(null, onshownArgs);
            }
        },
        buttons: [{
            label: '取消',
            icon: 'glyphicon glyphicon-remove',
            cssClass: 'btn btn-icon-text waves-effect  btn-danger',
            action: function (dialogItself) {
                dialogItself.close();
            }
        }]
    });
}

function messageConfimDialogOnlyClose(type, title, message, onshow, onshown, cancelFn, okFn) {
    return BootstrapDialog.show({
        type: type,
        title: title,
        message: message,
        onshow: function (dialogRef) {
            var $dialogParentDiv = dialogRef.getMessage();
            $dialogParentDiv.css('overflow-x', 'hidden');
            $dialogParentDiv.css('overflow-y', 'auto');
            $dialogParentDiv.css('height', clientHeight * 0.6);
            onshow($dialogParentDiv);
        },//显示前执行
        onshown: function (dialogRef) {
            // var $dialogParentDiv=dialogRef.getMessage();
            // $dialogParentDiv.css('width',$dialogParentDiv.width()-100);

            onshown();
        },//显示后执行
        buttons: [{
            label: '关闭',
            icon: 'glyphicon glyphicon-remove',
            cssClass: 'btn btn-icon-text waves-effect btn-danger',
            action: function (dialogItself) {
                if (cancelFn != null) {
                    cancelFn();
                }
                dialogItself.close();
            }
        }]
    });
}


function messageConfimDialogWatting(type, title, message) {
    return BootstrapDialog.show({
        type: type,
        title: title,
        message: message,
        closeByBackdrop: false,//点击遮罩层不会退出
        closable: false,//去掉关闭按钮
    });
}


/*----------------------------------------------表单操作----------------------------------------------------------------*/
/*编辑时将数据填充到表单*/
var allowNode = 'input:not(":checkbox,:radio,.inputfilter"),select,span';//根据具体情况需要补全,特殊类型需要去掉
var setValueArr = ['input', 'select'];//给value设值的类型
var setTextArr = ['span'];//给text设值的类型
function dataLoad(obj, data) {//obj为父节点对象
    //遍历obj 的 form下所有允许节点的带有name属性的控件
    $(obj + ' form').find(allowNode)
        .each(
            function (i) {
                var key = $(this).attr('name');
                if (key != undefined && key != null) {
                    if (data.hasOwnProperty(key)) {//判断key是否存在
                        //需要判断当前节点类型是给value设值还是html设值
                        if (setValueArr.indexOf(this.nodeName
                                .toLowerCase()) > -1) {
                            $(this).val(data[key]);
                        } else if (setTextArr.indexOf(this.nodeName
                                .toLowerCase()) > -1) {
                            $(this).text(data[key]);
                        }
                    }
                }
            });
}
function dataLoadEx(obj, data, e) {//obj为父节点对象
    //遍历obj 的 form下所有允许节点的带有name属性的控件
    $(obj + ' form').find(allowNode)
        .each(
            function (i) {
                var key = $(this).attr('name');
                if (key != undefined && key != null) {
                    if (data.hasOwnProperty(key)) {//判断key是否存在
                        //需要判断当前节点类型是给value设值还是html设值
                        if (setValueArr.indexOf(this.nodeName
                                .toLowerCase()) > -1) {
                            $(this).val(data[key]);
                        } else if (setTextArr.indexOf(this.nodeName
                                .toLowerCase()) > -1) {
                            $(this).text(data[key]);
                        }
                    }
                }
            });
    e();
}

// //思路:  遍历josn中的key,
// // 		找到key与form中name匹配的元素,多个需要遍历
// // 		判断元素类型,赋值
// function formLoadingDatas($form,$json){
// 	for(var key in $json){
// 		var thisValue=$json[key];//对应的值
// 		// var thisObj=$("[name='"+key+"']");
//         // var domObject = thisObj[0]; //从jQuery对象中得到原生的DOM对象
//         var domObject=document.getElementsByName(key);
//         console.log(thisValue);
//         console.log(key+":"+domObject[0].tagName); //提示出“INPUT”
//
//
// 	}
// }


//加载图片
function imgLoad(obj, dataPaths) {
    //		alert(picBasePath);
    for (var i = 0; i < dataPaths.length; i++) {
        $(obj).append(
            '<img src="' + picBasePath + dataPaths[i]
            + '" alt="" class="img-thumbnail">');
    }

}
function imgLoadpath(obj, dataPaths, objs, dataPaths_zgh) {
    //		alert(picBasePath);
    for (var i = 0; i < dataPaths.length; i++) {
        $(obj).append(
            '<img src="' + picBasePath + dataPaths[i]
            + '" alt="" class="img-thumbnail">');
    }
    for (var j = 0; j < dataPaths_zgh.length; j++) {
        $(objs).append(
            '<img src="' + picBasePath + dataPaths_zgh[j]
            + '" alt="" class="img-thumbnail">');
    }
}

/*----------------------------------------------bootstraptable基础表格初始化----------------------------------------------------------------*/
var $selectedRowIndex = undefined;//选中的row
var $selectedRowData = undefined;//选中行的数据
/*
 * 自定义的bootstraptable的onClickRow方法
 */
var $onClickRow = function (item, $element) {
    //未选中-->选中       选中-->未选中
//	console.log($element);
    if ($element.hasClass('selected')) {
        $element.removeClass('selected');
        //去掉选中的记录
        $selectedRowIndex = undefined;
        $selectedRowData = undefined;
    } else {
        $element.parent().find('tr.selected').removeClass('selected');//因为单选,所以所有tr先都不选中
        $element.addClass('selected');//当前tr选中
        //记录选中的记录
        $selectedRowIndex = $element[0].sectionRowIndex;//点击row的index,0开始
        $selectedRowData = this.data[$selectedRowIndex];
    }
};
var $onClickParentRow = function (item, $element) {
    //未选中-->选中       选中-->未选中
    curRow = item;
//	console.log($element);
    if ($element.hasClass('selected')) {
        $element.removeClass('selected');
        //去掉选中的记录
        $selectedRowIndex = undefined;
        $selectedRowData = undefined;
    } else {
        $element.parent().find('tr.selected').removeClass('selected');//因为单选,所以所有tr先都不选中
        $element.addClass('selected');//当前tr选中
        //记录选中的记录
        $selectedRowIndex = $element[0].sectionRowIndex;//点击row的index,0开始
        $selectedRowData = this.data[$selectedRowIndex];
    }
};

/*
 * bootstraptable默认的配置
 */
var $bootstrapTableOption = {
    columns: [],//列
    height: clientHeight - 200,
    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    method: "get", //使用get请求到服务器获取数据
    url: '',//请求地址
    sidePagination: "server", //表示服务端请求
    striped: true, //表格显示条纹
    singleSelect: true,//单选
    clickToSelect: true,
    pagination: true, //启动分页
    pageSize: 10, //每页显示的记录数
    pageNumber: 1, //当前第几页
    pageList: [2, 5, 10, 15, 20, 25], //记录数可选列表
    ajaxOptions: {
        headers: {
            "Authorization": "Bearer " + getLocalStorage('token'),
            "Accept": "application/json;charset=UTF-8"
        }
    },
    // sortable : true, //是否启用排序
    // sortOrder : "asc", //排序方式
    // search : true, //是否启用查询
    // searchAlign:'left',//指定 查询框 水平方向的位置。'left' or 'right'
    // showColumns : true, //显示下拉框勾选要显示的列
    // showRefresh : true, //显示刷新按钮
    // showExport: true,                     //是否显示导出
    // exportDataType: "basic",              //basic', 'all', 'selected'.
    // cardView: true,//设置为True时显示名片（card）布局
    // detailView: true,//是否允许详细页面
    detailFormatter: function (index, row) {//格式化详细页面
        //				       return 	'<h3>任务描述(触发条件)</h3>'+
        //				        			'<div style="text-align:left">'+desOfQuartz(row.cronExpression)+'</div>';
    },
    icons: {//自定义图标
        detailOpen: 'glyphicon-plus icon-plus',
        detailClose: 'glyphicon-minus icon-minus',
        refresh: 'zmdi zmdi-refresh zmdi-hc-fw',
        columns: 'zmdi zmdi-view-list zmdi-hc-fw'
    },
    paginationDetailHAlign: 'left',//指定 分页详细信息 在水平方向的位置。'left' or 'right'
    //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
    //设置为limit可以获取limit, offset, search, sort, order
    striped: true,//各行变色
    queryParamsType: "undefined",
    //cardView:true,//设置为True时显示名片（card）布局
    queryParams: function queryParams(params) { //设置查询参数
        var param = {
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            //orderNum : 12,
            sortOrder: params.sortOrder,
            sortName: params.sortName,
            sqlParam: v
        };
        return param;
    },
    onClickCell: function (field, value, row, $element) {
        return false;
    },
    onDblClickCell: function (field, value, row, $element) {
        return false;
    },
    onClickRow: function (item, $element) {
        return false;
    },
    onDblClickRow: function (item, $element) {
        return false;
    },
    onLoadSuccess: function (data) { //加载成功时执行
        //console.log(this.data);
        //重置自定义的选中状态,只有单选且不需要checkbox等时有效
        $selectedRowIndex = undefined;//选中的row
        $selectedRowData = undefined;//选中行的数据
        //解决左边栏点开关闭表格错位问题
        //重复的表头去掉
        //body的margin-top去掉;

        //$('div.bootstrap-table div.fixed-table-header').remove();
        //$('div.bootstrap-table table').attr('style','margin-top:100px;');
//		alert(fff);
    },


    onExpandRow: function (index, row, $Subdetail) {
        getChildTalbe(index, row, $Subdetail);
    }, onEditableSave: function (field, row, oldValue, $el) {
        $.ajax({
            type: "post",
            url: "",
            data: row,
            dataType: 'JSON',
            success: function (data, status) {
                if (status == "success") {
                    alert('提交数据成功');
                }
            },
            error: function () {
                alert('编辑失败');
            },
            complete: function () {

            }
        });
    },
//	onPostHeader: function () {
//		$('div.bootstrap-table div.fixed-table-header').remove();
//    },
//	onPostBody: function () {
//		$('div.bootstrap-table table').attr('style','');
//    },
    onLoadError: function (status) { //加载失败时执行
        if (status == "401") {
            showtoastr("inverse", "登录超时，2s后自动跳转到登录");
            setTimeout("location.href='login.html'", 2000);
        } else if (status == "403") {
            showtoastr("inverse", "无权限");
        } else {
            showtoastr("warning", '数据加载失败');
        }

    },
    onPageChange: function (number, size) {//主要是为了实现分页
        currentPage = number;
        currentPageSize = size;
    },
    formatLoadingMessage: function () {
        return "请稍等，正在加载中...";
    }
};
/**
 * bootstrapTable 子父表
 */
var $bootstrapTableChild = {
    columns: [],//列
    height: clientHeight - 200,
    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    method: "get", //使用get请求到服务器获取数据
    url: '',//请求地址
    sidePagination: "server", //表示服务端请求
    striped: true, //表格显示条纹
    singleSelect: true,//单选
    clickToSelect: true,
    pagination: true, //启动分页
    pageSize: 10, //每页显示的记录数
    pageNumber: 1, //当前第几页
    pageList: [2, 5, 10, 15, 20, 25], //记录数可选列表
    ajaxOptions: {
        headers: {
            "Authorization": "Bearer " + getLocalStorage('token'),
            "Accept": "application/json;charset=UTF-8"
        }
    },
    // sortable : true, //是否启用排序
    // sortOrder : "asc", //排序方式
    // search : true, //是否启用查询
    // searchAlign:'left',//指定 查询框 水平方向的位置。'left' or 'right'
    // showColumns : true, //显示下拉框勾选要显示的列
    // showRefresh : true, //显示刷新按钮
    // showExport: true,                     //是否显示导出
    // exportDataType: "basic",              //basic', 'all', 'selected'.
    // cardView: true,//设置为True时显示名片（card）布局
    // detailView: true,//是否允许详细页面
    detailFormatter: function (index, row) {//格式化详细页面
        //				       return 	'<h3>任务描述(触发条件)</h3>'+
        //				        			'<div style="text-align:left">'+desOfQuartz(row.cronExpression)+'</div>';
    },
    icons: {//自定义图标
        detailOpen: 'glyphicon-plus icon-plus',
        detailClose: 'glyphicon-minus icon-minus',
        refresh: 'zmdi zmdi-refresh zmdi-hc-fw',
        columns: 'zmdi zmdi-view-list zmdi-hc-fw'
    },
    paginationDetailHAlign: 'left',//指定 分页详细信息 在水平方向的位置。'left' or 'right'
    //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
    //设置为limit可以获取limit, offset, search, sort, order
    striped: true,//各行变色
    queryParamsType: "undefined",
    //cardView:true,//设置为True时显示名片（card）布局
    queryParams: function queryParams(params) { //设置查询参数
        var param = {
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
            //orderNum : 12,
            sortOrder: params.sortOrder,
            sortName: params.sortName,
            sqlParam: v
        };
        return param;
    },
    onClickCell: function (field, value, row, $element) {
        return false;
    },
    onDblClickCell: function (field, value, row, $element) {
        return false;
    },
    onClickRow: function (item, $element) {
        return false;
    },
    onDblClickRow: function (item, $element) {
        return false;
    },
    onLoadSuccess: function (data) { //加载成功时执行

        //console.log(this.data);
        //重置自定义的选中状态,只有单选且不需要checkbox等时有效
        $selectedRowIndex = undefined;//选中的row
        $selectedRowData = undefined;//选中行的数据
        //解决左边栏点开关闭表格错位问题
        //重复的表头去掉
        //body的margin-top去掉;

        //$('div.bootstrap-table div.fixed-table-header').remove();
        //$('div.bootstrap-table table').attr('style','margin-top:100px;');
//		alert(fff);
    },


    onExpandRow: function (index, row, $Subdetail) {
        getChildTalbe(index, row, $Subdetail);
    }, onEditableSave: function (field, row, oldValue, $el) {
        $.ajax({
            type: "post",
            url: "",
            data: row,
            dataType: 'JSON',
            success: function (data, status) {
                if (status == "success") {
                    alert('提交数据成功');
                }
            },
            error: function () {
                alert('编辑失败');
            },
            complete: function () {

            }
        });
    },
//	onPostHeader: function () {
//		$('div.bootstrap-table div.fixed-table-header').remove();
//    },
//	onPostBody: function () {
//		$('div.bootstrap-table table').attr('style','');
//    },
    onLoadError: function (status) { //加载失败时执行
        if (status == "401") {
            showtoastr("inverse", "登录超时，2s后自动跳转到登录");
            setTimeout("location.href='login.html'", 2000);
        } else if (status == "403") {
            showtoastr("inverse", "无权限");
        } else {
            showtoastr("warning", '数据加载失败');
        }
    },
    onPageChange: function (number, size) {//主要是为了实现分页
        currentPage = number;
        currentPageSize = size;
    },
    formatLoadingMessage: function () {
        return "请稍等，正在加载中...";
    }
};

var MyDiyBootstrapTable = (function (window) {
    var MyDiyBootstrapTable = function ($tableObj) {
        return new MyDiyBootstrapTable.fn.init($tableObj);
    }

    MyDiyBootstrapTable.fn = MyDiyBootstrapTable.prototype = {
        constructor: MyDiyBootstrapTable,
        init: function ($tableObj) {
            thobj = this,
                this.tableObj = $tableObj,
                this.currentPage = 1,
                this.currentPageSize = 10,
                this.sqlV = '',
                this.queryPam = {
                    pageNumber: this.currentPage,
                    pageSize: this.currentPageSize,
                    sortOrder: null,
                    sortName: null,
                    sqlParam: this.sqlV
                },
                this.ajaxQuery = null,
                this.canRefresh = true,
                this.bootstrapTableOption = {
                    columns: [],//列
                    height: clientHeight - 230,
                    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    method: "post", //使用get请求到服务器获取数据
                    url: '',//请求地址
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',//使用post请求时需要申明contentType为application/x-www-form-urlencoded; charset=UTF-8,否则后台无法接收参数
                    sidePagination: "server", //表示服务端请求
                    striped: true, //表格显示条纹
                    singleSelect: true,//单选
                    clickToSelect: true,
                    pagination: true, //启动分页
                    pageSize: thobj.currentPageSize, //每页显示的记录数
                    pageNumber: thobj.currentPage, //当前第几页
                    pageList: [2, 5, 10, 15, 20, 25], //记录数可选列表
                    ajaxOptions: {
                        headers: {
                            "Authorization": "Bearer " + getLocalStorage('token'),
                            "Accept": "application/json;charset=UTF-8"
                        }
                    },
                    // sortable : true, //是否启用排序
                    // sortOrder : "asc", //排序方式
                    // search : true, //是否启用查询
                    // searchAlign:'left',//指定 查询框 水平方向的位置。'left' or 'right'
                    // showColumns : true, //显示下拉框勾选要显示的列
                    // showRefresh : true, //显示刷新按钮
                    // showExport: true,                     //是否显示导出
                    // exportDataType: "basic",              //basic', 'all', 'selected'.
                    // cardView: true,//设置为True时显示名片（card）布局
                    // detailView: true,//是否允许详细页面
                    detailFormatter: function (index, row) {//格式化详细页面
                        //				       return 	'<h3>任务描述(触发条件)</h3>'+
                        //				        			'<div style="text-align:left">'+desOfQuartz(row.cronExpression)+'</div>';
                    },
                    icons: {//自定义图标
                        detailOpen: 'glyphicon-plus icon-plus',
                        detailClose: 'glyphicon-minus icon-minus',
                        refresh: 'zmdi zmdi-refresh zmdi-hc-fw',
                        columns: 'zmdi zmdi-view-list zmdi-hc-fw'
                    },
                    paginationDetailHAlign: 'left',//指定 分页详细信息 在水平方向的位置。'left' or 'right'
                    //设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder
                    //设置为limit可以获取limit, offset, search, sort, order
                    striped: true,//各行变色
                    queryParamsType: "undefined",
                    //cardView:true,//设置为True时显示名片（card）布局
                    queryParams: function (params) {
                        var param = jQuery.extend(true, {}, thobj.queryPam);

                        param.pageNumber = params.pageNumber;
                        param.pageSize = params.pageSize;
                        param.sortOrder = params.sortOrder;
                        param.sortName = params.sortName;
                        param.sqlParam = thobj.sqlV;

                        if (thobj.ajaxQuery) {
                            for (key in thobj.ajaxQuery) {
                                param[key] = thobj.ajaxQuery[key];
                            }
                        }
                        return param;
                    },//设置查询参数
                    responseHandler: function (res) {
                        if (res.hasOwnProperty('data')) {
                            return res.data;
                        }
                        return res;
                    },
                    onClickCell: function (field, value, row, $element) {
                        return false;
                    },
                    onDblClickCell: function (field, value, row, $element) {
                        return false;
                    },
                    onClickRow: function (item, $element) {
                        return false;
                    },
                    onDblClickRow: function (item, $element) {
                        return false;
                    },
                    onLoadSuccess: function (data) { //加载成功时执行
                        //重置自定义的选中状态,只有单选且不需要checkbox等时有效
                        $selectedRowIndex = undefined;//选中的row
                        $selectedRowData = undefined;//选中行的数据
                        //解决左边栏点开关闭表格错位问题
                        //重复的表头去掉
                        //body的margin-top去掉;

                        //$('div.bootstrap-table div.fixed-table-header').remove();
                        //$('div.bootstrap-table table').attr('style','margin-top:100px;');
                    },
                    onExpandRow: function (index, row, $Subdetail) {

                    },
                    onEditableSave: function (field, row, oldValue, $el) {

                    },
                    onLoadError: function (status) { //加载失败时执行
                        if (status == "401") {
                            showtoastr("inverse", "登录超时，2s后自动跳转到登录");
                            setTimeout("location.href='login.html'", 2000);
                        } else if (status == "403") {
                            showtoastr("inverse", "无权限");
                        } else {
                            showtoastr("warning", '数据加载失败');
                        }
                    },
                    onPageChange: function (number, size) {//主要是为了实现分页
                        thobj.currentPage = number;
                        thobj.currentPageSize = size;
                    },
                    formatLoadingMessage: function () {
                        return "请稍等，正在加载中...";
                    }
                }

        },
        initBootstrapTable: function () {//加载
            this.tableObj.bootstrapTable('destroy');
            this.tableObj.bootstrapTable(this.bootstrapTableOption);
        },
        formatterIndexNo: function (value, row, index) {//格式化序号
            return index + 1 + (thobj.currentPage - 1) * thobj.currentPageSize;
        },
        refreshBootstrapTable: function () {//刷新
            if (this.canRefresh) {
                this.canRefresh = false;
                this.currentPage = this.bootstrapTableOption.pageNumber = 1;
                this.tableObj.bootstrapTable('refresh');
                setRefreshTimeout(this);
            }
        },
        refreshBootstrapTableOptions: function () {//刷新配置
            if (this.canRefresh) {
                this.canRefresh = false;
                this.currentPage = this.bootstrapTableOption.pageNumber = 1;
                this.tableObj.bootstrapTable('refreshOptions', this.bootstrapTableOption);
                setRefreshTimeout(this);
            }
        }
    }
    MyDiyBootstrapTable.fn.init.prototype = MyDiyBootstrapTable.fn;
    return MyDiyBootstrapTable;
})();

function setRefreshTimeout(th) {
    setTimeout(function () {
        th.canRefresh = true;
    }, 500);
}


/*
 * 初始化bootstrap table
 * $obj:bootstraptable对象    $bootstrapTableOptio:默认配置      $fn:额外的方法
 */
var $bootstrapTableObj;
function initBootstrapTable($obj, $bootstrapTableOption, $fn) {
    /*v="";*/
    $bootstrapTableObj = $obj;
    //先销毁表格
    $obj.bootstrapTable('destroy');
    //初始化表格,动态从服务器加载数据
    $obj.bootstrapTable($bootstrapTableOption);


    //$obj.bootstrapTable('hideColumn', 'aaa');//隐藏列
}

/*
 * bootstrap table刷新
 */
var canRefresh = true;
function refreshBootstrapTable($obj, $pageNumber, $pageSize) {
//	$obj.bootstrapTable('refresh');
    if (canRefresh) {
        canRefresh = false;
        $obj.bootstrapTable('refreshOptions', {pageNumber: $pageNumber, pageSize: $pageSize});//解决分页刷新时不会跳到第一页的问题
        setTimeout(function () {
            canRefresh = true;
        }, 500);
    }
}

/*----------------------------------------------bootstrapPaginator控件----------------------------------------------------------------*/
function bootstrapPaginatorClean($bootstrapPaginator) {
    $bootstrapPaginator.bootstrapPaginator('setOptions', {
        currentPage: 1,
        totalPages: 1
    });
}

/*----------------------------------------------jquery 验证  jQuery Validate----------------------------------------------------------------*/
//封装
var MyDiyJqueryValidate = (function (window) {
    var MyDiyJqueryValidate = function ($form_obj) {
        return new MyDiyJqueryValidate.fn.init($form_obj);
    }

    MyDiyJqueryValidate.fn = MyDiyJqueryValidate.prototype = {
        constructor: MyDiyJqueryValidate,
        init: function ($form_obj) {
            thObj = this,
                this.form_obj = $form_obj,
                this.jqueryValidateOption = {
                    focusInvalid: false, //当为false时，验证无效时，没有焦点响应
                    rules: {},
                    messages: {},
                    errorPlacement: function (error, element) {
                        error.appendTo(element.parent());
                    }
                }
        },
        jqueryValidate: function () {//加载验证配置
            if (this.form_obj) {
                this.form_obj.validate(this.jqueryValidateOption);
            }
        },
        jqueryValidForm: function () {//验证
            if (!this.form_obj) {//验证对象为false或undefined或null,不进行验证
                return true;
            }
            return this.form_obj.valid();
        }
    }
    MyDiyJqueryValidate.fn.init.prototype = MyDiyJqueryValidate.fn;
    return MyDiyJqueryValidate;
})();


function jqueryValidForm($obj) {
    return $obj.valid();
}

/*
 * 默认的的配置
 */
var $jqueryValidateOption = {
    focusInvalid: false, //当为false时，验证无效时，没有焦点响应
    rules: {},
    messages: {}
};
/*
 * 验证
 * $obj:校验对象      $jqueryValidateOption校验的规则条件
 */
function jqueryValidate($obj, $jqueryValidateOption) {
    $obj.validate($jqueryValidateOption);
}
//自定义验证规则
//select标签必选(注意:不选时value为'')
jQuery.validator.addMethod("isSelected", function (value, element, param) {
    return (!this.optional(element) && value != '' && value != '请选择');
}, "请选择");
jQuery.validator.addMethod("isChecked", function (value, element, param) {
    return (!this.optional(element) && value != '');
}, "请勾选");


//经纬度
jQuery.validator.addMethod("isLngLat", function (value, element, param) {
    var reg = /^\-?[0-9]+\.?[0-9]*$/;
    return this.optional(element) || (reg.test(value));
}, "请输入正确的经纬度(数字)");
//联系方式(手机,电话)
jQuery.validator.addMethod("isTruePhone", function (value, element, param) {
    var reg = /^([0-9]{3,4}-)?[0-9]{7,8}$|^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
    return this.optional(element) || (reg.test(value));
}, "请输入正确的联系方式");
//身份证号码
jQuery.validator.addMethod("validateSFZID", function (value, element, param) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return this.optional(element) || (reg.test(value));
}, "请输入正确的身份证");
jQuery.validator.addMethod("checkChinese", function (value, element) {
    var reg = /^[\u4e00-\u9fa5]+$/;
    return this.optional(element) || (reg.test(value));
}, "请输入有效的中文姓名");
jQuery.validator.addMethod("checkIdCard", function (value, element) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return this.optional(element) || (reg.test(value));
}, "请输入有效的二代身份证号码");
jQuery.validator.addMethod("checkMobile", function (value, element) {
    var reg = /^1[34578]\d{9}$/;
    return this.optional(element) || (reg.test(value));
}, "请输入有效的手机号码");
jQuery.validator.addMethod("isTrueEmail", function (value, element) {
    var reg = /^([-_A-Za-z0-9\.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    return this.optional(element) || (reg.test(value));
}, "请输入有效的邮箱");
jQuery.validator.addMethod("isPositiveInteger", function (value, element) {
    var reg = /^[0-9]*[1-9][0-9]*$/;
    return this.optional(element) || (reg.test(value));
}, "请输入正整数");
jQuery.validator.addMethod("isTrueIP", function (value, element) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return this.optional(element) || (reg.test(value));
}, "请输入正确的IP");
jQuery.validator.addMethod("isTruePort", function (value, element) {
    var reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
    return this.optional(element) || (reg.test(value));
}, "请输入正确的端口号");


// //社保卡号
// jQuery.validator.addMethod("validateSBKID", function(value,element,param) {
//     // var reg = ;
//     // return this.optional(element) || (reg.test(value));
// }, "请输入正确的社保卡号");

/*----------------------------------------------前台与后台交互提示信息----------------------------------------------------------------*/
var noSelectedRowInfo = "请先选择一条数据!";
var submitSuccess = "数据提交成功!";
var submitFail = "数据提交失败!";
var delSuccess = "数据删除成功!";
var delFail = "数据删除失败!";
var isNeedDel = "确定要删除吗?";
var fileUploadSuccess = "上传成功";


//字符串去空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//获取url请求参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//根据生日获得年龄
function jsGetAge(strBirthday) {
    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
        returnAge = 0;//同年 则为0岁
    }
    else {
        var ageDiff = nowYear - birthYear; //年之差
        if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            }
            else {
                var monthDiff = nowMonth - birthMonth;//月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1;
                }
                else {
                    returnAge = ageDiff;
                }
            }
        }
        else {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge;//返回周岁年龄
}

var nations = ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
    "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
    "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族",
    "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"];

//function myFunction(){
//	$bootstrapTableObj.bootstrapTable('refresh');
//}
//document.getElementById("myMinimalize").addEventListener("click", myFunction,true);


//生成uuid
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


function initForm(options) {

    if (options.data) {
        var updateData = options.data;
    } else {
        var updateData = JSON.parse(getLocalStorage("updateData"));
    }

    var so = $('#' + options.id).serializeObject();

    for (var i in so) {
        $.each(updateData, function (ui, uval) {
            if (ui == i) {
                if (options.filter && options.filter(ui, uval)) {
                    return true;
                }
                var type = $('[name="' + ui + '"]')[0].type;

                switch (type) {
                    case 'text':
                        $('[name="' + ui + '"]').val(uval);
                        break;
                    case 'hidden':
                        $('[name="' + ui + '"]').val(uval);
                        break;
                    case 'radio':
                        $('[name="' + ui + '"][value="' + uval + '"]').attr('checked', true);
                        break;
                    case 'checkbox':
                        var arr = uval.split(',');
                        for (var j in arr) {
                            $('[name="' + ui + '"][value="' + j + '"]').attr('checked', true);
                        }
                        break;
                    case 'select-one':
                        $('[name="' + ui + '"]').selectpicker('val', uval);
                        break;
                    default:
                        break;
                }
            }
        });
    }
    if (options.finalFn) {
        options.finalFn();
    }

    return $('#' + options.id).serializeObject();
}
/*----------------------------------------------jedate初始化时间控件----------------------------------------------------------------*/
/*初始化jeDate时间控件*/
var inputTimeSelSetting = {
    skinCell: "jedateblue", //日期风格样式，默认蓝色      jedatered,jedategreen
    //format : "YYYY-MM-DD hh:mm", //日期格式
    format: "YYYY-MM-DD", //日期格式
    //minDate:"1900-01-01 00:00:00",        //最小日期
    //maxDate:"2099-12-31 23:59:59",        //最大日期
    insTrigger: true, //是否为内部触发事件，默认为内部触发事件
    startMin: "", //清除日期后返回到预设的最小日期
    startMax: "", //清除日期后返回到预设的最大日期
    isinitVal: false, //是否初始化时间，默认不初始化时间
    initAddVal: [0], //初始化时间，加减 天 时 分
    isTime: true, //是否开启时间选择
    ishmsLimit: false, //时分秒限制
    ishmsVal: true, //是否限制时分秒输入框输入，默认可以直接输入时间
    isClear: true, //是否显示清空
    isToday: true, //是否显示今天或本月
    clearRestore: true, //清空输入框，返回预设日期，输入框非空的情况下有效
    //festival:true,                       //是否显示节日
    fixed: true, //是否静止定位，为true时定位在输入框，为false时居中定位
    zIndex: 2099, //弹出层的层级高度
    //marks:['2016-11-03','2016-11-05'],//给日期做标注
    choosefun: function (elem, val) {
    }, //选中日期后的回调, elem当前输入框ID, val当前选择的值
    clearfun: function (elem, val) {
    }, //清除日期后的回调, elem当前输入框ID, val当前选择的值
    okfun: function (elem, val) {
    }, //点击确定后的回调, elem当前输入框ID, val当前选择的值
    success: function (elem) {
    }, //层弹出后的成功回调方法, elem当前输入框ID
};

/**
 *
 * @param options
 * id:id
 * format:格式 例如:YYYY-MM-DD
 * startTime:初始日期（选填）
 */
function initjdDate(options) {
    var action = function () {
        $('#' + options.id).focus();
        $('#' + options.id).blur();
    }
    options.startTime = options.startTime ? options.startTime : '1898-01-01';
    $("#" + options.id).jeDate({
        format: options.format,
        isTime: false,
        minDate: options.startTime,
        choosefun: function (val) {
            action();
        },
        clearfun: function () {
            action();
        },
        okfun: function () {
            action();
        }
    })
}

/**
 *
 * @param options
 * id:id
 * data:items
 * required:必填
 * errText:校验文本
 */
function initBootstrapSelect(options) {
    options.errText = options.errText ? options.errText : '请选择';
    // $('.selectpicker').selectpicker({});  //初始化
    for (var j = 0; j < options.length; j++) {
        $('#' + options[j].id).selectpicker({});  //初始化
        if (options[j].data instanceof Array) {
            for (var i = 0; i < options[j].data.length; i++) {
                if (options[j].data[i].value) {
                    $('#' + options[j].id).append("<option value='" + options[j].data[i].value + "'>" + options[j].data[i].text + "</option>");
                } else {
                    $('#' + options[j].id).append("<option value='" + i + "'>" + options[j].data[i] + "</option>");
                }
            }
        } else {
            for (var i in options[j].data) {
                $('#' + options[j].id).append("<option value='" + i + "'>" + options[j].data[i] + "</option>");
            }
        }
        $('#' + options[j].id).selectpicker('refresh');
        if (options[j].required) {
            $('#' + options[j].id).on('changed.bs.select', {
                cid: options[j].id,
                errText: options[j].errText
            }, function (e) {
                var cid = e.data.cid;
                var errText = e.data.errText;
                if ((!e.target.value) || (e.target.value == '')) {
                    $('#' + cid + '-error').remove();
                    $('#' + cid).parent().append('<label id=' + cid + '-error class="error" for="' + cid + '">' + errText + '</label>');
                } else {
                    $('#' + cid + '-error').remove();
                }
            });
        }
    }
    var validate = function () {
        var f = true;
        for (var j = 0; j < options.length; j++) {
            if (options[j].required) {
                if ($('#' + options[j].id).selectpicker('val') == '') {
                    $('#' + options[j].id + '-error').remove();
                    $('#' + options[j].id).parent().append('<label id=' + options[j].id + '-error class="error_" for="' + options[j].id + '">' + options[j].errText + '</label>');
                    f = false;
                } else {
                    $('#' + options[j].id + '-error').remove();
                }
            }
        }
        return f;
    }
    return validate;
}


$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    var $radio = $('input[type=radio],input[type=checkbox]', this);
    $.each($radio, function () {
        if (!o.hasOwnProperty(this.name)) {
            o[this.name] = '';
        }
    });
    return o;
};

function formChanges(ser, sern) {
    return !(JSON.stringify(ser) === JSON.stringify(sern));
}

function toTabNav(id, i) {
    var j = '#' + id + ' a:eq(' + i + ')';
    $(j).tab('show');
}

//文件上传获取正确的本地路径
function getImgURL(node) {
    var imgURL = "";
    try {
        var file = null;
        if (node.files && node.files[0]) {
            file = node.files[0];
        } else if (node.files && node.files.item(0)) {
            file = node.files.item(0);
        }
        //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try {
            //Firefox7.0
            imgURL = file.getAsDataURL();
            //alert("//Firefox7.0"+imgRUL);
        } catch (e) {
            //Firefox8.0以上
            imgURL = window.URL.createObjectURL(file);
            //alert("//Firefox8.0以上"+imgRUL);
        }
    } catch (e) {      //这里不知道怎么处理了，如果是遨游的话会报这个异常
        //支持html5的浏览器,比如高版本的firefox、chrome、ie10
        if (node.files && node.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(node.files[0]);
        }
    }
    return imgURL;
}
function getWangEditorImgURL(node) {
    var imgURL = "";
    try {
        var file = null;
        file = node[0];
        //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
        try {
            //Firefox7.0
            imgURL = file.getAsDataURL();
            //alert("//Firefox7.0"+imgRUL);
        } catch (e) {
            //Firefox8.0以上
            imgURL = window.URL.createObjectURL(file);
            //alert("//Firefox8.0以上"+imgRUL);
        }
    } catch (e) {      //这里不知道怎么处理了，如果是遨游的话会报这个异常
        //支持html5的浏览器,比如高版本的firefox、chrome、ie10
        if (node.files && node.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgURL = e.target.result;
            };
            reader.readAsDataURL(node.files[0]);
        }
    }
    return imgURL;
}
var uploadarray;
var jsonstr = [];
//附件上传
function fileUpload(File) {
    $(File).fileinput({
        uploadUrl: cors + "/editorFile/fileUpload/fileUpload",//上传的地址
        uploadAsync: true,
        language: "zh",//设置语言
        showCaption: true,//是否显示标题
        showUpload: true, //是否显示上传按钮
        browseClass: "btn btn-primary", //按钮样式
        allowedFileExtensions: ['jpg', 'gif', 'jpeg', 'png', 'bmp', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf', "mkv", "mp4", "avi", "rm", "rmvb", "wav", "aif", "mid", "au", "mp3", "ogg"], //接收的文件后缀
      allowedPreviewTypes: ['image', 'html', 'text', 'video', 'audio', 'flash', 'object'],///配置哪些文件类型被允许预览显示
        maxFileCount: 6,//最大上传文件数限制
      minImageWidth: 50,
/*minImageHeight: 50,
maxImageWidth: 1000,
maxImageHeight: 1000,*/
        previewFileIcon: '<i class="glyphicon glyphicon-picture"></i>',
        msgFilesTooMany: '一次最多上传6个文件!',
        previewFileIconSettings: {
            'docx': '<i class="glyphicon glyphicon-file"></i>',
            'xlsx': '<i class="glyphicon glyphicon-file"></i>',
            'pptx': '<i class="glyphicon glyphicon-file"></i>',
            'jpg': '<i class="glyphicon glyphicon-picture"></i>',
            'pdf': '<i class="glyphicon glyphicon-file"></i>',
            'zip': '<i class="glyphicon glyphicon-file"></i>',
            'png': '<i class="glyphicon glyphicon-picture"></i>'
        },
        uploadExtraData: function () {
            var extraValue = null;
            var radios = document.getElementsByName('excelType');
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    extraValue = radios[i].value;
                }
            }
            return {"excelType": extraValue};
        }
    });
    $(File).on('filesuccessremove', function (event, data) {
        for (var i in jsonstr) {
            if (jsonstr[i].id == data) {
                jsonstr.splice(i, 1);
            }

        }
    });
    $(File).on("fileuploaded", function (event, data, previewId, index) {
        $("#excelImport").modal("hide");
        //后台处理后返回的经纬度坐标json数组，
        uploadarray = data.response;
        uploadarray.id = previewId;
        uploadarray.size = data.files[index].size;
        jsonstr.push(uploadarray);
    });

}


/*------------------------------------------zTree公共方法--------------------------------------------------------------*/
//input下拉树
var MyDiyZTreeInputSelect = (function (window) {

    var MyDiyZTreeInputSelect = function ($treeObjName, $showInputObj, $hideValueObj, $zNodes, $Url, $param, $checkedData) {
        return new MyDiyZTreeInputSelect.fn.init($treeObjName, $showInputObj, $hideValueObj, $zNodes, $Url, $param, $checkedData);
    }

    MyDiyZTreeInputSelect.fn = MyDiyZTreeInputSelect.prototype = {
        constructor: MyDiyZTreeInputSelect,
        init: function ($treeObjName, $showInputObj, $hideValueObj, $zNodes, $Url, $param, $checkedData) {
            this.treeObjName = $treeObjName;//树对象的id
            this.showInputObj = $showInputObj;//显示的input对象
            if ($showInputObj) {
                $showInputObj.bind('click', function () {
                    var $Obj = $showInputObj;
                    var $Offset = $Obj.offset();
                    var $ObjId = $Obj.attr('id');
                    var $menuContent = $Obj.parent().find('.menuContent');
                    var $menuContentId = $menuContent.attr('id');
                    $menuContent.css(
                        {
                            /*left:($Offset.left-150) + "px",*/
                            /*top:$Offset.top + $Obj.outerHeight() + "px"*/
                        }).slideDown("fast");

                    $("body").bind("mousedown", function (event) {
                        if (!(event.target.id == "menuBtn" ||
                            event.target.id == $ObjId ||
                            event.target.id == $menuContentId ||
                            $(event.target).parents(".menuContent").length > 0)) {
                            $menuContent.fadeOut("fast");
                        }
                    });
                });
            }
            this.hideValueObj = $hideValueObj;//隐藏的值域对象
            this.zNodes = $zNodes;//加载的数据
            this.Url = $Url;//服务器获取数据请求
            this.pam = $param;//请求的额外参数
            this.checkedData = $checkedData;//选中的数据
            this.setting_SelectInput = {//配置
                check: {
                    enable: true,
                    chkboxType: {"Y": "ps", "N": "s"}/*被勾选时关联父子节点,取消时不管林父只关联子*/
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeAsync: function (treeId, treeNode) {//异步加载前执行,返回false则不执行异步加载
                        return true;
                    },
                    beforeClick: function (treeId, treeNode) {
                        // var zTree = $.fn.zTree.getZTreeObj(treeObjName);
                        // zTree.checkNode(treeNode, !treeNode.checked, null, true);

                        return false;
                    },
                    onCheck: function (e, treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj($treeObjName),
                            nodes = zTree.getCheckedNodes(true),
                            v = "",
                            vId = "";
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            v += nodes[i].name + ",";
                            vId += nodes[i].id + ",";
                        }
                        if (vId.length > 0) {
                            v = v.substring(0, v.length - 1);
                            vId = vId.substring(0, vId.length - 1);
                        }
                        if ($showInputObj) {
                            $showInputObj.val(v);
                        }
                        if ($hideValueObj) {
                            $hideValueObj.val(vId);
                        }
                    },
                    onAsyncSuccess: function (event, treeId, treeNode, msg) {//异步加载成功
                    }
                }
            }
        },
        initZtree_SelectInput: function () {
            if (this.zNodes != null && this.zNodes != undefined) {//有加载的数据
                $.fn.zTree.init($("#" + this.treeObjName), this.setting_SelectInput, this.zNodes);
                if (this.checkedData != null && this.checkedData != undefined) {//有选中的项
                    treeChecked(this.treeObjName, this.checkedData)
                }
            } else if (this.Url != null && this.Url != undefined) {
                drawAjaxTree(this.treeObjName, this.setting_SelectInput, this.Url, this.pam, this.checkedData, this.setting_SelectInput.filter);
            }
        }
    }
    MyDiyZTreeInputSelect.fn.init.prototype = MyDiyZTreeInputSelect.fn;
    return MyDiyZTreeInputSelect;
})();

function drawAjaxTree(treeObjName, setting_SelectInput, url, pam, checkedData, filter) {
    getData(
        'post',
        url,
        pam,
        'json',
        function (data) {//success
            if (filter) {
                data = filter(data);
            }
            if (data.code == 0) {
                $.fn.zTree.init($("#" + treeObjName), setting_SelectInput, data.data);
                if (checkedData != null && checkedData != undefined) {//有选中的项
                    treeChecked(treeObjName, checkedData);
                }
            }
            return true;
        }, function (obj) {//error
            //showtoastr("inverse", '未知错误');
            return false;
        }
    );
}

function treeChecked(treeObjName, checkedData) {
    var zTree = $.fn.zTree.getZTreeObj(treeObjName);
    for (var a = 0; a < checkedData.length; a++) {
        var node = zTree.getNodeByParam("id", checkedData[a]);
        if (node) {
            node.checked = true;
            zTree.updateNode(node);
        }
    }
}


//文件大小转换
function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
//通过参数编码获取获取启用的参数值
function getParameterValueByCode(code) {
    var data;
    getData_async(
        'post',
        '/Param/Parameter/selectByMyId',
        {"myid": code},
        'json',
        function (value) {//success
            data = value.data.value;

        }, function (obj) {//error
            showtoastr("inverse", '区域加载异常');
        }
    );
    return data;
}

var imgExt = new Array(".png", ".jpg", ".jpeg", ".bmp", ".gif");//图片文件的后缀名
var docExt = new Array(".doc", ".docx", ".txt");//word文件的后缀名
var xlsExt = new Array(".xls", ".xlsx");//excel文件的后缀名
var videoExt = new Array(".mkv", ".mp4", ".avi", ".rm", ".rmvb");
var musicExt = new Array(".wav", ".aif", ".mid", ".au", ".mp3", ".ogg");
/*var cssExt = new Array(".css");//css文件的后缀名
 var jsExt = new Array(".js");//js文件的后缀名*/

//获取文件名后缀名
String.prototype.fextension = function () {
    var ext = null;
    var name = this.toLowerCase();
    var i = name.lastIndexOf(".");
    if (i > -1) {
        var ext = name.substring(i);
    }
    return ext;
}

//判断Array中是否包含某个值
Array.prototype.contain = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj)
            return true;
    }
    return false;
};

String.prototype.extMatch = function (extType) {
    if (extType.contain(this.fextension()))
        return true;
    else
        return false;
}
//判断图片类型
function getfileType(type) {
    if (type.extMatch(imgExt)) {
        return "img";
    } else if (type.extMatch(docExt)) {
        return "docOffice";
    } else if (type.extMatch(xlsExt)) {
        return "xlsOffice";
    } else if (type.extMatch(videoExt)) {
        return "video";
    } else if (type.extMatch(musicExt)) {
        return "music";
    } else {
        return "others";
    }
}
//文件系统图片特效
function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {
            //wait for animation to finish before removing classes
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}

//正则表达式检查手机号码
function chechTelephone(telephone){   
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(telephone))){
        return false;
    }else{
        return true;
    }    
}

//查询两日期区间内的日期
function getDatesBetweenChoose(startDate,endDate) {
    var start_time = startDate;
    var end_time = endDate;
    var bd = new Date(start_time),be = new Date(end_time);
    var bd_time = bd.getTime(), be_time = be.getTime(),time_diff = be_time - bd_time;
    var d_arr = [];
    for(var i=0; i<= time_diff; i+=86400000){
        var ds = new Date(bd_time+i);
        var month=ds.getMonth()+1;
        var day=ds.getDate();
        if (day>= 0 && day<= 9) {
            day = "0" + day;
        }
        month=month>10?month:'0'+month;
        d_arr.push(ds.getFullYear()+'-'+month+'-'+day)
    }
    return d_arr;
}

//破解网络图片防盗链
function myReferer(mycontent) {
    var imgs = mycontent.match(/<img[^>]+>/g);
    var body = document.querySelector("body");
    var iframe = document.createElement("iframe");
    iframe.style.position="fixed";
    iframe.style.width="100%";
    iframe.style.height="100%";
    iframe.style.border=0;
    iframe.style.zIndex=10;
    iframe.style.top=0;
    iframe.style.left=0;
    iframe.style.display="none";
    iframe.src = 'javascript:void(function(){document.open();document.write(\'' + imgs + '\');document.close();}())';
    body.appendChild(iframe);
}