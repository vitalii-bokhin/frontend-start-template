var gulp = require('gulp'),
sass = require('gulp-sass'),
notify = require("gulp-notify"),
sourcemaps = require('gulp-sourcemaps'),
fileinclude = require('gulp-file-include'),
cssmin = require('gulp-cssmin'),
rename = require('gulp-rename'),
autoprefixer = require('gulp-autoprefixer'),
uglify = require('gulp-uglify'),
replace = require('gulp-replace');


gulp.task('default', function() {
  // place code for your default task here
});

function Sass(src) {
	setTimeout(function() {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(replace('\/..', ''))
		.pipe(sourcemaps.write('../src/sass'))
		.pipe(gulp.dest('./css'))
		.pipe(notify('CSS Compiled!'));
	}, 521);
}

gulp.task('w', function () {

	gulp.watch('./src/sass/*.scss', function() {
		Sass('./src/sass/styles.scss');
	});

	gulp.watch('./src/html/*.html', function(event) {
		gulp.src(['!./src/html/_*.html', event.path])
		.pipe(fileinclude())
		.pipe(replace('..\/..\/', ''))
		.pipe(gulp.dest('./'))
		.pipe(notify('HTML Included!'));
	});

	gulp.watch('./src/html/_*.html', function() {
		gulp.src(['!./src/html/_*.html', './src/html/*.html'])
		.pipe(fileinclude())
		.pipe(replace('..\/..\/', ''))
		.pipe(gulp.dest('./'))
		.pipe(notify('HTML Included!'));
	});

});

gulp.task('inc', function() {
	gulp.src(['!./src/html/_*.html', './src/html/*.html'])
	.pipe(fileinclude())
	.pipe(replace('..\/..\/', ''))
	.pipe(gulp.dest('./'));
});

gulp.task('css', function () {
	gulp.src(['!./src/sass/_*.scss', './src/sass/*.scss'])
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer(['last 121 versions', '> 1%']))
	.pipe(replace('\/..', ''))
	.pipe(gulp.dest('./css'))
	.pipe(notify('CSS with Autoprefixes Compiled!'));
});

gulp.task('mincss', function () {
	gulp.src('./src/sass/styles.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(['last 121 versions', '> 1%']))
	.pipe(replace('\/..', ''))
	.pipe(cssmin()) 
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./css'));
});

gulp.task('minjs', function () {
	gulp.src(['!./src/js/*.min.js','./src/js/*.js'])
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./js'));
});