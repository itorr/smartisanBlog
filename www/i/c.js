var 
getM=function(X){
	return function(xid){
		if(X[xid])
			return X[xid];

		return X[xid]=$('xmp[xid="'+xid+'"],.'+xid+' xmp').innerHTML;
	}
}({}),
tranH=function(t,f,ff){
	switch(typeof f){
		case 'function':
			f(t);
			break;
		case 'object':
			f.innerHTML=t;
			break;
		case 'string':
			$(f).innerHTML=t;
			break;
		default:
			return t;
			break;
	}

	switch(typeof ff){
		case 'function':
			ff(t);
			break;
	}
},
MD=function(t,i,r,f,ff){
	if(!f||typeof r!='function'){
		ff=f;
		f=r;
		r=function(i){return i};
	}
	t=getM(t);
	
	t=模板.运转(t,r(i));
	// t=Mustache.render(t,r(i));
	if(f)
		tranH(t,f,ff);

	return t;
},
MX=function(t,d,r,f,ff){
	if(!f||typeof r!='function'){
		ff=f;
		f=r;
		r=function(i){return i};
	}
	t=getM(t);
	return $.x(d,function(i){
		// if(i.error)
		// 	return r?r(i):alert(i.error);

		t=模板.运转(t,r(i));
		// t=Mustache.render(t,r(i));
		if(f)
			tranH(t,f,ff);
	});
},
POST={},
text2html=function(txt){

	txt=txt.replace(/<image w=(\d+) h=(\d+) describe=(.{0,}?) name=(Notes_\d+\.(jpeg|png|jpg|gif))>/g,function(全,宽,高,说明文字,图片文件名){
//		console.log(全,宽,高,说明文字,图片文件名);

		var 
		输出宽=宽,
		输出高=高,
		比例=高/宽;


		if(宽>400){
			输出宽=400;
			输出高=Math.floor(输出宽*高/宽);
		}

		if(宽<400 && 高>600){
			输出高=600;
			输出宽=Math.floor(输出高*宽/高);
		}

		var 
		src='https://cloud.smartisan.com/notesimage/'+图片文件名;


		if(PIC[src])
			src='http://ww2.sinaimg.cn/mw1024/'+PIC[src];

		return '<img class="sm-pic" src="'+src+'" width="'+输出宽+'" height="'+输出高+'" alt="'+说明文字+'">';

		return '!['+说明文字+']('+src+')';
	});

	//txt=markdown.toHTML(txt);
	txt=_md2html(txt);
	return txt;
},
时间格式化=function(t){
	console.log(t);
	return t.reDate();
},
getInfo=function(){
	//$.x('x/?info&_r='+Math.random(),function(r){
	$.x('json/info.json',function(r){

		ME=r=r.data;

		document.title=r.nickname+' - 锤子';

		MD('header',ME,'header');

	});

	$.x('json/post.json',function(r){
		r=r.data;

		var
		post=r.note;

		var 
		i=post.length,
		o,
		_post=[];

		while(i--){
			o=post[i];


			// o.time=o.modify_time.reDate();
			o.title=o.title.replace(/^#\s?/,'');
			// o.count=o.detail.length;
			// o.text=markdown.toHTML(o.detail);
			o.hasImage=!!o.detail.match(/<image/);
			POST[o.pos]=o;

			//if(o.favorite)
				_post.push(o);
		}


		MD('posts',{
			markdown:r.setting.markdown,
			post:_post
		},'.posts');

		$.x('json/pic.json',function(r){
			PIC=r;

			Q.init({
				key:'/',
				index:'home'
			});
			img2err();
		})
	})

	var 
	pop=function(){
		var hash=location.hash.match(/[\w\/]+/)+'';

	};
};

var 
body=document.body;

Q.reg('p',function(pid){//打开具体某篇文章时

	body.setAttribute('step','post');

	if(!pid||!POST[pid])
		return location.hash='#/home';


	var 
	pNavDom;

	
	if(pNavDom=$('.posts .active'))
		pNavDom.className='post ';


	if(pNavDom=$('#p_'+pid))
		pNavDom.className='post active';



	var
	P=POST[pid];


	document.title=P.title;
	P.text=text2html(P.detail).replace(/<\/h1>/,function(){
		return '<\/h1>\n<time>'+时间格式化(P.modify_time)+'</time>\n';
	});
	

	MD('article-box',P,'.article-box');
	img2err();

	if($('pre code')){
		$.j('i/monokai_sublime.css');
		$.j('i/highlight.pack.js',function(){
			hljs.initHighlighting();
		});
	}
	$('.article-box').scrollTop=0;

}).reg('home',function(){//打开首页
	body.setAttribute('step','home');
	var 
	pNavDom;
	document.title=ME.nickname+' - 锤子';
	
	if(pNavDom=$('.posts .active'))
		pNavDom.className='post ';
})

var 
PIC={},
img2err=function(){
	var 
	r=$$('img'),
	i=r.length;

	while(i--){
		if(!r[i].onerror){
			r[i].onerror=
			r[i].onload=function(){
				this.onerror=this.onload=null;
				if(this.src.match(/sinaimg/))
					return;


				var 
				that=this,
				url=that.getAttribute('osrc')||that.getAttribute('src');

				if(PIC[url])
					that.src='http://ww2.sinaimg.cn/mw1024/'+PIC[url]

				//return 
				$.x('x/?image&url='+encodeURIComponent(url),function(r){
					
					if(r.error)
						return;
					that.src='http://ww2.sinaimg.cn/mw1024/'+r.pid;
				});
			};
		}
		if(r[i].className=='sm-pic'){
			r[i].onclick=function(){
				open(this.getAttribute('src').replace(/mw1024/,'large'));
			};
		}
	}
};



getInfo();



$.j('i/fastclick.m.js',function(){
	FastClick.attach(document.body);
});