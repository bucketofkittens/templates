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
        // Сжимаем
        uglify: {
            main: {
                files: {
                    // Результат задачи concat
                    'build/scripts.min.js': '<%= concat.main.dest %>'
                }
            }
        }
    });

    // Загрузка плагинов, установленных с помощью npm install
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Задача по умолчанию
    grunt.registerTask('default', ['concat', 'uglify']);
};