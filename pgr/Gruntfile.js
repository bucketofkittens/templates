// Обязательная обёртка
module.exports = function(grunt) {

    // Задачи
    grunt.initConfig({
    	concat_css: {
		    options: {
		      // Task-specific options go here.
		    },
		    all: {
		      src: [
                "css/reset.css",
                "css/jquery.Jcrop.min.css",
                "css/fonts.css",
                "css/master.css"
              ],
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
                    'js/hammer.min.js',
                    'js/angular-hammer.js',
                	'js/localize.js',
                    'js/libs/*.js'
                ],
                dest: 'build/scripts.js'
            },
            css: {
                src: [
                    "css/reset.css",
                    "css/jquery.Jcrop.min.css",
                    "css/fonts.css",
                    "css/master.css"
                ],
                dest: "build/style.css"
            }
        },
        watch: {
		    concat: {
		        files: '<%= concat.main.src %>',
		        tasks: ['concat', 'cssmin']
		    }
		},
        cssmin: {
          minify: {
            expand: true,
            cwd: 'build/',
            src: ['*.css', '!*.min.css'],
            dest: 'build/',
            ext: '.min.css'
          }
        }
    });

    // Загрузка плагинов, установленных с помощью npm install
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Задача по умолчанию
    grunt.registerTask('default', ['concat', 'cssmin']);
};