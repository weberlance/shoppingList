'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const del = require('del');
const runSequence = require('run-sequence');

const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

const imagemin = require('gulp-imagemin');

const dirs = {
  src: './src',
  dist: './public/assets',
  node_modules: './node_modules'
};

const paths = {
  scripts: {
    app: [
      dirs.src + '/scripts/*.js'
    ],
    vendors: [
      dirs.node_modules + '/jquery/dist/jquery.min.js' // install and add angular version 1.6.9
      // dirs.node_modules + '/jquery/dist/jquery.min.js'
    ]
  },
  scss: [
    dirs.src + '/scss/styles.scss'
  ],
  css: {
    app: [],
    vendors: []
  },
  images: [
    dirs.src + '/images/*.*'
  ],
  fonts: {
    app: [],
    vendors: []
  },
  templates: [
    dirs.src + 'templates/**/*.html'
  ]
  cleanup: dirs.dist + '/**/*'
};

gulp.task('serve', () => {
  browserSync.init({
    server: "./public"
  });
});

// common tasks
gulp.task('watch-dev', () => {
  gulp.watch(paths.scss, ['css']);
  gulp.watch(paths.scripts.app, ['js-dev']);
  gulp.watch(paths.images, ['img']);
  gulp.watch(paths.templates, ['templates']);
});

need to copy-recycle from bytecoin.in











add template task copy, later template-compile task





gulp.task('index', function(){
  return gulp.src('src/*.html')
    .pipe(gulp.dest('public'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('cleanup', function() {
  return del(['public/**/*'], {force: true});
});

gulp.task('css', function(){
  return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
          browsers: ['last 10 versions'],
          cascade: false
      }),
      cssnano()
    ]))
    .pipe(gulp.dest('public/styles'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-dev', function(){
  return gulp.src('src/scripts/*.js')
    .pipe(rename(function(path){
      path.extname = '.min' + path.extname;
    }))
    .pipe(gulp.dest('public/scripts'))
    .pipe(browserSync.reload({stream: true}));

  // return gulp.src('src/vendors/**/*.min.js')
  //  .pipe(concat('build.js'))
  //  .pipe(rename(function(path){
  //    path.extname = '.min' + path.extname;
  //  }))
  //  .pipe(gulp.dest('public/scripts/vendors'))
  //  .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-prod', function(){
  return gulp.src('src/scripts/*.js')
    .pipe(uglify())
    .pipe(rename(function(path){
      path.extname = '.min' + path.extname;
    }))
    .pipe(gulp.dest('public/scripts'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function(){
  return gulp.src('src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('public/images'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('copy', function(){
  gulp.src('src/media/*.*')
    .pipe(gulp.dest('public/media'));
  // gulp.src('src/vendors/**/*.css')
  //   .pipe(gulp.dest('public/styles'));
  gulp.src('src/vendors/**')
    .pipe(gulp.dest('public/vendors'));
  return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('public/fonts'));
});






// assembly tasks
gulp.task('dev', function() {
  gulp.start(
    'index',
    'css',
    'js-dev',
    'img',
    'copy'
  );
});

gulp.task('prod', function() {
  gulp.start(
    'index',
    'css',
    'js-prod',
    'img',
    'copy'
  );
});

gulp.task( 'default', function(cb){
  runSequence('cleanup', 'dev', ['serve', 'watch-dev']);
  cb();
});

gulp.task( 'production', function(cb){
  runSequence('cleanup', 'prod', ['serve']);
  cb();
});
