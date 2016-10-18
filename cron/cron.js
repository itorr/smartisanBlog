var 
request=require('request'),
fs=require('fs');






var 
ARG=process.argv.slice(2);

// console.log(ARG);

var 
username=ARG[0],
password=ARG[1];



var 
用户临时凭证文件文件路径='cron/sess.txt',
图片缓存对应表文件路径='cron/pics.json',
文章数据文件路径='json/post.json',
用户数据文件路径='json/info.json',
文件配图文件夹路径='cron/pics/';



/*
curl 'https://account.smartisan.com/v2/session/?m=post' \
	-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36' \
	-H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' \
	-H 'Referer: https://account.smartisan.com/' \
	--data 'username=itorrrrrr@me.com&password=wsph123&extended_login=1' \
	-i \
	--compressed
*/
var 
SESS;







if(fs.existsSync(用户临时凭证文件文件路径)){
	SESS=fs.readFileSync(用户临时凭证文件文件路径);
}

var 
PICS={};



if(fs.existsSync(图片缓存对应表文件路径)){
	var 
	_pics=fs.readFileSync(图片缓存对应表文件路径);

	try{
		_pics=JSON.parse(_pics);

		if(_pics){
			PICS=_pics;
		}
	}catch(e){

	}
}


if(!fs.existsSync(文件配图文件夹路径)){
	fs.mkdirSync(文件配图文件夹路径);
}


var 
按顺序执行=function(items,step,end){

	var 
	next=function(){
		item=items.shift();
		if(!item){
			if(end)
				end();
			
			return;
		}

		step(item,next);
	};

	next();
},
上传图片到微博=function(file,返回图片唯一值){
	request.post({
		url:'http://x.mouto.org/wb/x.php?up',
		formData:{
			file:fs.createReadStream(file)
		},
	},function(e,res,body){

 		var 
 		pid=body.match(/\w{16,32}/i);

 		pid=''+pid;

 		if(e || body.match(/error|file_/) || !pid){
 			console.log(/上传失败/,body);

 			return 返回图片唯一值();
 		}


		console.log(/上传完成一张图/,file,pid);

		返回图片唯一值(pid);
	});
},
下载图片=function(url,path,返回图片路径){

	if(fs.existsSync(path)){
		console.log(/文件已存在/,path);
		return 返回图片路径(path);
	}

	request(url,{
		headers:{
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
			'Accept': 'image/webp,image/*,*/*;q=0.8',
			'Referer': 'https://cloud.smartisan.com/apps/note/',
			'Cookie': 'SCA_SESS='+SESS+'; SCA_LOGIN=1'
		}
	},function(err,res,body){
		if(err){
			console.log(/图片下载失败。/,err);
			return func();
		}

		console.log(/图片下载完成/,path);

		
		返回图片路径(path);

	}).pipe(fs.createWriteStream(path));	
},
登录=function(返回登录凭证){
	request.post('https://account.smartisan.com/v2/session/?m=post',{
		headers:{
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
			'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4',
			'Accept-Encoding': 'gzip, deflate, br',
			'Referer': 'https://account.smartisan.com/',
		},
		form:{
			username:username,
			password:password,
			extended_login:'1'
		}
	},function(err,res,body){

		if(err){
			return console.log(/登录失败/);
		}


		var 
		sess=res.headers['set-cookie'];

		if(!sess){
			return console.log(/获取 SESS 失败/);
		}

		if(!(sess=sess.join('').match(/SCA_SESS=([\w-_]+)/))){
			return console.log(/获取 SESS 失败/);
		}

		SESS=sess[1];


		fs.writeFileSync(用户临时凭证文件文件路径,SESS,{encoding:'utf8'});
		console.log(/用户临时凭证保存成功/,SESS);
		返回登录凭证(SESS);

	});
},获取用户数据=function(返回用户数据){

	/*

		curl 'https://account.smartisan.com/v2/w/?m=get' \
			-X POST \
			-H 'Accept-Encoding: gzip, deflate, br' \
			-H 'Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4' \
			-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36' \
			-H 'Content-Type: application/json;charset=utf-8' \
			-H 'Accept: application/json, text/plain, *\/*' \
			-H 'Referer: https://account.smartisan.com/' \
			-H 'Cookie: SCA_SESS=qTI5XqrrmPHp12YeAHj3VqCD5Evm_jqr; SCA_LOGIN=1' \
			-i 
			--compressed

	*/
	if(!SESS)
		return 登录(function(){
			获取用户数据(返回用户数据);
		});


	request.post('https://account.smartisan.com/v2/w/?m=get',{
		headers:{
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
			'Content-Type': 'application/json;charset=utf-8,',
			'Referer': 'https://account.smartisan.com/',
			'Cookie': 'SCA_SESS='+SESS+'; SCA_LOGIN=1'
		},
	},function(err,res,body){

		if(err){
			return console.log(/获取用户信息失败/);
		}

		if(!body.match(/{"errno":0,/)){

			return console.log(/获取用户信息失败，尝试重新登录/);
			return 登录(function(){
				获取用户数据(func);
			});
		}


		var 
		r=JSON.parse(body);

		r=r.data;

		var 
		用户信息={
			avatar_url:r.avatar_url,
			nickname:r.nickname,
			uid:r.uid
		};



		fs.writeFileSync(用户数据文件路径,JSON.stringify(用户信息),{encoding:'utf8'});
		console.log(/用户信息保存成功/,用户信息);

		返回用户数据(用户信息);

	});
},获取文章数据=function(返回文章数据){

	request.get('https://cloud.smartisan.com/apps/note/index.php?r=v2/getList',{
		headers:{
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',

			'Referer': 'https://cloud.smartisan.com/apps/note/',
			'Cookie': 'SCA_SESS='+SESS+'; SCA_LOGIN=1'
		},
	},function(err,res,body){

		if(err){
			return console.log(/获取用户信息失败/);
		}


		// console.log(res,body);
		// return;

		var 
		r=JSON.parse(body);

		r=r.data;

		// console.log(r);
		var 
		文章数据=整理文章数据(r.note,整理文件夹数据(r.folder));

		文章数据=JSON.stringify(文章数据);


		根据字符串取得图片下载到本地上传微博并替换(文章数据,function(文章数据){

			fs.writeFileSync(文章数据文件路径,文章数据,{encoding:'utf8'});
			console.log(/文章数据保存成功/);

		});


		返回文章数据();
	});
},整理文件夹数据=function(_文件夹们){


	var 
	文件夹们={};

	if(!_文件夹们){
		return 文件夹们;
	}

	_文件夹们.forEach(function(文件夹){
		文件夹们[文件夹.sync_id]=文件夹.title;
	});


	return 文件夹们;
},整理文章数据=function(文章们,文件夹们){
	return 文章们.filter(function(文章){
		if(!文章.favorite){
			return false;
		}

		return true;
	}).map(function(文章){

		return {
			pos:文章.pos,
			title:文章.title,
			detail:文章.detail,
			markdown:文章.markdown,
			cat:文件夹们[文章.folderId]||null,
			modify_time:文章.modify_time,
		};
	});

},
线上图片路径前缀='https://cloud.smartisan.com/apps/note/notesimage/',
根据字符串取得图片下载到本地上传微博并替换=function(文章数据,返回文章数据){
	图片们=文章数据.match(/Notes_\d+\.(png|jpeg|jpg|gif)/ig);

	// 图片们=图片们.map(function(o){
	// 	return 'https://cloud.smartisan.com/apps/note/notesimage/'+o;
	// });


	console.log(图片们);


	按顺序执行(图片们,function(图片,处理下一张图片){

		if(PICS[图片]){
			return 处理下一张图片();
		}

		 下载图片(线上图片路径前缀+图片,文件配图文件夹路径+图片,function(path){
		 	 if(!path){
		 	 	return 处理下一张图片();
		 	 }

		 	上传图片到微博(path,function(pid){

		 		
		 		if(!pid)
		 			return 处理下一张图片();
		 		


		 		存储到图片对应表(图片,pid);

		 		处理下一张图片();
		 	})
		 });
	},function(){
		console.log(/图片处理结束/);

		文章数据=文章数据.replace(/Notes_\d+\.(png|jpeg|jpg|gif)/ig,function(all){
			return PICS[all]||all;
		});

		返回文章数据(文章数据);

	});
},
存储到图片对应表=function(图片,pid){

	if(!图片||!pid){
		return;
	}

	PICS[图片]=pid;

	fs.writeFileSync(图片缓存对应表文件路径,JSON.stringify(PICS),{encoding:'utf8'});
};



var 
整理数据=function(){
	获取用户数据(function(){
		获取文章数据(function(){
			console.log(/全部完成！/);
		});
	});
};






整理数据();
