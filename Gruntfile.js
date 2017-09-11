module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({
		includereplace: {
			devleop: {
				options: {
					globals: {
						img: '../static/images/',
						css: '../static/css/',
						js: '../static/js',
						domain:'http://api.pgkfw.com/',
						static_domain:'http://static.vipiao.com'
					}
				},
				src: '**/*.html',
				dest: 'dist/',
				expand: true,
				cwd: 'pages/'
			}
		},

		nodeunit: {
			files: ['test/*.js']
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},

			files: ['Gruntfile.js', 'tasks/*.js', 'test/*.js']
		},

		clean: {
			dist: 'dist/'
		},

		watch: {
          scripts: {
            files: 'pages/**/*.*',
            tasks: ['includereplace'],
          },
        },
	});


    grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['watch']);
};
