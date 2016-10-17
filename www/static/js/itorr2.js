var iTorr=function(W,D,$,$$){

	$=function(i,p){
		return (p||D).querySelector(i);
	};
	$$=function(i,p){
		return toArr((p||D).querySelectorAll(i));
	};
	var toArr=$.toArr=function(r){
		return Array.prototype.slice.apply(r)
	};
	var
	_D=Element.prototype,
	_S=String.prototype,
	_N=Number.prototype,
	_A=Array.prototype,
	_O=Object.prototype,
	en=encodeURIComponent,
	de=decodeURIComponent;

	_D.css=function(i){
		if(!i)
			return this.style.cssText;

		this.style.cssText+=(';'+i);
		return this
	};


	$.x=function(d){
		return function(){
			var
			method,url,data,func,err,x,j,
			par,
			arg=toArr(arguments);

			if(arg[0]&&typeof arg[0]=='string'&&arg[0].match(/^(put|get|post|delete)$/i))
				method=arg.shift().toUpperCase();


			if(arg[0]&&typeof arg[0]=='object')
				par=arg.shift();

			url=arg.shift();


			if(arg[0]&&typeof arg[0]=='object'){
				dd=arg.shift();
				data=[];
				var o;
				for(var i in dd){
					o=dd[i];
					data.push(en(i)+'='+en(o))
				}
				data=data.join('&');
			}else if(arg[0]&&typeof arg[0]=='string')
				data=arg.shift();
			else
				data='';

			if(!method)
				method=data?'POST':'GET';

			if(arg[0]&&typeof arg[0]=='function')
				func=arg.shift();

			if(arg[0]&&typeof arg[0]=='function')
				err=arg.shift();

			if(d[url]&&method=='GET')
				return func(d[url]);

			(x=new XMLHttpRequest()).open(method,url,1);

			if(arg[0]&&arg[0]=='x')
				x.withCredentials=true;

			//console.log(par)
			if(par){
				var v;
				for(var k in par){
					v=dd[k];
					x[k]=v
				}
			}
		

			!data||x.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

			if(func||err)
				x.onreadystatechange=function(){
					if(x.readyState==4){
						//console.log(x.response,x.status)
						if((x.status>199&&x.status<301)||x.status==304||x.status==0){
							//console.log(x)
							if(x.responseType=='blob')
								j=x.response;
							else
								j=x.responseText;

							if((x.getResponseHeader('Content-Type')||'').match(/json/)||url.match(/\.json$/))
								j=JSON.parse(j||null);

							if(!data)
								d[url]=j;

							func(j);
						}else if(err)
							err(x.status);

					}
				};

			x.send(data);
			return x;
		};
	}({});

	_D.x=function(u,p,f,m){
		if(typeof p=='function'){
			f=p
			p=0
		}
		m=this;
		$.x(u,p,function(data){
			if(typeof data=='string' && !f){
				m.innerHTML=data;
			}else if(f){
				m.innerHTML=f(data)||'';
			}
		});
		return m;
	}

	$.cookie=function(name,data,time,path,domain,secure){
		if(typeof data=='undefined'){
			data=D.cookie.match(new RegExp('(^| )'+name+'=([^;]*)(;|$)'));
			return data==null?null:unescape(data[2]);
		}

		if(path && (typeof path==='number' || typeof path==='object') || (typeof path=='string' && path.match(/^\d$/)) ){
			time=path;
			path='';
		}
		var r=[];

		time=time||31536000;

		r.push(en(name)+'='+en(data)); // key value

		if(path)
			r.push('path='+path); // path

		if(time){
			var j=new Date();
			j.setTime(+j+time*1000);

			r.push('expires='+j.toUTCString()); // time
		}

		if(secure) //安全
			r.push('secure');


		return D.cookie=r.join(';');

	};


	W.$Stor=W.localStorage;

	$.stor=function(Stor){
		return function(name,data){
			if(typeof data=='undefined')
				return Stor[name];

			return Stor[name]=data;
		};
	}($Stor);

	$.j=
	$.l=function(cssLoadEnd){
		return function(url,fun,err,dom,callBackFunName){
			if(url.match(/\.css$/)){
				if(cssLoadEnd.indexOf(url)>-1)
					return;

				cssLoadEnd+=url+'|';


				dom=$.D('link');
				dom.href=url;
				dom.rel='stylesheet';
				dom.charset='UTF-8';
				if(fun)
					dom.onload=fun;
				if(err)
					err.onload=err;
				$('head').add(dom);
			}else if(url.match(/\w+\.html$/)){
				err=[];
				$.x(url,function(H){
					dom=$.D('div');

					var A;
					if(A=url.match(/(\w+)\.html/))
						dom.className=A[1]+'-box'

					dom.setAttribute('mode',url);
					h=H;

					//console.log(H)

					H.replace(/<script[\w\s="\/]*?>[.\s\S]+?<\/script>/igm,function(o){
						//console.log(o)
						err.push(o.replace(/^<script[\w\s="\/]*?>|<\/script>$/ig,''));
						return '';
					});
					//console.log(H);
					if((typeof fun=='function'||!fun)&&W.m){
						m.innerHTML=H;
						if(fun)
							fun();
					}else{
						dom.innerHTML=H;
						dom.addTo(fun||D.body);
					}

					//console.log(err);
					err.map(eval);//运行所有内联script标签
				});
			}else{

				callBackFunName='cb'+new Date().valueOf()+(Math.random()+'').substring(3);

				if(fun&&url.match(/\{cb\}/)){
					W[callBackFunName]=fun;
				}

				dom=$.D('script');
				dom.src=url.replace(/\{cb\}/,callBackFunName);
				dom.charset='UTF-8';
				dom.onload=function(){
					if(fun&&!url.match(/\{cb\}/))
						fun();

					dom.del();
				};
				dom.onerror=function(){
					if(err)
						err();
					dom.del();
				};
				dom.addTo();
			}

		};
	}('|');


	_D.addClass=function(i){
		if(this.hasClass(i))
			return this;
		this.className+=' '+i
		return this
	}

	_D.hasClass=function(i){
		return this.className.match(new RegExp(i))
	}
	_D.delClass=function(i){
		this.className=(' '+this.className+' ')
			.replace(new RegExp(' '+i+' ','g'),' ')
			.replace(/^\s+|\s+$/,'')
			.replace(/\s+/g,' ')
		return this
	}


	$.D=function(d){
		return D.createElement(d);
	}
	_D.add=function(d){
		if(d)
			this.appendChild(d);
		return this
	}
	_D.addTo=function(d){
		(d||D.body).appendChild(this);
		return this
	}
	_D.addToFront=
	_D.addEnd=function(d){
		this.insertBefore(d,this.childNodes[0]);
		return this
	}

	_D.addBefore=function(d){//把 d 增加到 this 前面
		var pa=this.parentNode;
		pa.insertBefore(d,this);
		return this
	}
	_D.addToBefore=function(d){//把 this 增加到 d 前面
		d.addBefore(this);
		//var pa=d.parentNode;
		//pa.insertBefore(d,this);
		return this
	}
	_D.addAfter=function(d){//把 d 增加到 this 后面
		var pa=this.parentNode;
		if (pa.lastChild==this)// 如果最后的节点是目标元素，则直接添加。因为默认是最后
			pa.appendChild(d);
		else
			pa.insertBefore(d,this.nextSibling);
			//如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
	}
	_D.addToAfter=function(d){//把 this 增加到 d 后面
		d.addAfter(this);
		return this
	}
	_D.del=function(f){
		if(f=this.parentNode)
			f.removeChild(this);
		return f
	}
	_D.copy=function(){
		return this.cloneNode(1);
	}
	_D.index=function(){
		var pa,r;
		if(!(pa=this.parentNode))
			return -1;
		r=toArr(pa.children);
		return r.indexOf(this);
	};

	var
	aniTime=300;

	_D.show=function(t,f){
		var o=this;
		if(typeof t=='function')
			f=t;

		setTimeout(function(){
			o.classDel('del')
			o.classAdd('ani')

			setTimeout(function(){
				o.classDel('h')

				setTimeout(function(){
					o.classDel('ani')
					if(f)
						f(o)
				},aniTime);
			},1);

		},typeof t=='Number'?t:1);

		//console.log('show')
		return this
	}
	_D.hide=function(t){
		var o=this;
		if(typeof t=='function')
			f=t;

		setTimeout(function(){
			o.classAdd('h ani');

			setTimeout(function(){
				o.classAdd('del');
				o.classDel('ani')
				if(f)
					f(o)
			},aniTime);

		},typeof t=='Number'?t:1);

		//console.log('hide')
		return this
	}


	_N.reDate=
	_S.reDate=function(){

		var
		e=this,
		h=new Date(),
		d;
		
		if((e+'').match(/^\d{13}$/)){
			d=new Date(e);
		}else if((e+'').match(/^\d{10}$/)){
			d=new Date(e*1000);
		}else{
			var arr=e.split(/[-\/ :]/);
			d=new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
		}

		var
		g=parseInt,
		f=g((h-d)/1000);

		return !e||f<0?'刚刚':
		f<60?(f+'秒前'):
		(f/=60)<60?g(f)+'分前':
		(f/=60)<24?g(f)+'时前':
		(f/=24)<7?g(f)+'天前':
		(f/=7)<2?g(f)+'周前':
		d>new Date(h.getFullYear()+'-01-01')?(d.getMonth()+1)+'月'+d.getDate()+'日':
		d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日';
	};

	_S.enTxt=function(){
		return this.replace(/(^\s*)|(\s*$)/g,'')
			.replace(/&/g,"&amp;")
			.replace(/</g,"&lt;")
			.replace(/>/g,"&gt;")
			.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;")
			.replace(/\'/g,"&#39;")
			.replace(/\"/g,"&quot;")
			.replace(/\n/g,"<br>");
	};

	_S.enHtml=function(){
		return this.replace(/(^\s*)|(\s*$)/g,'')
			.replace(/(http\:\/\/[\w\/.#&!?%:;=_]+\.)(gif|jpg|jpeg|png)/g,'<img src="$1$2">')
			.replace(/(http\:\/\/ww[0-9]{1}\.sinaimg\.cn\/)([\w]{4,10})(\/[\w]{16,32}\.)(gif|jpg|jpeg|png)/g,"$1mw1024$3$4")
			.replace(/http:\/\/www\.xiami\.com\/song\/([0-9]{5,12})[\?\w\.\=]*/g,'<a href="//www.xiami.com/song/$1" target="_blank" class="xiami">http://www.xiami.com/song/$1</a>')
			.replace(/(@)([\u0800-\u9fa5\w\-_]{2,32})/g,'<a href="//weibo.com/n/$2" target="_blank" class="at">$1$2</a>')
			.replace(/(^|[^\"\'\]>])(http|ftp|mms|rstp|news|https|telnet)\:\/\/([\w\/.#&!?%:;=\-_]+)/g,'$1<a href="$2://$3" rel="external nofollow noreferer" class="link" target="_blank">$2://$3</a>')
			.replace(/\n/g,"<br>");
	};



	
	if(!_A.indexOf)
		_A.indexOf=function(searchElement,fromIndex){
			var 
			index=-1;
			fromIndex=fromIndex*1||0;

			for (var k = 0, length = this.length; k < length; k++)
				if (k >= fromIndex && this[k] === searchElement) {
					index = k;
					break;
				}
			return index;
		};





	if(!W.$)
		W.$=$;

	if(!W.$$)
		W.$$=$$;

	return $
}(this,document);