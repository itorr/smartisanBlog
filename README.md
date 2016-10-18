# 锤子博客
🔨博客，基于锤子便签的博客程序。

## 说明
去年大概这个时候写的一个基于锤子便签的博客程序。今天翻出来还可以用，几个 API 保持和锤子便签一致，只需要抓取到相应路径下即可实现更新。

## 端部分使用说明


```bash
npm i # 安装必要的 npm 包
grunt # 生成前端线上版本
```

`www/config.js` 配置 API 地址

## HTTP 服务器形式 API 

[HTTP 服务器形式 API 说明文档](https://github.com/itorr/smartisanBlog/tree/master/t) 来自 @solarhell

## 定时任务 静态 JSON API

```bash
node cron/cron.js laoluo@t.tt woshinidie # 生成 JSON 数据，默认目录 `./json`
```

### crontab 定时抓取

```bash
crontab -e # 编辑定时任务
```
在行尾添加

```bash
*/30 * * * * cd /home/git/smartisanBlog/;node cron/cron.js
```

## 使用了这些开源项目
 - Templet.js
 - PageDown.js
 - Q.js
 - Highlight.js
 - iTorr.js

## 演示

[http://front.dog/smartisan/#/home](http://front.dog/smartisan/#/home)