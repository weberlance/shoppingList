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
      // install and add angular version 1.6.9
      // dirs.node_modules + '/jquery/dist/jquery.min.js'
    ]
  },
  scss: [
    dirs.src + '/scss/styles.scss'
  ],
  css: {
    app: [],
    vendors: [
      // install and add bootsrap 4
      dirs.node_modules + '/bootstrap/dist/bootstrap.bundle.min.css' 
    ]
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
  gulp.watch(dirs.src + '*.html', ['index']);
  gulp.watch(paths.scss, ['css']);
  gulp.watch(paths.scripts.app, ['js-dev']);
  gulp.watch(paths.images, ['img']);
  gulp.watch(paths.templates, ['templates']);
});

// 
gulp.task('index', () => {
  return gulp.src(dirs.src)
    .pipe(gulp.dest(dirs.dist + '../'))
    .pipe(browserSync.reload({stream: true}));
});

// scss, css
gulp.task('css', () => {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
          browsers: ['last 10 versions'],
          cascade: false
      }),
      cssnano()
    ]))
    .pipe(gulp.dest(dirs.dist + '/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('css-vendors', () => {
  return gulp.src(paths.css.vendors)
    .pipe(concat('vendors.css'))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(gulp.dest(dirs.dist + '/css'))
    .pipe(browserSync.reload({stream: true}));
});

// js
gulp.task('js-dev', () => {
  return gulp.src(paths.scripts.app)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(dirs.dist + '/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-dev-vendors', () => {
  return gulp.src(paths.scripts.vendors)
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest(dirs.dist + '/js'))
    .pipe(browserSync.reload({stream: true}));
});


// images
gulp.task('img', () => {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(dirs.dist + '/images'))
    .pipe(browserSync.reload({stream: true}));
});

// copy
gulp.task('copy', () => {
  gulp.src(paths.templates)
    .pipe(gulp.dest(dirs.dist + '/templates'));
  gulp.src(paths.fonts.vendors)
    .pipe(gulp.dest(dirs.dist + '/fonts'));
  return gulp.src(paths.fonts.app)
    .pipe(gulp.dest(dirs.dist + '/fonts'));
});




// assembly tasks
gulp.task('dev', function() {
  gulp.start(
    'index',
    'css',
    'css-vendors',
    'js-dev',
    'js-dev-vendors',
    'img',
    'copy'
  );
});

// gulp.task('prod', function() {
//   gulp.start(
//     'index',
//     'css',
//     'js-prod',
//     'img',
//     'copy'
//   );
// });

gulp.task( 'default', function(cb){
  runSequence('cleanup', 'dev', ['serve', 'watch-dev']);
  cb();
});

// gulp.task( 'production', function(cb){
//   runSequence('cleanup', 'prod', ['serve']);
//   cb();
// });
