var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
rename = require('gulp-rename'),
fileinclude = require('gulp-file-include'),
replace = require('gulp-replace'),
notify = require("gulp-notify");

gulp.task('default', function() {
  // place code for your default task here
});

function CSS(src) {
	setTimeout(function() {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
		.pipe(autoprefixer(['last 21 versions', '> 1%']))
		.pipe(replace('\/..\/dist', ''))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/css'))
		.pipe(notify('Styles has Compiled!'));
	}, 321);
}

function JS(src) {
	gulp.src(src)
	.pipe(sourcemaps.init())
	.pipe(uglify())
	.on('error', notify.onError(function(err) { return err; }))
	.pipe(concat('script.js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Scripts has Compiled!'));
}

function HTML(src) {
	gulp.src(src)
	.pipe(fileinclude())
	.pipe(replace('..\/..\/dist\/', ''))
	.pipe(gulp.dest('dist'))
	.pipe(notify('HTML has Compiled!'));
}

gulp.task('w', function () {

	//watch css
	gulp.watch('src/sass/*.scss', function() {
		CSS('src/sass/style.scss');
	});

	//watch js
	gulp.watch('src/js/*.js', function() {
		JS(['!src/js/common.js', '!src/js/*.min.js', 'src/js/global.js', 'src/js/*.js']);
	});

	gulp.watch('src/js/common.js', function() {
		gulp.src('src/js/common.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(notify('Common Script has Refreshed!'));
	});

	//watch html
	gulp.watch('src/html/*.html', function(event) {
		HTML(['!src/html/_*.html', event.path]);
	});

	gulp.watch('src/html/_*.html', function() {
		HTML(['!src/html/_*.html', 'src/html/*.html']);
	});

});

//fin
gulp.task('html', function() {
	HTML(['!src/html/_*.html', 'src/html/*.html']);
});

gulp.task('css', function () {
	CSS('src/sass/style.scss');
});

gulp.task('js', function () {
	JS(['!src/js/common.js', '!src/js/*.min.js', 'src/js/global.js', 'src/js/*.js']);

	gulp.src('src/js/common.js')
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Common Script has Refreshed!'));
});

gulp.task('fin', ['html', 'css', 'js']);