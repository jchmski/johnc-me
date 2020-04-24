// npm install browser-sync gulp gulp-mode gulp-autoprefixer gulp-eslint gulp-sass gulp-concat @babel/core @babel/preset-env @babel/polyfill babel gulp-babel gulp-uglify gulp-phplint --save-dev

var gulp = require('gulp'),
browserSync = require('browser-sync'),
sass = require('gulp-sass'),
inject = require('gulp-inline-code'),
htmlmin = require('gulp-htmlmin'),
babel = require('gulp-babel'),
eslint = require('gulp-eslint'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
autoprefixer = require('gulp-autoprefixer'),
phplint = require('gulp-phplint');

gulp.task('browser-sync', function() {
	var files = [
		'./dist/**/*'
	];

	browserSync.init({
		files: files,
		proxy: 'johnc.local',
		open: false
	});

	gulp.watch('./src/index.php', gulp.series('copy', 'bundle'));
	gulp.watch('./src/css/*.scss', gulp.series('copy', 'css', 'bundle'));
	// gulp.watch('./src/js/*.js', gulp.series('copy', 'js', 'bundle'));
});

gulp.task('copy', function () {
	return gulp.src('./src/index.php')
		.pipe(gulp.dest('./src/packaged/'))
});

gulp.task('css', function() {
  return gulp.src('./src/css/*.scss')
      .pipe(concat('styles.css'))
      .pipe(autoprefixer())
      .on('error', function(e) {
          console.log(e)
          this.emit('end')
      })
      .pipe(sass({ outputStyle: 'compressed' }))
      .on('error', function(e) {
          console.log(e)
          this.emit('end')
      })
      .pipe(gulp.dest('./src/packaged/css/'))
      .pipe(browserSync.stream());
});

// gulp.task('js', function() {
//   return gulp.src('./src/js/*.js')
//       .pipe(babel())
//       .on('error', function(e) {
//           console.log(e)
//           this.emit('end')
//       })
//       .pipe(eslint({baseConfig: {extends: 'eslint:recommended'}}))
//       .pipe(eslint.format())
//       .on('error', function(e) {
//           console.log(e)
//           this.emit('end')
//       })
//       .pipe(concat('johnc.me.js'))
//       .pipe(uglify())
//       .pipe(gulp.dest('./src/packaged/js/'))
//       .pipe(browserSync.stream());
// });

gulp.task('inline-css', function () {
	return gulp.src('./src/packaged/index.php')
		.pipe(inject({
			type: 'css',
			path: './src/packaged/css/styles.css'
		}))
		.pipe(gulp.dest('./src/packaged/'))
		.pipe(browserSync.stream());
});

gulp.task('htmlmin', function () {
	return gulp.src('./src/packaged/index.php')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

gulp.task('default', gulp.series('browser-sync'));
gulp.task('bundle', gulp.series('inline-css', 'htmlmin'));
gulp.task('build', gulp.series('copy', 'inline-css', 'htmlmin'));