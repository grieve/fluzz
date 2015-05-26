'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('gulp-webpack-build');

var Tasks = {
    sass: function() {
        gulp.src('./src/scss/main.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('../server/static/css/'));
    },
    sassWatch: function() {
        gulp.watch('./src/scss/**/*.scss', ['sass']);
    },
    js: function() {
        return gulp.src('./webpack.config.js')
            .pipe(webpack.init())
            .pipe(webpack.props({
                debug: true,
                devtool: '#source-map'
            }))
            .pipe(webpack.run())
            .pipe(webpack.format({
                version: false,
                timings: true
            }))
            .pipe(webpack.failAfter({
                errors: true,
                warnings: true
            }))
            .pipe(gulp.dest('./'));
    },
    jsWatch: function() {
        return gulp.watch('src/js/**/*.@(hbs|js)')
            .on('change', function(event) {
                if (event.type === 'changed') {
                    gulp.src(event.path)
                        .pipe(webpack.closest('./webpack.config.js'))
                        .pipe(webpack.init())
                        .pipe(webpack.props({
                            debug: true,
                            devtool: '#source-map'
                        }))
                        .pipe(webpack.watch(function(err, stats) {
                            gulp.src(this.path)
                                .pipe(webpack.proxy(err, stats))
                                .pipe(webpack.format({
                                    verbose: false,
                                    version: false
                                }))
                                .pipe(gulp.dest('./'));
                        }));
                }
            });
    }
};

gulp.task('sass',       Tasks.sass);
gulp.task('sass:watch', Tasks.sassWatch);
gulp.task('js',         Tasks.js);
gulp.task('js:watch',   Tasks.jsWatch);

gulp.task('build',      ['sass', 'js']);
gulp.task('watch',      ['sass:watch', 'js:watch']);
gulp.task('default',    ['build']);
