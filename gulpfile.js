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
notify = require('gulp-notify'),
del = require('del'),
svgSprite = require('gulp-svg-sprite');

//modules
var modules = {
	accord: 'src/modules/accord/',
	anchor: 'src/modules/anchor/',
	button: 'src/modules/button/',
	customform: 'src/modules/customform/',
	diagram: 'src/modules/diagram/',
	floatslider: 'src/modules/floatslider/',
	form: 'src/modules/form/',
	footer: 'src/modules/footer/',
	fsscroll: 'src/modules/fsscroll/',
	getcontentajax: 'src/modules/getcontentajax/',
	header: 'src/modules/header/',
	image: 'src/modules/image/',
	menu: 'src/modules/menu/',
	more: 'src/modules/more/',
	mouseparallax: 'src/modules/mouseparallax/',
	numberspin: 'src/modules/numberspin/',
	popup: 'src/modules/popup/',
	scrollpane: 'src/modules/scrollpane/',
	share: 'src/modules/share/',
	slickslider: 'src/modules/slickslider/',
	tab: 'src/modules/tab/',
	timer: 'src/modules/timer/',
	user: 'src/modules/user/',
	validateform: 'src/modules/validateform/',
	video: 'src/modules/video/'
};

var modulesOn = [
'header',
'menu',
'user',
'button',
'image',
'video',
'popup',
'form',
'customform',
'validateform',
'accord',
'more',
'tab',
'footer'
//'getcontentajax',
//'share',
//'numberspin',
//'anchor',
//'timer',
//'fsscroll',
//'mouseparallax',
//'diagram',
//'floatslider',
//'slickslider',
//'scrollpane',
];

//css src
var cssSrc = ['src/sass/common.scss'].concat(modulesOn.map((m) => modules[m]+ '*.scss'), 'src/sass/other.scss', 'src/sass/class.scss');

//js src
var jsSrc = ['src/js/global.js'].concat(modulesOn.map((m) => modules[m]+ '*.js'));

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
	gulp.watch(['src/sass/*.scss'].concat(modulesOn.map((m) => modules[m]+ '*.scss')), function() {
		CSS(cssSrc);
	});

	//watch js
	gulp.watch(['!src/js/common.js', 'src/js/*.js'].concat(modulesOn.map((m) => modules[m]+ '*.js')), function() {
		JS(jsSrc);
	});

	gulp.watch('src/js/common.js', function() {
		gulp.src('src/js/common.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(notify('Common Script has Refreshed!'));
	});

	//watch html
	gulp.watch(['!src/html/_*.html', 'src/html/*.html'], function(event) {
		HTML(event.path);
	});

	gulp.watch(['src/html/_*.html'].concat(modulesOn.map((m) => modules[m]+ '*.html')), function() {
		HTML(['!src/html/_*.html', 'src/html/*.html']);
	});
});

//dist build
gulp.task('dist', function() {
	HTML(['src/html/*.html', '!src/html/_*.html'], true);

	CSS(cssSrc, true);

	del(['dist/css/style.css', 'dist/css/style.css.map']);

	JS(jsSrc, true);

	gulp.src('src/js/common.js')
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Common Script has Refreshed!'));

	del(['dist/js/script.js', 'dist/js/script.js.map']);
});

//svg sprite
gulp.task('svgs', function() {
	gulp.src('src/images/svg/*.svg')
	.pipe(svgSprite({
		mode: {
			view: {
				bust: false,
				sprite: '../dist/images/sprite.svg',
				prefix: '%%svg-%s',
				render: {
					scss: {dest: '../src/sass/_sprite.scss'}
				}
			}
		}
	}))
	.pipe(replace('\/dist\/', '/'))
	.pipe(gulp.dest('.'))
	.pipe(notify('SVG Sprites has built!'));
});

//Functions
//css
function CSS(src, dist) {
	setTimeout(function() {
		if (dist) {
			gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(autoprefixer(['last 2 versions', '> 1%']))
			.pipe(concat('style.css'))
			.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/css'))
			.pipe(notify({
				onLast: true,
				title: 'CSS',
				message: 'Styles has Compiled!'
			}));
		} else {
			gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(concat('style.css'))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/css'))
			.pipe(notify({
				onLast: true,
				title: 'CSS',
				message: 'Styles has Compiled!'
			}));
		}
	}, 321);
}

//javascript
function JS(src, dist) {
	if (dist) {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.on('error', notify.onError(function(err) { return err; }))
		.pipe(concat('script.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({
				onLast: true,
				title: 'JS',
				message: 'Scripts has Compiled!'
			}));
	} else {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({
			onLast: true,
			title: 'JS',
			message: 'Scripts has Concated!'
		}));
	}
}

//html
function HTML(src, dist) {
	if (dist) {
		gulp.src(src)
		.pipe(fileinclude())
		.pipe(replace('style.css', 'style.min.css'))
		.pipe(replace('script.js', 'script.min.js'))
		.pipe(replace('..\/..\/dist\/', ''))
		.pipe(gulp.dest('dist'))
		.pipe(notify({
			onLast: true,
			title: 'HTML',
			message: 'HTML has Compiled!'
		}));
	} else {
		gulp.src(src)
		.pipe(fileinclude())
		.pipe(replace('..\/..\/dist\/', ''))
		.pipe(gulp.dest('dist'))
		.pipe(notify({
			onLast: true,
			title: 'HTML',
			message: 'HTML has Compiled!'
		}));
	}
}