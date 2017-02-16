var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var nodemon = require('gulp-nodemon');

var srcDir = './public/';
var config = {
    sass: [srcDir + 'sass/**/*.scss', '!' + srcDir + 'sass/**/_*.scss'],
    css: srcDir + 'css'
};

gulp.task('sass', function() {
    return gulp.src(config.sass)
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest(config.css));
});

gulp.task('build:sass', function () {
    return gulp.src(config.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'chrome >= 34',
                'ie >= 8',
                'ff >= 30',
                'opera >= 23',
                'safari >= 7',
                'ios >= 7',
                'android >= 2.3',
                'ie_mob >= 10',
                'bb >= 10'
            ]
        }))
        .pipe(cleancss({
            compatibility: 'ie8',
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(config.css));
});

gulp.task('node', function () {
    return nodemon({
        verbose: true,
        script: 'server.js',
        ignore: ['public/*'],
        execMap: {
            js: 'node --harmony-async-await'
        }
    });
});

gulp.task('default', function() {
    gulp.watch(config.sass[0], ['build:sass']);
    gulp.start('node');
});