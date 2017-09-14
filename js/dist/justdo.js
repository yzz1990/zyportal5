(function (e) {
    function YTX() {
        this.app_id = '';
        this.userinfo = {};
        //当前登录的账号
        this.subAccount = {};
        this._onMsgReceiveListener = null; // 消息监听
        this._onConnectStateChangeLisenter = null; //连接状态监听
        this._onCallMsgListener = null; //呼叫事件监听

        this.chatNickName = null; //聊天对象昵称
        this.currentChat = null; //当前聊天对象
        this.chat_window = null; //聊天窗对象
        this.chat_maps = {}; //聊天人和聊天内容div的对应关系
        this.targetCell = {};
        this.login_type = 1;
        this._transfer = 12;
        this.userStateInterval = null;
        this._extopts = [];
        this.login_type = 1; //1  手机号登陆  2 VIOP账号登陆

        this.flag = true;//是否从第三方服务器获取sig
        this.currentCallId = null;
        this.currentCallWith = null;
        this.fireMsgWindow = null;
        this.fireMsgContent = null;
        this._msgBack = 25;
        this.messageList = [];
        this.messageNum = 0;
        this.contacts = [];

    };
    YTX.prototype = {
        //属性区域
        isCalling: false,
        // typeingTarget: null,
        //方法区域
        init: function () {
            RL_YTX.setLogClose();
            var resp = RL_YTX.init(this.app_id);
            if (resp.code != 200) {
                showmessage('<a style="color: red">&nbsp;SDK初始化错误</a>');
                return;
            } else if (174001 == resp.code) {
                showmessage('您的浏览器不支持html5，请更换新的浏览器。推荐使用chrome浏览器');
                return;
            } else if (170002 == resp.code) {
                showmessage("错误码：170002,错误码描述" + resp.msg);
                return;
            }
            if ($.inArray(174004, resp.unsupport) > -1 || $.inArray(174009, resp.unsupport) > -1) {
                showmessage("拍照、录音、音视频呼叫都不支持");
            } else if ($.inArray(174007, resp.unsupport) > -1) {
                showmessage("不支持发送附件");
            } else if ($.inArray(174008, resp.unsupport) > -1) {
                showmessage("不支持音视频呼叫，音视频不可用");
            }
        },
        Do_login_byVoip: function (account, pwd) {
            this.login_type = 3;
            this.getSig(account, pwd);
        },
        Do_login: function (account) {
            this.login_type = 1;
            this.getSig(account);
        },
        getSig: function (account, pwd) {
            // var timestamp = this.getTimeStamp();
            // IM.EV_login(account, pwd, timestamp);
            var pass = pwd ? pwd : "";
            var timestamp = this.getTimeStamp();
            this.privateLogin(account.account, timestamp, function (obj) {
                IM.EV_login(account, pass, obj.signature, timestamp);
            }, function (obj) {
                showmessage('获取sig出错!');
            });
        },
        privateLogin: function (account, timestamp, callback, onError) {
            getData(
                'post',
                '/social/getSig',
                {
                    'account': account,
                    'timestamp': timestamp
                },
                'json',
                function (obj) {
                    if (callback) callback(obj);
                }, function (obj) {
                    if (callback) onError(obj);
                }
            )
        },
        /**
         * 登录接口对接RestAPI
         * @param user_account
         * @param pwd
         * @param sig
         * @param timestamp
         * @constructor
         */
        EV_login: function (account, pwd, sig, timestamp) {
            // var s = hex_md5('8a216da85d158d1b015d346f116a0bc9' + user_account + timestamp + 'a3af51df0950a899b0cd34f9119bac2f');
            // console.log(s);
            // console.log(user_account+'-'+sig+'-'+timestamp);
            // var loginBuilder = new RL_YTX.LoginBuilder();
            // loginBuilder.setType(this.login_type);
            // loginBuilder.setUserName(user_account);
            // loginBuilder.setPwd(pwd);
            // loginBuilder.setTimestamp(timestamp);
            var loginBuilder = new RL_YTX.LoginBuilder();
            loginBuilder.setType(this.login_type);
            loginBuilder.setUserName(account.account);
            if (1 == this.login_type) { //1是自定义账号，2是voip账号
                loginBuilder.setSig(sig);
            } else {
                loginBuilder.setPwd(pwd);
            }
            loginBuilder.setTimestamp(timestamp);
            RL_YTX.login(loginBuilder, function (obj) {

                //获取用户列表
                getContacts();
                //登录成功返回的信息
                //IM.autoGetUserState(arr);监听在线状态
                IM.autoGetUserState(IM.contacts);
                IM.setPersonalInfo(IM.subAccount.friendlyname, IM.subAccount.shuoshuo);
                // 监听消息，将消息存入消息池中待分拣
                IM._onMsgReceiveListener = RL_YTX.onMsgReceiveListener(
                    function callback(obj) {
                        if (obj.msgType != 12) {

                            var cell = {};
                            console.log(JSON.stringify(obj));
                            // donotify('', '收到 ' + obj.senderNickName + ' 的消息，请查看...', 'bottom', 'right');
                        }
                        /**
                         * {"version":9,"msgType":1,"sessionId":"9","msgContent":"a ","msgSender":"u_zbz20170725",
                         * "msgReceiver":"u_fxg6678","msgDateCreated":"1500975572948","senderNickName":"u_zbz20170725",
                         * "mcmEvent":0,"msgId":"1500975572948|9"}
                         */
                        //两种情况 1，聊天窗口没打开，需要提示来消息了，当打开后加载消息
                        //放在消息池中，等待打开
                        if (obj.msgType != 12) {
                            IM.storageMessage(obj);
                        }
                        ;
                        //2.聊天窗口已经是打开的，来消息就直接显示在当前窗口里
                        //先判断当前聊天的窗口是谁,如果
                        var who_is_voipAccount = $('.chat_group_window').attr('data-chat-with');
                        if (typeof (who_is_voipAccount) != undefined && obj.msgSender == who_is_voipAccount) {
                            IM.EV_onMsgReceiveListener(IM.targetCell, obj);
                            if (obj.msgType != 12) {
                                var version = obj.msgId.split('|')[1];
                                //提示已读
                                IM.EV_msgRead(version, function () {
                                });
                            }
                        } else {
                            if (obj.msgType != 12) {
                                IM.DO_deskNotice(obj);
                                IM.messageNum++;
                                $messagecount.html(IM.messageNum);
                            }
                        }
                    });
                // 服务器连接状态变更时的监听
                IM._onConnectStateChangeLisenter = RL_YTX.onConnectStateChangeLisenter(function (obj) {
                    // obj.code;//变更状态 1 断开连接 2 重练中 3 重练成功 4 被踢下线 5 断开连接，需重新登录
                    // 断线需要人工重连
                    if (IM.isCalling) {
                        $('[data-btn="cancelVideo"]').click();
                        $('[data-btn="cancelVoip"]').click();
                        $('[data-btn="shutdownVoip"]').click();
                        $('[data-btn="refuseVoip"]').click();
                    }
                    if (1 == obj.code) {

                    } else if (2 == obj.code) {
                        showmessage('网络状况不佳，正在试图重连服务器');
                        $("#pop_videoView").hide();
                    } else if (3 == obj.code) {
                        // showmessage('连接成功');
                    } else if (4 == obj.code) {
                        IM.DO_logout(false);
                        showChart_Status('你的账号在网页设备上登录。如果这不是你的操作，你的密码可能已泄漏，请重新登录后尽快修改密码');
                        // showmessage('你的账号于2017-07-27 15:22:02在网页设备上登录。如果这不是你的操作，你的密码可能已泄漏，请重新登录后尽快修改密码');
                    } else if (5 == obj.code) {
                        showmessage('网络状况不佳，正在试图重连服务器');
                        IM.getSig(IM.subAccount);
                    } else {
                        // console.log('onConnectStateChangeLisenter obj.code:' + obj.msg);
                    }
                });
                /*音视频呼叫监听
                 obj.callId;//唯一消息标识  必有
                 obj.caller; //主叫号码  必有
                 obj.called; //被叫无值  必有
                 obj.callType;//0 音频 1 视频 2落地电话
                 obj.state;//1 对方振铃 2 呼叫中 3 被叫接受 4 呼叫失败 5 结束通话 6 呼叫到达
                 obj.reason//拒绝或取消的原因
                 obj.code//当前浏览器是否支持音视频功能
                 */
                IM._onCallMsgListener = RL_YTX.onCallMsgListener(
                    function (obj) {
                        IM.EV_onCallMsgListener(obj);
                    });
                // IM.autoGetUserState();//设置自动获取在线状态

            }, function (obj) {
                //登录失败的执行function
                showmessage('<a style="color: red">&nbsp;' + obj.code + ':' + obj.msg + '</a>');
            })
        },
        /**
         * 分拣消息,添加到聊天窗口
         * @param obj
         * @constructor
         */
        EV_onMsgReceiveListener: function (targetcell, obj) {
            /**
             * obj.msgType; //消息类型1:文本消息 2:语音消息 3:视频消息 4:图片消息 5:位置消息 6:压缩文件 7:非压缩文件 11:群组发送@消息 12:状态消息
             */
            //处理表情
            if (!!obj.msgContent) {
                obj.msgContent = emoji.replace_unified(obj.msgContent);
            }
            ;
            //2:语音消息
            if (obj.msgType == 2) {
                //语音消息 暂不支持播放
                obj.msgContent = '您收到一条语音消息，请在其他设备接收。';
                obj.msgType = 1;
            }
            ;
            if (obj.msgType == 6) {
                RL_YTX.getFileSource(obj.msgFileUrl, function (e) {
                    msgDiv["msgFileUrl"] = e.url;
                    msgDiv["msgType"] = 7;
                    var kg = false;
                    if (obj.msgSender == IM.subAccount.account) {
                        msgDiv["chatWindow"] = IM.chat_maps[obj.msgReceiver];
                        var o = $('[data-im-contact="' + obj.msgReceiver + '"]');
                        kg = IM.chat_window != null && IM.chat_window.attr("data-chat-with") == obj.msgReceiver;
                    } else {
                        var o = $('[data-im-contact="' + obj.msgSender + '"]');
                        msgDiv["chatWindow"] = IM.chat_maps[obj.msgSender];
                        kg = IM.chat_window != null && IM.chat_window.attr("data-chat-with") == obj.msgSender;
                    }
                    var stat = {};
                    stat["state"] = 1;
                    IM.addMsgToChatWindow(targetcell, msgDiv);
                    var i = o.find(".noticeQ");
                    document.getElementById('im_ring').play();
                    if (kg) {
                        return;
                    }
                    if (i.length == 0) {
                        o.find('.discuss_name').after('<span class="noticeQ">' + 1 + '</span>');
                    } else {
                        o.find('.noticeQ').html(parseInt(o.find('.noticeQ').html()) + 1);
                    }
                    // IM.DO_deskNotice(obj.msgSender, obj.senderNickName, obj.msgContent, obj.msgType, firemsg, false, '', isatMsg);
                }, function () {
                    console.log('解压缩失败');
                });
                return;
            }
            ;

            //对方输入状态
            if (obj.msgType == IM._transfer) {
                if (obj.msgDomain == 1) {
                    IM.typingStatus(targetcell, 1);
                } else if (obj.msgDomain == 0) {
                    IM.typingStatus(targetcell, 0);
                } else if (obj.msgDomain == 2) {
                    IM.typingStatus(targetcell, 2);
                }
                return;
            }
            //消息撤回消息
            if (obj.msgType == IM._msgBack) {
                var operate = JSON.parse(obj.msgDomain);
                var version = operate.version;
                var dateCreated = operate.dateCreated
                this.deleteMsg(dateCreated + '|' + version);
                return;
            }
            //消息已读
            if (obj.msgType == 24) {
                var objdomain = JSON.parse(obj.msgDomain);
                if (objdomain.groupid && IM.chat_maps[objdomain.groupid]) {
                    var targets = IM.chat_maps[objdomain.groupid].find('[data-msgid="' + objdomain.dateCreated + '|' + objdomain.version + '"]').find('.msgread');
                    if (targets.length == 0) {
                        targets = IM.chat_maps[objdomain.groupid].find('[data-msgid="' + objdomain.msgId + '"]').find('.msgread');
                    }
                    if (targets.html() == '未读') {
                        targets.html('1人已读');
                    } else {
                        targets.html((parseInt(targets.html().split('人已读')[0]) + 1) + '人已读');
                    }
                } else if (IM.chat_maps[obj.msgSender]) {
                    IM.chat_maps[obj.msgSender].find('[data-msgid="' + objdomain.msgId + '"]').find('.msgread').html('已读');
                }
                return;
            }
            var firemsg = false;
            var bigemoji = false;
            //单人聊天
            var msgDiv = {};
            msgDiv["isSender"] = obj.msgSender == IM.subAccount.account ? true : false;
            if (obj.msgSender == obj.msgReceiver && obj.msgReceiver == IM.subAccount.account) {
                msgDiv["isSender"] = false;
            }
            msgDiv["senderName"] = obj.senderNickName || obj.msgSenderNick;
            msgDiv["msgType"] = obj.msgType;
            msgDiv["msgFileUrl"] = obj.msgFileUrl;
            msgDiv["content"] = obj.msgContent;
            msgDiv["msgFileName"] = obj.msgFileName;
            msgDiv["msgFileSize"] = obj.msgFileSize;
            msgDiv["msgId"] = obj.msgId;
            msgDiv["msgDomain"] = obj.msgDomain;
            if (obj.msgDomain && obj.msgDomain.indexOf('fireMessage') > -1) {
                firemsg = true;
            }

            var kg = false;
            if (obj.msgSender == IM.subAccount.account) {
                msgDiv["chatWindow"] = IM.chat_maps[obj.msgReceiver];
                var o = $('[data-im-contact="' + obj.msgReceiver + '"]');
                kg = IM.chat_window != null && IM.chat_window.attr("data-chat-with") == obj.msgReceiver;
            } else {
                var o = $('[data-im-contact="' + obj.msgSender + '"]');
                msgDiv["chatWindow"] = IM.chat_maps[obj.msgSender];
                kg = IM.chat_window != null && IM.chat_window.attr("data-chat-with") == obj.msgSender;
            }
            IM.addMsgToChatWindow(targetcell, msgDiv);
            var i = o.find(".noticeQ");
            document.getElementById('im_ring').play();
            if (kg) {
                return;
            }
            if (i.length == 0) {
                o.find('.discuss_name').after('<span class="noticeQ">' + 1 + '</span>');
            } else {
                o.find('.noticeQ').html(parseInt(o.find('.noticeQ').html()) + 1);
            }
        },
        /**消息通知
         * @param you_sender 发送者;
         * @param nickName 发送者昵称;
         * @param you_msgContent 发送消息体;
         * @param msgType 消息类型;
         * @param isfrieMsg 是否为阅后即焚
         * @param isCallMsg 是否为通话消息
         * inforSender
         * isAtMsg
         * */
        DO_deskNotice: function (obj) {
            // alert(obj.senderNickName);
            var $alertmessage = $('#' + obj.msgSender);
            $alertmessage.find('i').remove();
            $alertmessage.find('.lv-title').append('<i class="zmdi zmdi-comment-text zmdi-hc-fw"style="color: red"></i>');
            //用于显示桌面通知，标题栏闪烁和桌面弹出通知
            mynotify = new Notification("新消息提醒", {
                body: obj.senderNickName + "给您发了一条消息，请查看...",
                tag: 1
            });
            mynotify.onshow = function () {
                setTimeout(function () {
                    mynotify.close();
                }, 5000);
            }
            mynotify.onclick = function () {
                window.focus();
                $(' #chat-trigger').click();
                // $('#'+obj.msgSender).click();
                mynotify.close();
            }
        },
        /**
         * 发送文本消息
         * @param oldMsgid
         * @param text
         * @param receiver
         * @param isresend
         * @param type
         * @param ms
         * @constructor
         */
        EV_sendTextMsg: function (oldMsgid, text, receiver, isresend, type, ms) {

            var obj = new RL_YTX.MsgBuilder();
            obj.setText(text);
            obj.setType(1);
            obj.setReceiver(receiver);
            if (IM._extopts.length > 0) {
                for (var i = 0; i < IM._extopts.length; i++) {
                    if (text.indexOf(IM._extopts[i]) == -1) {
                        IM._extopts = IM._extopts.splice(i, 1);
                    } else {
                        IM._extopts[i] = IM._extopts[i].slice(1, IM._extopts[i].length);
                    }
                }
                obj.setAtAccounts(IM._extopts);
                obj.setType(11);
            }
            if (!!type) {
                obj.setType(type);
            }
            if (IM.chat_window.find('[data-firemsg]').attr('data-firemsg') == 'true') {
                obj.setDomain("fireMessage");
            }
            var msgId = RL_YTX.sendMsg(obj,
                function (obj) {
                    if (!ms) {
                        return;
                    }
                    ms['msgId'] = obj.msgClientNo;
                    IM.addMsgToChatWindow(null, ms);
                    IM.chat_window.find('[data-chat-input="chatinput"]').empty();
                },
                function (obj) {
                    setTimeout(function () { //断线的时候如果不延迟会出现找不到标签的情况，延迟0.3秒可解决。
                        if (obj.code == 580023) {
                            var tr = $('[data-msgid="' + obj.msgClientNo + '"]');
                            tr.addClass('msgError');
                            tr.attr('title', "@消息中有非群组用户");
                        } else if (obj.code == 580010) {
                            var tr = $('[data-msgid="' + obj.msgClientNo + '"]');
                            tr.addClass('msgError');
                            tr.attr('title', "已被禁言");
                        } else if (obj.code == 170001) {
                            var tr = $('[data-msgid="' + obj.msgClientNo + '"]');
                            tr.addClass('msgError');
                            tr.attr('title', "发送消息内容超长，请分条发送");
                            $.scojs_message(obj.code + ' : ' + obj.msg, $.scojs_message.TYPE_ERROR);
                        } else if (obj.code == 174002) {
                            var tr = $('[data-msgid="' + obj.msgClientNo + '"]');
                            tr.addClass('msgError');
                            tr.attr('title', "错误码： " + obj.code + "; 错误描述：" + obj.msg);
                        } else {
                            var tr = $('[data-msgid="' + obj.msgClientNo + '"]');
                            tr.addClass('msgError');
                            tr.attr('title', "错误码： " + obj.code + "; 错误描述：" + obj.msg);
                            // $.scojs_message(obj.code + ' : ' + obj.msg, $.scojs_message.TYPE_ERROR);
                        }
                    }, 300)
                });
            IM._extopts = [];
        },
        /**将消息添加到聊天框中
         * @param obj.isSender   发送方是否为当前账号
         * @param obj.senderName 消息发送方昵称
         * @param obj.msgType    消息类型（1：文本消息  4:图片消息）
         * @param obj.content    消息内容（）
         * @param obj.contentWith聊天窗口
         * @param obj.chatWindow 需要添加的聊天窗口
         *
         * */
        addMsgToChatWindow: function (targetcell, obj) {
            var thisurl = '../img/profile-pics/2.jpg';
            if (trim(IM.userinfo.photourl) != '' || typeof (IM.userinfo.photourl) === undefined) {
                thisurl = urlPathPre + IM.userinfo.photourl;
            }
            if (obj.isSender) {
                var posi = "oneTextR";
                var msgback = '<i class="msgBack">撤回</i>';
                var leftHeaderImg = '';
                var rightHeaderImg = '<img src="' + thisurl + '" class="left">';
                var msgRead = '';
                var msgHasRead = '<i class="msgread"></i>'
                // var msgHasRead = '<i class="msgread">未读</i>'
                var name = IM.subAccount.friendlyname;
            } else {
                var posi = "oneText";
                if (targetcell.photo != '') {
                    var purl = urlPathPre + targetcell.photo;
                    var leftHeaderImg = '<img src="' + purl + '" class="left">';
                } else {
                    var leftHeaderImg = '<img src="../img/profile-pics/2.jpg" class="left">';
                }
                var rightHeaderImg = '';
                var msgback = '';
                var msgRead = 'data-msgread="true"';
                var msgHasRead = '';
                var name = targetcell.friendlyname;
            }
            var html = '<div class="' + posi + '" data-msgId="' + obj.msgId + '" ' + msgRead + '>' +
                '<p>' + name + '</p>' +
                leftHeaderImg + rightHeaderImg +
                '<div id="" class="dialog">' +
                '<span class="sjx"></span>';
            var codes = '';
            if (obj.msgType == 1) {
                codes = obj.content;
            } else if (obj.msgType == 3) {
                codes = '<video src="' + obj.msgFileUrl + '" controls / >';
            } else if (obj.msgType == 4) {
                codes = '<a target="_blank" href="' + obj.msgFileUrl + '"><img src="' + obj.msgFileUrl + '" /></a>';
            } else if (obj.msgType == 7) {
                codes = '<a href= ' + obj.msgFileUrl + ' target="_blank" download="' + obj.msgFileName + '"><img src="IM/img/filepic.png" style="width:20px;cursor: auto;"/>' + obj.msgFileName + " : 文件大小：" + obj.msgFileSize + 'b</a>';
            } else if (obj.msgType == 11) {
                codes = obj.content;
            }
            if (!!obj.msgDomain && obj.msgDomain.indexOf('fireMessage') > -1) {
                codes = '<img src="IM/img/fireMessageImg.png" data-msgcontent="' + Base64.encode(codes) + '" />';
            } else {
                codes = codes;
            }
            if(obj.msgDomain&& obj.msgDomain.indexOf('emoji_url') >-1){
                var JmsgDomain = JSON.parse(obj.msgDomain);
                codes = '<img class="bigemoji" style="height: 120px;width: 120px" src="'+JmsgDomain.emoji_url+'"/>';
            }
            html += '<pre class="contentText">' + codes + '</pre>';
            html += '</div>' + msgback + msgHasRead + '</div>';
            obj.chatWindow.append(html);
            setTimeout(function () {
                obj.chatWindow.scrollTop(obj.chatWindow[0].scrollHeight);
            }, 300);
        },
        /**
         * 退出登录
         * @param needlogout
         * @constructor
         */
        DO_logout: function (needlogout) {
            for (var i in IM.chat_maps) {
                IM.chat_maps[i].remove();
            }
            if (IM.isCalling) {
                $('[data-btn="cancelVideo"]').click();
                $('[data-btn="cancelVoip"]').click();
                $('[data-btn="shutdownVoip"]').click();
                $('[data-btn="refuseVoip"]').click();

            }
            IM.chat_maps = {};
            clearInterval(IM.userStateInterval);
            $('.chat_list .normal_chat').empty();
            $('.contact_list .normal_chat').empty();
            // IM.chatNickName.html('');
            IM.currentChat = $('[data-window-type="chat"]').find('.chats');
            // IM.chat_window.attr('data-chat-with', null);
            // IM.chat_window.attr('data-chat-type', 'n');
            // IM.chat_window.find('.chats').show();
            IM.userStateInterval = null;
            IM.is_online = false;
            $('.nav .contacts').click();
            if (!needlogout) {
                return;
            }
            RL_YTX.logout(function () {

            }, function (err) {
                console.log(err);
            })
        },
        /**
         * 设置个人信息
         */
        setPersonalInfo: function (nikename, sign) {
            var uploadPersonInfoBuilder = new RL_YTX.UploadPersonInfoBuilder();
            uploadPersonInfoBuilder.setNickName(nikename);
            uploadPersonInfoBuilder.setSign(sign);
            RL_YTX.uploadPersonInfo(uploadPersonInfoBuilder, function (obj) {
            }, function (e) {
                showChart_Status(e.code + ' : ' + e.msg);
            });
        },
        /**
         * 获取在线状态
         */
        autoGetUserState: function (arr) {
            IM.EV_getUserState(arr);
            if (IM.userStateInterval) {
                return;
            }
            IM.userStateInterval = setInterval(function () {
                IM.EV_getUserState(arr);
            }, 30000);
        },
        /**
         * 获取用户在线状态
         * @param arr
         * @constructor
         */
        EV_getUserState: function (arr) {
            // $('.listview').find('.pull-left').remove('.chat-status-online');
            // getData(
            //     'post',
            //     '/sys/sysRedis/getOnlineUserList',
            //     null,
            //     'json',
            //     function (obj) {
            //         // console.log(obj.data.total);
            //         if(obj.data.total>0){
            //             // $('.listview').remove('<i class="chat-status-online"></i>');
            //             var onlines = obj.data.rows;
            //             $.each(onlines,function (i,o) {
            //                 $('.listview').find('[data-name="'+ o.realname +'"]').append('<i class="chat-status-online"></i>')
            //             })
            //         }
            //
            //     }
            // )
            if (arr.length == 0) {
                return;
            }
            var GetUserStateBuilder = new RL_YTX.GetUserStateBuilder();
            GetUserStateBuilder.setNewUserstate(true);
            GetUserStateBuilder.setUseracc(arr);
            RL_YTX.getUserState(GetUserStateBuilder, function (obj) {
                for (i in obj) {
                    alert(JSON.stringify(i));
                }
            }, function (e) {
                if (e.code == 609028) {
                    showmessage(e.code + ' : 基础版不支持查看用户在线');
                } else {
                    showmessage(e.code + ' : ' + e.msg);
                }

            });
        },
        /**
         * 发送通知类消息
         * @param type
         * @constructor
         */
        DO_notice: function (type) {
            IM.EV_sendTextMsg(new Date().getTime(), type, IM.currentChat.attr('data-c-with'), false, 12);
        },
        /**发送文件类消息
         * @param msgId 消息id
         * @param file 文件對象
         * @param type 消息类型
         * @param receiver 接收者
         * @param 是否是重发消息
         * */
        EV_sendfile: function (msgId, file, type, receiver) {
            var urls = window.URL.createObjectURL(file);
            var msgDiv = {};
            if (type == '7') {
                msgDiv["msgFileName"] = file.name;
                msgDiv["msgFileSize"] = file.size;
                msgDiv["msgFileUrl"] = urls;
            }
            msgDiv["msgFileUrl"] = urls;
            msgDiv["isSender"] = true;
            msgDiv["senderName"] = IM.subAccount.friendlyname;
            msgDiv["msgType"] = type;
            msgDiv["chatWindow"] = IM.currentChat;
            msgDiv['msgId'] = 'T' + new Date().getTime() + parseInt(Math.random() * 10000).toString();

            var obj = new RL_YTX.MsgBuilder();
            obj.setFile(file);
            obj.setType(type);
            obj.setReceiver(receiver);
            if (IM.chat_window.find('[data-firemsg]').attr('data-firemsg') == 'true' && receiver.substring(0, 1) != 'g') {
                obj.setDomain("fireMessage");
            }
            this.addMsgToChatWindow(null, msgDiv);

            RL_YTX.sendMsg(obj, function (e) {
                //发送成功
                $('[data-msgid=' + msgDiv.msgId + ']').attr('data-msgid', e.msgClientNo);
            }, function (e) { //失败回调
                $('[data-msgid=' + msgDiv.msgId + ']').addClass('msgError');
                $('[data-msgid=' + msgDiv.msgId + ']').attr('title', '发送文件失败');
                $('[data-msgid=' + msgDiv.msgId + ']').attr('data-msgid', e.msgClientNo.split('|')[1]);
            }, function (e) { //发送进度
                //	console.log(parseInt(e / file.size * 100) + '%');
            });
        },
        /**发起语音通话
         * @param calledUser
         * @param callType
         * @param tel
         * @param nickName
         */
        sendVoipCall: function (calledUser, callType, tel, nickName) {
            var makeCallBuilder = new RL_YTX.MakeCallBuilder();
            makeCallBuilder.setCalled(calledUser.toString());
            makeCallBuilder.setCallType(callType);
            makeCallBuilder.setNickName(nickName ? nickName : "normal");
            // if (callType == 2) {
            //     makeCallBuilder.setTel(tel);
            //     makeCallBuilder.setNickName(nickName);
            // }
            RL_YTX.makeCall(makeCallBuilder, function (e) {
                alert(JSON.stringify(e));
            }, function (e) {
                showChart_Status(e.code + ' : ' + e.msg);
                // cancelvoip();
                // $('[data-btn="cancelVoip"]').click();
            });
        },
        /**
         * 创建语音通话页面
         * @param obj
         * @param isSender
         * @param type
         */
        createAudioView: function (obj, isSender, type) {
            var part1 = '<div class="audioAline" data-call-with=' + obj + ' data-call-state="1" data-call-type=' + type + '>' +
                '<div class="imgDiv">' +
                '<img src="IM/img/voipcall.png">' +
                '</div>' +
                '<div class="audioDiv">' +
                '<p class="name">' + IM.chatNickName.text() + '</p>' +
                '<span class="audio audio_icon"></span>';
            var part2;
            if (!!isSender) {
                part2 = '<span class="color6060" data-call="msg" >等待对方回应</span>' +
                    '<audio autoplay="autoplay" id="audioCall"></audio>' +
                    '<div class="audioBtn">' +
                    '<button  onclick="cancelvoip()" data-btn="cancelVoip">取消</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else {
                part2 = '<span class="color6060" data-call="msg" >对方邀请你' + (type == 1 ? '视频' : '语音') + '通话</span>' +
                    '<audio autoplay="autoplay" id="audioCall"></audio>' +
                    '<div class="audioBtn">' +
                    '<button data-btn="acceptVoip">接受</button>' +
                    '<button data-btn="refuseVoip">拒绝</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }

            var ht = part1 + part2;
            $('.callmsg_alert').append(ht);
            RL_YTX.setCallView(document.getElementById('audioCall'), null);
            IM.currentCallWith = $('[data-call-with=' + obj + ']');
        },
        cancelVoipCall: function () {
            var ReleaseCallBuilder = new RL_YTX.ReleaseCallBuilder();
            ReleaseCallBuilder.setCallId(IM.currentCallId);
            ReleaseCallBuilder.setCaller(IM.subAccount.account);
            if (IM.currentCallWith.attr("data-call-type") == 1) {
                ReleaseCallBuilder.setCalled(IM.currentCallWith.attr("data-video-with").toString());
            } else {
                ReleaseCallBuilder.setCalled(IM.currentCallWith.attr("data-call-with").toString());
            }

            RL_YTX.releaseCall(ReleaseCallBuilder, function (e) {
            }, function (e) {
                showChart_Status(e.code + ' : ' + e.msg);
            });
            if (this.currentCallWith.attr("data-call-type") == 1) {
                this.currentCallWith.find('[data-btn="cancelVideo"]').html('取消');
                IM.currentCallWith.attr("data-call-state", "1");
                this.currentCallWith.hide();

            } else {
                this.currentCallWith.remove();
            }
            this.currentCallWith = null;
            this.currentCallId = null;
            document.getElementById('call_ring').pause();
        },
        acceptCall: function (e) {
            var AcceptCallBuilder = new RL_YTX.AcceptCallBuilder();
            AcceptCallBuilder.setCallId(this.currentCallId);
            AcceptCallBuilder.setCaller(this.currentCallWith.attr('data-call-with').toString());
            document.getElementById('call_ring').pause();
            var t = this.currentCallWith.attr("data-call-type");
            if (t == 1) {
                var distance = $('[data-video="distance"]')[0];
                var local = $('[data-video="local"]')[0];
                var caller = IM.currentCallWith.attr("data-call-with");
                RL_YTX.setCallView(distance, local);
                IM.currentCallWith.remove();
                IM.currentCallWith = $('[data-video-with]');
                IM.currentCallWith.attr('data-video-with', caller);
                IM.currentCallWith.find('[data-btn="cancelVideo"]').html("挂断");
                $('[data-call-type="1"]').show();
                RL_YTX.accetpCall(AcceptCallBuilder, function (e) {
                    console.log(e);
                    var s = IM.currentCallWith.attr("data-call-state");
                    if (s == 3) {
                        return;
                    }
                    IM.currentCallWith.attr("data-call-state", "3");
                    var t = '<button data-btn="shutdownVoip">挂断</button>';
                    IM.currentCallWith.find('[data-btn="cancelVoip"]').replaceWith(t);
                }, function (e) {
                    showChart_Status(e.code + ' : ' + e.msg);
                });
            } else { //处理音频
                var distance = document.querySelector('#audioCall');
                RL_YTX.setCallView(distance, local);
                RL_YTX.accetpCall(AcceptCallBuilder, function (e) {
                    var s = IM.currentCallWith.attr("data-call-state");
                    if (s == 3) {
                        return;
                    }
                    IM.currentCallWith.attr("data-call-state", "3");
                    IM.currentCallWith.find('.audioBtn').html('<button data-btn="cancelVideo">挂断</button>')
                    var times = IM.currentCallWith.find('[data-call="msg"]');
                    RL_YTX.setTimeWindow(times);
                }, function (e) {
                    showChart_Status(e.code + ' : ' + e.msg);
                });
            }
        },
        refuseCall: function (e) {
            var RejectCallBuilder = new RL_YTX.RejectCallBuilder();
            RejectCallBuilder.setCallId(this.currentCallId);
            RejectCallBuilder.setCaller(this.currentCallWith.attr('data-call-with').toString());
            document.getElementById('call_ring').pause();
            RL_YTX.rejectCall(RejectCallBuilder, function (e) {
            }, function (e) {
                showChart_Status(e.code + ' : ' + e.msg);
            });
            this.currentCallWith.remove();
            this.currentCallWith = null;
            this.currentCallId = null;
        },
        // sendVoipCall: function (calledUser, callType, tel, nickName) {
        //     var makeCallBuilder = new RL_YTX.MakeCallBuilder();
        //     makeCallBuilder.setCalled(calledUser.toString());
        //     makeCallBuilder.setCallType(callType);
        //     makeCallBuilder.setNickName(nickName ? nickName : "normal");
        //     if (callType == 2) {
        //         makeCallBuilder.setTel(tel);
        //         makeCallBuilder.setNickName(nickName);
        //     }
        //     RL_YTX.makeCall(makeCallBuilder, function (e) {
        //     }, function (e) {
        //         $.scojs_message(e.code + ' : ' + e.msg, $.scojs_message.TYPE_ERROR);
        //     });
        // },
        EV_onCallMsgListener: function (obj) {
            if (obj.code != 200) {
                console.error(obj.code);
                return;
            }
            if (obj.callType == 1) { //视频请求
                this.processVideo(obj);
            } else { //音频请求
                this.processAudio(obj);
            }
        },
        processAudio: function (obj) {
            var noticeMsg = null;
            if (obj.state == 1) { //，对方收到呼叫，对方振铃中
                IM.isCalling = true;
            } else if (obj.state == 2) { //发送请求成功 呼叫中
                this.currentCallId = obj.callId;
                document.getElementById('call_ring').play();
                IM.isCalling = true;
            } else if (obj.state == 3) { //对方接受
                document.getElementById('call_ring').pause();
                var s = this.currentCallWith.attr("data-call-state");
                if (s == 3) {
                    return;
                }
                this.currentCallWith.attr("data-call-state", "3");
                var t = '<button data-btn="shutdownVoip">挂断</button>';
                this.currentCallWith.find('[data-btn="cancelVoip"]').replaceWith(t);
                var times = this.currentCallWith.find('[data-call="msg"]');
                RL_YTX.setTimeWindow(times);
                noticeMsg = "[接收语音通话]";
                IM.isCalling = true;
            } else if (obj.state == 4) { //呼叫失败 对主叫设定：自动取消，对方拒绝或者忙
                document.getElementById('call_ring').pause();
                this.currentCallWith.remove();
                this.currentCallWith = null;
                this.currentCallId = null;
                noticeMsg = "[语音通话结束]";
                IM.isCalling = false;
            } else if (obj.state == 5) { //对方挂断
                this.currentCallWith.remove();
                this.currentCallWith = null;
                this.currentCallId = null;
                noticeMsg = "[语音通话结束]";
                document.getElementById('call_ring').pause();
                IM.isCalling = false;
            } else if (obj.state == 6) { //接到对方发来的通话
                this.createAudioView(obj.caller, false, obj.callType);
                this.currentCallId = obj.callId;
                document.getElementById('call_ring').play();
                noticeMsg = "[语音呼叫]";
                IM.isCalling = false;
            }
            if (!!noticeMsg) {
                // IM.DO_deskNotice(obj.caller, '', noticeMsg, '', false, true);
            }
        },
        isCalling: false,
        processVideo: function (obj) {
            var noticeMsg = null;
            if (obj.state == 2) { //发送请求成功
                this.currentCallId = obj.callId;
                IM.isCalling = false;
            } else if (obj.state == 3) { //对方接受
                document.getElementById('call_ring').pause();
                var s = this.currentCallWith.attr("data-call-state");
                if (s == 3) {
                    return;
                }
                this.currentCallWith.attr("data-call-state", '3');
                this.currentCallWith.find('[data-btn="cancelVideo"]').html("挂断");
                noticeMsg = "[接收视频通话]";
                IM.isCalling = true;
            } else if (obj.state == 4) { //呼叫失败 对主叫设定：自动取消，对方拒绝或者忙
                document.getElementById('call_ring').pause();
                this.currentCallWith.hide();
                this.currentCallWith = null;
                this.currentCallId = null;
                noticeMsg = "[视频通话结束]";
                IM.isCalling = false;
            } else if (obj.state == 5) { //对方挂断
                document.getElementById('call_ring').pause();
                this.currentCallWith.hide();
                this.currentCallWith = null;
                this.currentCallId = null;
                noticeMsg = "[视频通话结束]";
                IM.isCalling = false;
            } else if (obj.state == 6) {
                this.createAudioView(obj.caller, false, obj.callType);
                this.currentCallId = obj.callId;
                document.getElementById('call_ring').play();
                noticeMsg = "[视频呼叫]";
                IM.isCalling = false;
            }
            if (!!noticeMsg) {
                // IM.DO_deskNotice(obj.caller, '', noticeMsg, '', false, true);
            }
        },
        /**
         * 聊天对象的输入状态
         * */
        typingStatus: function (targetcell, status) {
            var isTyping = $('.isTyping');
            // var status = {
            //     '0': '',
            //     '1': '对方正在输入',
            //     '2': '对方正在录音'
            // };
            switch (status) {
                case 0 :
                    isTyping.html('');
                    break;
                case 1:
                    isTyping.html('对方正在输入...');
                    break;
                case 2:
                    isTyping.html('对方正在录音...');
                    break;
                default:
                    isTyping.html('');
            }
        },
        getChat: function (targetcell) {
            var thisnum = 0;
            if (IM.messageList != {}) {
                $.each(IM.messageList, function (index, message) {
                    if (message.msgSender == targetcell.account) {
                        IM.EV_onMsgReceiveListener(targetcell, message);
                        thisnum++;
                        // IM.addMsgToChatWindow(thiscell);
                    }
                })
            }
            var num = IM.messageNum - thisnum;
            $messagecount.html(num >= 0 ? num : 0);
        },
        /**
         * 撤销消息
         * @param msgId
         * @param callback
         * @constructor
         */
        EV_msgBack: function (msgId, callback) {
            var MsgBackBuilder = new RL_YTX.MsgBackBuilder();
            MsgBackBuilder.setMsgId(msgId);
            RL_YTX.msgBack(MsgBackBuilder, function onCanPlay(e) {
                callback(e);
            }, function onError(obj) {
                if (obj.code == 580035) {
                    showChart_Status(obj.code + ':' + '消息撤回错误，当前应用没有开放此功能');
                } else {
                    showChart_Status(obj.code + ':' + obj.msg);
                }

                // obj. code //错误码
                // obj.msg //错误描述
            })
        },
        EV_deleteReadMsg: function (msgId, callback) {
            var deleteReadMsgBuilder = new RL_YTX.DeleteReadMsgBuilder();
            deleteReadMsgBuilder.setMsgid(msgId);
            RL_YTX.deleteReadMsg(deleteReadMsgBuilder, function () {
                callback();
            }, function (err) {
                showChart_Status(err);
            })

        },

        deleteMsg: function (msgId) {
            var div = $('[data-msgid="' + msgId + '"]');
            if (div.length > 0) {
                var html = '<div class="historyTime">对方撤回了一条消息</div>';
                div.replaceWith(html);
            }
        },
        /**
         * 消息已读
         * @param msgId
         * @param callback
         * @constructor
         */
        // EV_msgRead: function (version, callback) {
        //     var msgReadBuilder = new RL_YTX.MsgReadBuilder();
        //     msgReadBuilder.setVersion(version);
        //     RL_YTX.msgRead(msgReadBuilder, function () {
        //         if (callback) callback();
        //     }, function (err) {
        //     })
        // },
        EV_msgRead: function (msgId, callback) {
            var MsgReadBuilder = new RL_YTX.MsgReadBuilder();
            MsgReadBuilder.setVersion(msgId);
            RL_YTX.msgRead(MsgReadBuilder, function (e) {
                if (callback) callback();
            }, function (e) {
                console.log(e);
            })
        },
        //工具方法
        /**
         * 时间戳
         * @returns {string}
         */
        getTimeStamp: function () {
            var now = new Date();
            var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? "" + (now.getMonth() + 1) : "0" + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds());
            return timestamp;
        },
        /**
         * 初始化emoji
         */
        initEmoji: function () { //初始化EMOJI
            var emojiDiv = $('#eMoji').find('div[class="popover-content"]');
            var content_emoji = '';
            for (var i in emoji.show_data) {
                var c = emoji.show_data[i];
                var out = emoji.replace_unified(c[0][0]); //'onclick="IM.DO_chooseEmoji(\'' + i + '\', \'' + c[0][0] + '\')" '
                content_emoji += '<span data-emoji-unified=' + i + ' data-emoji-unicode=' + c[0][0] + ' imtype="content_emoji" onclick="chosEm(this)">' + out + '</span>';
            }
            emojiDiv.append(content_emoji);
        },
        /**
         * 选择emoji
         * @param unified
         * @param unicode
         */
        choseEmoji: function (unified, unicode) {
            var content_emoji = '<img imtype="content_emoji" ' +
                'data-emoji-unicode="' + unicode + '"' +
                'data-emoji-unified="' + unified + '"' +
                'emoji_value_unicode="' + unicode + '' +
                '" style="width:18px; height:18px; margin:0 1px 0 1px;" ' +
                'src="IM/img/img-apple-64/' + unified + '.png"/>';
            var ht = IM.chat_window.find('.char_input').html();
            IM.chat_window.find('.char_input').html(ht + content_emoji);
        },
        createP2pChatWindow: function (cell) {
            var id = cell.account;
            var name = cell.friendlyname;
            // var cellString = JSON.stringify(cell);
            // cellString = cellString.replace(/"/g, '\'');
            this.targetCell = cell;

            // if (!this.chat_maps[id]) {
            var t = '<div class="chats" data-c-with = ' + id + ' style="display:none;">';
            var c = this.chat_window.find('.chatting').append(t);
            this.chat_maps[id] = c.find('[data-c-with="' + id + '"]');
            // }
            // ;
            // if (!!show) {
            // this.chat_window.attr('data-chat',cellString);
            this.chat_window.attr('data-chat-type', 'c');
            this.chat_window.attr('data-chat-with', id);
            this.currentChat.hide();
            this.chat_maps[id].show();
            this.currentChat = this.chat_maps[id];
            if (cell.photo != '') {
                var purl = urlPathPre + cell.photo;
                this.chat_window.find('img').attr('src', purl);
            }
            this.chatNickName.html(name);
            // };
        },
        DO_pre_replace_content_to_db: function (str) {
            str = str.replace(/<(div|br|p)[/]?>/g, '\u000A');
            str = str.replace(/\u000A+/g, '\u000D');
            str = str.replace(/<[^img][^>]+>/g, ''); // 去掉所有的html标记
            str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(
                /&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nbsp;/g,
                ' ');
            if ('\u000D' == str) {
                str = '';
            }
            ;
            return str;
        },
        /**
         * 消息池
         * {"version":49,"msgType":1,"sessionId":"49","msgContent":"nihao","msgSender":"8020920400000016","msgReceiver":"8020920400000015","msgDateCreated":"1500624183129","senderNickName":"蔡依林","mcmEvent":0,"msgId":"1500624183129|49"}
         * @param obj
         */
        storageMessage: function (obj) {
            IM.messageList.push(obj);
            // console.log('消息池消息数：' + IM.messageList.length);
            setLocalStorage('chatrecord', IM.messageList);
        },
        /**
         * 拍照
         */
        preTakePicture: function () {
            $('#takePic').show();
            var obj = {};
            var video = document.getElementById("picshow");
            obj.tag = video;
            RL_YTX.photo.apply(obj, function (e) {
            }, function (err) {
                console.log(err);
            });
        },
        cancleTakePicture: function () {
            RL_YTX.photo.cancel();
            $('#takePic').hide();
        },
        takePicture: function () {
            var resultObj = RL_YTX.photo.make();
            //拍照成功
            if ("200" == resultObj.code) {
                //展示图片
                //发送消息
                var obj = new RL_YTX.MsgBuilder();
                var msgid = new Date().getTime();
                IM.EV_sendfile(msgid, resultObj.blob, 4, IM.currentChat.attr("data-c-with"));
                $('#takePic').hide();
            }
        },

    };
    window.IM = new YTX();
})(jQuery);