var gulp = require('gulp'),
browserSync = require('browser-sync'),
sass = require('gulp-sass'),
inject = require('gulp-inline-code'),
htmlmin = require('gulp-htmlmin'),
concat = require('gulp-concat'),
autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function() {
	var files = [
		'./dist/**/*'
	];

	browserSync.init({
		files: files,
		proxy: 'johnc.local',
		open: false
	});

	gulp.watch('./src/index.html', gulp.series('copy', 'bundle'));
	gulp.watch('./src/css/*.scss', gulp.series('copy', 'css', 'bundle'));
});

gulp.task('copy', function () {
	return gulp.src('./src/index.html')
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

gulp.task('inline-css', function () {
	return gulp.src('./src/packaged/index.html')
		.pipe(inject({
			type: 'css',
			path: './src/packaged/css/styles.css'
		}))
		.pipe(gulp.dest('./src/packaged/'))
		.pipe(browserSync.stream());
});

gulp.task('htmlmin', function () {
	return gulp.src('./src/packaged/index.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

gulp.task('default', gulp.series('browser-sync'));
gulp.task('bundle', gulp.series('inline-css', 'htmlmin'));
gulp.task('deploy', gulp.series('copy', 'inline-css', 'htmlmin'));