$.U=function(url){
	return apiPath.replace(/\{.+?\}/g,url);
};

var 
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
	t=getTemplet(t);
	
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
	t=getTemplet(t);
	return $.x(d,function(i){
		// if(i.error)
		// 	return r?r(i):alert(i.error);

		t=模板.运转(t,r(i));
		// t=Mustache.render(t,r(i));
		if(f)
			tranH(t,f,ff);
	});
},
ME,
POST={},
text2html=function(txt){

	txt=txt.replace(/<image w=(\d+) h=(\d+) describe=([^>]+?)? name=(Notes_\d+\.(jpeg|png|jpg|gif)|\w{16,32})>/g,function(全,宽,高,说明文字,图片文件名){
//		console.log(全,宽,高,说明文字,图片文件名);

		var 
		输出宽=宽,
		输出高=高,
		比例=高/宽;

		说明文字=说明文字||'';

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

		if(图片文件名.match(/^\w{16,32}$/i)){
			src='http://ww2.sinaimg.cn/mw1024/'+图片文件名;
		}

		// if(PIC[src])
		// 	src='http://ww2.sinaimg.cn/mw1024/'+PIC[src];

		return '<img class="sm-pic" src="'+src+'" width="'+输出宽+'" height="'+输出高+'" alt="'+说明文字+'">';

		return '!['+说明文字+']('+src+')';
	});

	// txt=markdown.toHTML(txt);
	txt=_md2html(txt);
	return txt;
},
时间格式化=function(t){
	return t.reDate();
},
C=new Markdown.Converter(),
_md2html=function(i){
	i=i.replace(/```(|[\w]+)[\r\n]+([\W.\S]*?)```/mg,function(i,a,b){
		return '<pre><code class="'+a+'">'+b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\'/g,"&#39;").replace(/\"/g,"&quot;")+'</code></pre>'
	})//.replace(/(^|[^\"\'\]>])(http\:\/\/ww[0-9]{1}\.sinaimg\.cn\/)([\w]{4,10})(\/[\w]{16,32})(|\.gif|\.jpg|\.jpeg)/g,"<img src=\"$2mw1024$4$5\">")

	i=C.makeHtml(i);
	return i
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
	

	MD('article',P,'.article-box');

	if($('pre code')){
		// hljs.initHighlighting();
		$$('pre code').forEach(function(block) {
			hljs.highlightBlock(block);
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







//$.x('x/?info&_r='+Math.random(),function(r){
$.x($.U('info'),function(r){
	ME=r;

	document.title=r.nickname+' - 锤子';

	MD('header',ME,'header');

	$.x($.U('post'),function(post){
		// r=r.data;

		// var
		// post=r.note;



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

			// if(o.favorite)
				_post.push(o);
		}


		MD('posts',{
			post:_post
		},'.posts');

		Q.init({
			key:'/',
			index:'home'
		});
	});

});



var 
pop=function(){
	var hash=location.hash.match(/[\w\/]+/)+'';

};