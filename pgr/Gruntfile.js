// Обязательная обёртка
module.exports = function(grunt) {

    // Задачи
    grunt.initConfig({
    	concat_css: {
		    options: {
		      // Task-specific options go here.
		    },
		    all: {
		      src: ["css/*.css"],
		      dest: "build/style.css"
		    },
		},
        // Склеиваем
        concat: {
            main: {
                src: [
                	'js/jquery-2.0.3.min.js',
                	'js/jquery.isotope.min.js',
                	'js/angular.min.js',
                	'js/angular-route.min.js',
                	'js/angular-resource.min.js',
                	'js/angular-cookies.min.js',
                	'js/angular-animate.min.js',
                	'js/angular-touch.min.js',
                	'js/angular-route-segment.min.js',
                	'js/angular-isotope.min.js',
                	'js/hamster.js',
                	'js/mousewheel.js',
                	'js/ngFacebook.js',
                	'js/google-plus-signin.js',
                	'js/localize.js',
                    'js/libs/*.js'
                ],
                dest: 'build/scripts.js'
            }
        },
        watch: {
		    concat: {
		        files: '<%= concat.main.src %>',
		        tasks: ['concat', 'concat_css']
		    }
		},
        // Сжимаем
        uglify: {
            main: {
                files: {
                    // Результат задачи concat
                    'build/scripts.min.js': '<%= concat.main.dest %>'
                }
            }
        },
        jshint: {
		    options: {
		        jshintrc: '.jshintrc'
		    },
		    files: 'js/libs/*.js'
		}
    });

    // Загрузка плагинов, установленных с помощью npm install
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Задача по умолчанию
    grunt.registerTask('default', ['concat', 'uglify']);
};