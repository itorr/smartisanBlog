const express = require('express'),
    router = express.Router(),
    superagent = require('superagent'),
    eventproxy = require('eventproxy');


const account = require('../config.json');


const url = {
    getCookie: 'https://account.smartisan.com/v2/session/?m=post',
    getProfile: 'https://cloud.smartisan.com/index.php?r=account%2Flogin',
    getNote: 'https://cloud.smartisan.com/apps/note/index.php?r=v2%2FgetList'
};

const header = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};


var ep = new eventproxy();

var ticket =  {
    value: null,
    expires: null,
    _outOfDate : function () {
        return this.expires < new Date();
    },
    _init: function () {
        var that = this;
        superagent
            .post(url.getCookie)
            .set(header)
            .set('Referer','https://account.smartisan.com/')
            .send(account)
            .redirects(0)
            .end((err, res)=> {
            if (err || !res.ok) {
            console.log('出错了!');
        } else {
            console.log('成功获取了 uid' + JSON.stringify(res.body));

            that.value = res.headers['set-cookie']
                .join(',').match(/SCA_SESS=(\w{16,64})/i)[1];
            that.expires = new Date().addMonth(7);

            console.log(that.value);

            ep.emit('got_ticket', that.value);
        }
    });
    }
};


Date.prototype.addMonth = function (monthNum) {
    var date = new Date(this);
    date.setDate(this.getDate()+monthNum);
    return date;
};


var execute = (method, res)=> {
    if (ticket._outOfDate()) {
        console.log('ticket 过期了!');
        ticket._init();
        ep.all('got_ticket', (_ticket)=> {
            method(_ticket, res);
    });
    }else{
        method(ticket.value, res)
    }
};

var getList = (ticket, res)=> {
    let _res = res;
    superagent
        .post(url.getNote)
        .set(header)
        .set('Referer','https://cloud.smartisan.com/apps/note/')
        .set('SCA_SESS', ticket)
        .set('SCA_LOGIN', 1)
        .set('Cookie', 'SCA_SESS='+ticket+'-a; SCA_LOGIN=1')
        .end((err, res)=>{
        console.log('execute profiles: ' + JSON.stringify(res.body));
    _res.send(JSON.stringify(res.body))
});
};

router.get('/list', (req, res)=> {
    execute(getList, res);
});

module.exports = router;