// Обязательная обёртка
module.exports = function(grunt) {

    // Задачи
    grunt.initConfig({
        // Склеиваем
        concat: {
            main: {
                src: [
                	'js/jquery-2.0.3.min.js',
                	'js/jquery.isotope.min.js',
                    'js/jquery-ui-1.10.3.custom.min.js',
                	'js/angular.min.js',
                	'js/angular-route.min.js',
                	'js/angular-resource.min.js',
                	'js/angular-cookies.min.js',
                	'js/angular-touch.min.js',
                	'js/angular-route-segment.min.js',
                	'js/angular-isotope.min.js',
                    'js/angular-recaptcha.min.js',
                    'js/jquery.Jcrop.min.js',
                    'js/jquery.jcrop-canvas.js',
                    'js/jquery.icheck.min.js',
                    'js/spin.js',
                    'js/date.js',
                    'js/autocomplete.js',
                	'js/hamster.js',
                	'js/mousewheel.js',
                	'js/ngFacebook.js',
                	'js/google-plus-signin.js',
                    'js/hammer.min.js',
                    'js/angular-hammer.js',
                    'js/keypress.js',
                    'js/moment+langs.min.js',
                	'js/localize.js',
                    'js/angular-slider.min.js',
                    'js/libs/*.js'
                ],
                dest: 'build/scripts.js'
            },
            css: {
                src: [
                    "css/reset.css",
                    "css/jquery-ui-1.10.3.custom.min.css",
                    "css/jquery.Jcrop.min.css",
                    "css/angular-slider.min.css",
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
        },
        prangler: {
            default: {
              options: {
                ngApp: 'pgrModule'
              },
              files: {
                'js/libs/templates.js': ['views/*.html', 'partials/*.html'],
              }
            }
        },
       imageEmbed: {
            dist: {
              src: [ "build/style.css" ],
              dest: "build/style.base64.css",
              options: {
                deleteAfterEncoding : false,
                maxImageSize: 999999
              }
            }
        }
    });

    // Загрузка плагинов, установленных с помощью npm install
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Задача по умолчанию
    grunt.registerTask('default', ['prangler', 'concat', 'imageEmbed']);
};