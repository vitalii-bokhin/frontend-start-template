const gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
babel = require('gulp-babel'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
rename = require('gulp-rename'),
fileinclude = require('gulp-file-include'),
replace = require('gulp-replace'),
notify = require("gulp-notify"),
del = require('del');


//modules
var modulesOn = [
'button',
'image',
'form',
'customform',
'validateform',
'accord',
'more',
'popup',
'floatslider',
'tab',
'slickslider',
'scrollpane',
];

var modulesPath = {
	button: 'src/modules/button/',
	image: 'src/modules/image/',
	form: 'src/modules/form/',
	customform: 'src/modules/customform/',
	validateform: 'src/modules/validateform/',
	accord: 'src/modules/accord/',
	more: 'src/modules/more/',
	popup: 'src/modules/popup/',
	floatslider: 'src/modules/floatslider/',
	tab: 'src/modules/tab/',
	slickslider: 'src/modules/slickslider/',
	scrollpane: 'src/modules/scrollpane/',
};


//css src
var cssSrc = ['src/sass/common.scss'].concat(modulesOn.map((m) => modulesPath[m]+ '*.scss'));

var jsSrc = ['src/js/global.js'].concat(modulesOn.map((m) => modulesPath[m]+ '*.js'));

//dev build
gulp.task('dev', function() {
	HTML(['!src/html/_*.html', 'src/html/*.html']);

	CSS(cssSrc);

	del(['dist/css/style.min.css', 'dist/css/style.min.css.map']);

	JS(jsSrc);

	gulp.src('src/js/common.js')
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Common Script has Refreshed!'));

	del(['dist/js/script.min.js', 'dist/js/script.min.js.map']);

	//watch css
	gulp.watch('src/**/*.scss', function() {
		CSS(cssSrc);
	});

	//watch js
	gulp.watch(['src/**/*.js', '!src/js/common.js'], function() {
		JS(jsSrc);
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

//final build
gulp.task('fin', function() {
	HTML(['!src/html/_*.html', 'src/html/*.html'], true);

	CSS(cssSrc, true);

	del(['dist/css/style.css', 'dist/css/style.css.map']);

	JS(jsSrc, true);

	gulp.src('src/js/common.js')
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Common Script has Refreshed!'));

	del(['dist/js/script.js', 'dist/js/script.js.map']);
});


function CSS(src, fin) {
	setTimeout(function() {
		if (fin) {
			gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(autoprefixer(['last 2 versions', '> 1%']))
			.pipe(concat('style.css'))
			.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/css'))
			.pipe(notify('Styles has Compiled!'));
		} else {
			gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(concat('style.css'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/css'))
			.pipe(notify('Styles has Compiled!'));
		}
	}, 321);
}

function JS(src, fin) {
	if (fin) {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.on('error', notify.onError(function(err) { return err; }))
		.pipe(concat('script.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
		.pipe(notify('Scripts has Compiled!'));
	} else {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
		.pipe(notify('Scripts has Concated!'));
	}
}

function HTML(src, fin) {

	if (fin) {
		gulp.src(src)
		.pipe(fileinclude())
		.pipe(replace('style.css', 'style.min.css'))
		.pipe(replace('script.js', 'script.min.js'))
		.pipe(replace('..\/..\/dist\/', ''))
		.pipe(gulp.dest('dist'))
		.pipe(notify('HTML has Compiled!'));
	} else {
		gulp.src(src)
		.pipe(fileinclude())
		.pipe(replace('..\/..\/dist\/', ''))
		.pipe(gulp.dest('dist'))
		.pipe(notify('HTML has Compiled!'));
	}

}