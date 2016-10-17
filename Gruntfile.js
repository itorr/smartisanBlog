module.exports = function (grunt) {


	grunt.registerMultiTask('itemplet', '合并模板文件', function () {
	
		// Iterate over all specified file groups.
		this.files.forEach(function (file) {

			var M={};
			var key,value;
			// Concat specified files.
			var src = file.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				}else if(filepath.match(/!/)){
					grunt.log.writeln('跳过文件 ' + filepath);
					return false;
				} else {
					return true;
				}
			}).forEach(function (filepath) {

				//grunt.log.writeln(filepath);

				key=filepath.match(/\/([^/]+?)\.(templet|view)$/);
				if(!key)
					return;

				key=key[1];

				value=grunt.file.read(filepath)
					.replace(/\t+/g,'\t')
					.replace(/<!--.+?-->/g,'');

				M[key]=value;
			});



			M=JSON.stringify(M);

			//grunt.log.writeln(M);

			var 
			objs=file.dest.match(/\/([^/]+?)s?\.js$/);

			objs=objs[1].replace(/(\w)/,function(v){return v.toUpperCase()});

			M='var get'+objs+'=function(M){return function(key){return M[key]}}('+M+')';

			grunt.file.write(file.dest,M);
	
			grunt.log.writeln('文件 ' + file.dest + ' 生成成功');
		});
	});

	grunt.registerMultiTask('cutjs', '修剪 JavaScript 代码', function () {
		
		var 
		r=[];

		this.files.forEach(function (file) {

			var 
			filepath=file.src[0];


			if (!filepath || !grunt.file.exists(filepath)) {
				grunt.log.warn('文件 ' + filepath + ' 不存在');
				return true;
			}else if(filepath.match(/3/)){
				grunt.log.writeln('跳过文件 ' + filepath);
				return true;
			}

			text=grunt.file.read(filepath);

			text=text.replace(/console\.log\(.+?\)/g,'');

			
			grunt.file.write(file.dest,r.join(''));
	
			grunt.log.writeln('文件 ' + file.dest + ' 生成成功');
		});
	});



	grunt.registerMultiTask('suffixupdate', '版本号更新', function () {
		
		
		var 
		suffix=Math.floor(+new Date()/1000).toString(36);

		this.files.forEach(function (file) {
			var src = file.src.forEach(function (filepath,b) {

				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('文件 ' + filepath + ' 不存在');
					return true;
				}

				text=grunt.file.read(filepath);

				text=text.replace(/suffix='\w{3,20}'/g,'suffix=\''+suffix+'\'');
				text=text.replace(/_r=\w{3,20}/g,'_r='+suffix);

				grunt.file.write(file.dest,text);

				grunt.log.writeln('文件 ' + filepath+ ' 版本号更新成功');

			});

		});
	});




	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		suffixupdate:{
			build:{
				files:{
					'dest/index.html':'www/dest.html'
				}
			}
		},
		htmlmin: {
			build:{
				options: {
					removeComments: true,
					removeCommentsFromCDATA: true,
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					minifyJS: 1
				},
				files: {
					'dest/index.html':'dest/index.html'
				}
			}
		},
		itemplet: {
			build: {
				files: {
					'dest/static/js/templets.js':'www/static/templet/*.templet'
				}
			},
		},
		less: {
			dynamic_mappings: {
				files: [{
			    	cwd: './',
					src:[
						'www/static/less/i.less',
					],
					dest: 'dest/static/css/index.css'
				}]
			},
		},
		concat: {
			js:{
				options: {
					separator: ';'
				},
				files: {
					'dest/static/js/build.js':[
						'www/static/js/itorr2.js',
						'www/static/js/q.js',
						'www/static/js/templet.js',
						'www/static/js/pagedown.converter.js',
						'dest/static/js/templets.js',
						'www/static/highlight/highlight.pack.js',
						'www/static/js/controller.js',
					]
				}
			},
			css:{
				files:{
					'dest/static/css/index.css':[
						'dest/static/css/index.css',
						'www/static/highlight/styles/monokai-sublime.css'
					]
				}
			}
		},
		uglify: {
			build: {
				files: {
					'dest/static/js/build.js':'dest/static/js/build.js'
				}
			}
		},
		cssmin: {
			compress: {
				files: {
					'dest/static/css/index.css':'dest/static/css/index.css',
				}
			}
		},
		copy: {
			main: {
				files: [
					{
						'dest/static/img/bg.jpg':'www/static/img/bg.jpg'
					}
				]
			},
		},
		clean: {
			dest: [
				'dest/*'
			],
			templet: [
				'dest/static/js/views.js',
				'dest/static/js/templets.js'
			]
		},
	});
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');




	// 默认任务
	grunt.registerTask('default', [
		'clean:dest',
		'itemplet',
		'suffixupdate',
		'htmlmin',
		'uglify',
		'less',
		'concat',
		'cssmin',
		'clean:templet',
		'copy',
	]);


	//,'gitcommit','gitpush'
}