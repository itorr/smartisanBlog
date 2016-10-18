# 定时任务 静态 JSON API

## 抓取
```bash
node cron/cron.js laoluo@t.tt woshinidie # 生成 JSON 数据，默认目录 `./json`
```

## crontab 定时抓取

```bash
crontab -e # 编辑定时任务
```
在行尾添加

```bash
*/30 * * * * cd /home/git/smartisanBlog/;node cron/cron.js 账号 密码
```

## 图床
最近图床抽风比较严重，抽风那就多重试几次 w
