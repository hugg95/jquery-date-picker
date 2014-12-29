module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: true
            },
            dist: {
                files: {
                    'dist/datepicker.min.js': ['src/datepicker.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

};
