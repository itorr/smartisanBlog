const express = require('express')
const router = express.Router()
const superagent = require('superagent')
const Eventproxy = require('eventproxy')
const moment = require('moment')

const account = require('../config.json')
// const errorCode = require('../error_code.json')

const url = {
  getCookie: 'https://account.smartisan.com/v2/session/?m=post',
  getProfile: 'https://cloud.smartisan.com/index.php?r=account%2Flogin',
  getNote: 'https://cloud.smartisan.com/apps/note/index.php?r=v2%2FgetList'
}

const header = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
}

let ep = new Eventproxy()

var ticket = {
  value: null,
  expires: null,
  _outOfDate: function () {
    return this.expires < new Date()
  },
  _init: function () {
    var that = this
    superagent
            .post(url.getCookie)
            .set(header)
            .set('Referer', 'https://account.smartisan.com/')
            .send(account)
            .redirects(0)
            .end((err, res) => {
              if (err || !res.ok) {
                console.log('出错了!')
              } else {
                console.log('成功获取了 uid: ' + JSON.stringify(res.body))
                console.log(res.headers['set-cookie'])

                that.value = res.headers['set-cookie']
                    .join(',').match(/SCA_SESS=([\w\-]{16,64})/i)[1]
                moment.locale('zh-cn')
                const time = moment()
                const expires = time.add(7, 'days')
                that.expires = expires.format('YYYY-MM-DD HH:mm:ss')

                console.log('成功获取ticket: ' + that.value)
                console.log('将于 ' + that.expires + ' 过期')

                ep.emit('got_ticket', that.value)
              }
            })
  }
}

let execute = (method, res) => {
  if (ticket._outOfDate()) {
    console.log('ticket 过期了!')
    ticket._init()
    ep.on('got_ticket', (_ticket) => {
      method(_ticket, res)
    })
  } else {
    method(ticket.value, res)
  }
}

const getProfile = (ticket, res) => {
  superagent
        .get(url.getProfile)
        .set(header)
        .set('Referer', 'https://cloud.smartisan.com/')
        .set('Cookie', 'SCA_SESS=' + ticket + '-a; SCA_LOGIN=1')
        .end((err, response) => {
          if (err || !response.ok) {
            console.log('出错了')
          } else {
            console.log('成功获取个人信息: ' + JSON.stringify(response.body))
            const payload = {
              'uid': response.body['data']['uid'],
              'nickname': response.body['data']['nickname'],
              'avatar_url': response.body['data']['avatar_url']
            }
            res.send(JSON.stringify(payload))
          }
        })
}

const getNote = (ticket, res) => {
  superagent
        .get(url.getNote)
        .set(header)
        .set('Referer', 'https://cloud.smartisan.com/apps/note/')
        .set('Cookie', 'SCA_SESS=' + ticket + '-a; SCA_LOGIN=1')
        .end((err, response) => {
          if (err || !response.ok) {
            console.log('出错了')
          } else {
            const length = JSON.stringify(response.body['data']['note'].length)
            console.log('成功获取' + length + '条便签:\r')
            console.log(JSON.stringify(response.body))
            const payload = []
            for (let offset = 0; offset < length; offset++) {
              if (JSON.stringify(response.body['data']['note'][offset]['favorite']) === '1') {
                payload.push(response.body['data']['note'][offset])
              }
            }
            console.log('成功输出' + payload.length + '条便签:\r')
            console.log('输出是' + payload)
            res.send(payload)
          }
        })
}

router.get('/info', (req, res) => {
  execute(getProfile, res)
})

router.get('/post', (req, res) => {
  execute(getNote, res)
})

module.exports = router
