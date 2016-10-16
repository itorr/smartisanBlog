const express = require('express');
const router = express.Router();
const path = require('path');

const superagent = require('superagent');
const async = require('async');
const cheerio = require('cheerio');

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


router.get('/', (req, res) => {
    async.waterfall([
        (callback) => {
            superagent
                .post(url.getCookie)
                .set(header)
                .set('Referer', 'https://account.smartisan.com/')
                .send(account)
                .redirects(0)
                .end((err, response) => {
                    if (err || !response.ok) {
                        console.log('出错了!');
                    } else if (response.body.errno == 1502) {
                        console.log('CAPTCHA REQUIRED');
                        res.send(JSON.stringify(response.body));
                    } else {
                        console.log('成功获取了 uid ' + JSON.stringify(response.body));
                        var token = response.headers['set-cookie']
                            .join(',').match(/SCA_SESS=(\w{16,64})/i)[1];
                        console.log('成功获取了 token '+ token);
                        callback(null, token);
                    }
                })
        },
        (arg1, callback) => {
            // arg1 now equals 'token'
            // callback(null, 'profile');
            superagent
                .get(url.getProfile)
                .set(header)
                .set('Referer', 'https://cloud.smartisan.com/')
                .set('Cookie', 'SCA_SESS='+arg1+'-a; SCA_LOGIN=1')
                .redirects(0)
                .end((err, response) => {
                    if (err || !response.ok) {
                        console.log('出错了!');
                    } else if (response.body.code == 1) {
                        console.log('未登录');
                    } else {
                        console.log('成功获取了资料:\n ' + JSON.stringify(response.body));
                        var profile = JSON.stringify(response.body);
                        callback(null, profile);
                    }
                })
        }
    ], (err, result) => {
        // result now equals 'profile'
        res.send(result);
    });
});


router.get('/note', (req, res) => {
    async.waterfall([
        (callback) => {
            superagent
                .post(url.getCookie)
                .set(header)
                .set('Referer', 'https://account.smartisan.com/')
                .send(account)
                .redirects(0)
                .end((err, response) => {
                    if (err || !response.ok) {
                        console.log('出错了!');
                    } else if (response.body.errno == 1502) {
                        console.log('太频繁了!');
                        res.send(JSON.stringify(response.body));
                    } else {
                        console.log('成功获取了 uid ' + JSON.stringify(response.body));
                        var token = response.headers['set-cookie']
                            .join(',').match(/SCA_SESS=(\w{16,64})/i)[1];
                        console.log('成功获取了 token '+ token);
                        callback(null, token);
                    }
                })
        },
        (arg1, callback) => {
            // arg1 now equals 'one' and arg2 now equals 'two'
            // callback(null, 'three');
            superagent
                .get(url.getNote)
                .set(header)
                .set('Referer', 'https://cloud.smartisan.com/')
                .set('Cookie', 'SCA_SESS='+arg1+'-a; SCA_LOGIN=1')
                .redirects(0)
                .end((err, response) => {
                    if (err || !response.ok) {
                        console.log('出错了!');
                    } else if (response.body.code == 1) {
                        console.log('未登录');
                    } else {
                        console.log('成功获取了便签:\n ' + JSON.stringify(response.body));
                        var note = response.body;
                        callback(null, note);
                    }
                })
        }
    ], (err, result) => {
        res.send(result);
    });
});

module.exports = router;



// var Token = function () {
//
//     return {
//         value: null,
//         expires: null,
//         _outOfDate : function () {
//             return this.expires < new Date();
//         },
//         _init: function () {
//             var that = this;
//             superagent
//                 .post(url.getCookie)
//                 .set(header)
//                 .set('Referer','https://account.smartisan.com/')
//                 .send(account)
//                 .redirects(0)
//                 .end(function (err, response) {
//
//                     if (err || !response.ok) {
//                         console.log('出错了!');
//                     } else {
//                         console.log('成功获取了 uid' + response.body);
//
//                         var cookie;
//                         cookie.value = response.headers['set-cookie']
//                             .join(',').match(/SCA_SESS=(\w{16,64})/i)[1];
//                         Date.prototype.addDate = function (dateNum) {
//                             var date = new Date(this);
//                             date.setDate(this.getDate() + dateNum);
//                             console.log('Cookie 将于 '+ date.toLocaleString() + ' 过期');
//                             return date;
//                         };
//
//                         cookie.expires = new Date().addDate(7);
//
//                         console.log(cookie.value);
//                     }
//                 });
//         }
//     }
// };