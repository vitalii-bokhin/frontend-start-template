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
var modulesOn = [
'header',
'menu',
'fsscroll',
'user',
'button',
'toggle',
'flex-image',
'cover-image',
'video',
'popup',
'form',
'customform',
'validateform',
'accord',
'more',
'tab',
'anchor',
'diagram',
'numberspin',
'share',
'timer',
'footer',
//'getcontentajax',
//'mouseparallax',
//'floatslider',
//'slickslider',
//'scrollpane',
];

//css src
var cssSrc = ['src/sass/common.scss'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.scss'), 'src/sass/other.scss', 'src/sass/class.scss');

//js src
var jsSrc = ['src/js/global.js', 'src/js/animate.js', 'src/js/ajax.js'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.js'));

//DEV MODE
//copy module folders
gulp.task('copy_modules', function() {
	return gulp.src(['src/modules/*/*'], {base: 'src/modules/'})
	.pipe(gulp.dest('src/modules-set/'));
});

gulp.task('clean_modules_folder', ['copy_modules'], function() {
	return del(['src/modules/*']);
});

gulp.task('include_modules', ['clean_modules_folder'], function() {
	return gulp.src(modulesOn.map((m) => 'src/modules-set/'+ m +'/*'), {base: 'src/modules-set/'})
	.pipe(gulp.dest('src/modules/'))
	.pipe(notify('Module included!'));
});

gulp.task('dev', ['include_modules'], function() {
	//html dev
	HTML(['!src/html/_*.html', 'src/html/*.html']);

	CSS(cssSrc);

	del(['dist/css/style.min.css', 'dist/css/style.min.css.map']);

	JS(jsSrc);

	gulp.src('src/js/common.js')
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Common Script has Refreshed!'));

	del(['dist/js/script.min.js', 'dist/js/script.min.js.map']);

	//watch css
	gulp.watch(['src/sass/*.scss'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.scss')), function() {
		CSS(cssSrc);
	});

	//watch js
	gulp.watch(['!src/js/common.js', 'src/js/*.js'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.js')), function() {
		JS(jsSrc);
	});

	gulp.watch('src/js/common.js', function() {
		gulp.src('src/js/common.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(notify('Common Script has Refreshed!'));;
	});

	//watch html
	gulp.watch(['!src/html/_*.html', 'src/html/*.html'], function(event) {
		HTML(['!src/html/_*.html', event.path]);
	});

	gulp.watch(['src/html/_*.html'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.html')), function() {
		HTML(['!src/html/_*.html', 'src/html/*.html']);
	});
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

//DISTRIBUTION
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

//Functions
//css
function CSS(src, dist) {
	setTimeout(function() {
		if (dist) {
			gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(autoprefixer(['last 3 versions']))
			.pipe(concat('style.css'))
			.pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('dist/css'))
			.pipe(notify({
				title: 'CSS',
				message: 'Dist Styles'
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
				title: 'JS',
				message: 'Dist Scripts'
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
				message: 'Scripts has Compiled!'
			}));
	}
}

//html
function HTML(src, dist) {
	setTimeout(function() {
		if (dist) {
			gulp.src(src)
			.pipe(fileinclude())
			.on('error', notify.onError(function(err) { return err; }))
			.pipe(replace('style.css', 'style.min.css'))
			.pipe(replace('script.js', 'script.min.js'))
			.pipe(gulp.dest('dist'))
			.pipe(notify({
				title: 'HTML',
				message: 'Dist HTML'
			}));
		} else {
			gulp.src(src)
			.pipe(fileinclude())
			.on('error', notify.onError(function(err) { return err; }))
			.pipe(gulp.dest('dist'))
			.pipe(notify({
				onLast: true,
				title: 'HTML',
				message: 'HTML has Compiled!'
			}));
		}
	},1000);
}