var 
FILES={},
getFile=function(url){
	if(FILES[url])
		return FILES[url];

	var 
	x=new XMLHttpRequest();
	x.open('GET',url,0);
	x.send();

	return FILES[url]=x.response;
},
getView=function(key){
	return getFile('static/view/'+key+'.view');
};
getTemplet=function(key){
	return getFile('static/templet/'+key+'.templet');
};