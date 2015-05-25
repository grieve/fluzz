'use strict';

var gulp = require('gulp');
var webpack = require('gulp-webpack-build');

var Tasks = {
    build: function() {
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
    watch: function() {
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

gulp.task('build', Tasks.build);
gulp.task('watch', Tasks.watch);

gulp.task('default', ['build']);
