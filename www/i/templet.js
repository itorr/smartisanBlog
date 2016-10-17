(function(上帝){
	var 
	需编码字串表={
		'&':'&amp;',
		'<':'&lt;',
		'>':'&gt;',
		'"':'&quot;',
		"'":'&#39;',
		'/':'&#x2F;',
		'`':'&#x60;',
		'=':'&#x3D;'
	},
	编码成文本=function(string){
		return String(string).replace(/[&<>"'`=\/]/g,function(s){
			return 需编码字串表[s];
		}).replace(/\n\r/g,function(s){
			return '\\n';
		})
	},
	编码成网页=function(string){
		return String(string);
		return String(string).replace(/"/g,function(s){
			return '\\'+s;
		});
	}, 
	编译模板=function(模板字串){
		var 
		已打开的钥匙们=[],
		钥匙前缀们='_',
		模板字串=模板字串
			.replace(/[\n\r\t]/g,'')
			.replace(/"/g,'\\"')
			.replace(/\{\{(#|\/|\^|&|\$)?(.+?)\}\}/g,function(整段文字,动作,管道){


			if(管道=='.')
				管道='_循环关键字';

			管道=管道.replace(/\|\|/g,' or ');

			管道=管道.split('|');

			钥匙=管道.shift();

			var 
			管道前,
			管道后,
			钥匙和管道;

			管道前=管道.reverse().join('(')+'(';

			管道后=[];
			管道后.length=管道.length;
			管道后=管道后.join(')')+')';



			钥匙和管道=管道前+钥匙+管道后;


			//钥匙和管道=钥匙和管道.replace(/ or /g,'||');


			钥匙前缀们=[];
			钥匙前缀们.length=已打开的钥匙们.length+3;
			钥匙前缀们=钥匙前缀们.join('_');


			switch(动作){
				case '#':
					已打开的钥匙们.push(钥匙);

					return '");\
					(function(){\
						var '+钥匙前缀们+'value;\
						var '+钥匙前缀们+'key;\
						if( typeof('+钥匙+')!=="undefined" && ('+钥匙+') && ('+钥匙+'='+钥匙和管道+'))\
						for('+钥匙前缀们+'key in '+钥匙+')\
						with('+钥匙前缀们+'value='+钥匙+'['+钥匙前缀们+'key]){\
							var _钥匙='+钥匙前缀们+'key;\
							var _循环关键字='+钥匙前缀们+'value;\
							$return.push("';

					break;
				case '$':
					已打开的钥匙们.push(钥匙);

					return '");\
					(function(){\
						if( typeof('+钥匙+')!=="undefined" && ('+钥匙+') ){\
							$return.push("';
				
					break;
				case '^':
					已打开的钥匙们.push(钥匙);

					return '");\
					(function(){\
						if( typeof('+钥匙+')==="undefined" || !('+钥匙+') ){\
							$return.push("';
				
					break;
				case '/':
					var 
					长度=已打开的钥匙们.length+1;
					while(已打开的钥匙们[--长度]&&已打开的钥匙们[长度]!=钥匙);
					
					已打开的钥匙们.splice(长度,1);

					return '")\
						}\
					})();\
					$return.push("';
				
					break;
				case '&':

					return '");\
						if(typeof('+钥匙+')!=="undefined")\
							$return.push(编码成网页('+钥匙和管道+'||\'\'));\
						\
						$return.push("';

					break;
				default:

					return '");\
						if(typeof('+钥匙+')!=="undefined")\
							$return.push(编码成文本('+钥匙和管道+'||\'\'));\
						\
						$return.push("';

					break;
			}

		});

		模板字串='\
			var $return=[];\
			var _value=$data;\
			var _key;\
			with($data){\
				$return.push("'+模板字串+'");\
			}\
			return $return.join(\'\');';
			
		return Function('$data','编码成文本','编码成网页',模板字串.replace(/ or /g,'||'));
	},
	运转=function(模板字串,数据,作用域){
		//console.log(编译模板(模板字串));

		return 编译模板(模板字串).call(作用域||上帝,数据,编码成文本,编码成网页);
	};
	
	上帝.模板={
		运转:运转,
		编译模板:编译模板,
		编码成文本:编码成文本,
		编码成网页:编码成网页,
	};

})(this);