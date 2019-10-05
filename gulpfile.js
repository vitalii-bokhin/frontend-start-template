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

// modules
const modulesOn = [
	'global',
	'header',
	'header/user',
	'header/menu',
	'header/lang',
	'fsscroll',
	'screens',
	// 'scrollsmooth',
	'toggle',
	'flex-image',
	'cover-image',
	'lazy-load',
	'video',
	'popup', // popup media video needs video module
	'form/checkbox',
	'form/radio',
	'form/select',
	'form/autocomplete',
	'form/file',
	'form/placeholder',
	'form/maskinput',
	'form',
	'accord',
	// 'ajax',
	'more',
	'tab',
	'alert',
	'tooltip',
	'anchor',
	'diagram',
	'numberspin',
	'share',
	'timer',
	'footer',
	'getcontentajax',
	'dragline',
	'animation',
	'webgl',
	'mouseparallax',
	// 'floatslider',
	// 'slickslider',
	// 'scrollpane',
],
dist_path = 'dist';

let assets = {
	form: ['src/assets/maskinput.min.js', 'src/assets/jquery-3.1.1.min.js'],
	slickslider: ['src/assets/slick.min.js', 'src/assets/jquery-3.1.1.min.js'],
	scrollpane: ['src/assets/scrollpane.min.js', 'src/assets/jquery-3.1.1.min.js', 'src/assets/mousewheel.js'],
	screens: ['src/assets/jquery.touchSwipe.min.js', 'src/assets/jquery-3.1.1.min.js']
},
jsAssets = [];

modulesOn.forEach(function(val) {
	if (assets[val]) {
		jsAssets = jsAssets.concat(assets[val]);
	}
});

// src
let cssSrc = ['src/sass/font.scss', 'src/sass/reset.scss', 'src/sass/base.scss', 'src/sass/grid.scss', 'src/sass/button.scss', 'src/sass/icon.scss'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.scss'), 'src/sass/styles.scss', 'src/sass/sprite.scss', 'src/sass/decor.scss', 'src/sass/class.scss'),
jsSrc = ['src/js/global.js'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.js'));

// DEV MODE
// copy module folders
gulp.task('copy_modules', function() {
	return gulp.src(['src/modules/**/*'], {base: 'src/modules/'})
	.pipe(gulp.dest('src/modules-set/'));
});

gulp.task('clean_modules_folder', ['copy_modules'], function() {
	return del(['src/modules/*']);
});

gulp.task('include_modules', ['clean_modules_folder'], function() {
	return gulp.src(modulesOn.map((m) => 'src/modules-set/'+ m +'/*.*'), {base: 'src/modules-set/'})
	.pipe(gulp.dest('src/modules/'))
	.pipe(notify('Module included!'));
});

gulp.task('clean_js_folder', ['include_modules'], function() {
	return del([dist_path +'/js/*']);
});

gulp.task('dev', ['clean_js_folder'], function() {
	// html dev
	HTML(['!src/html/**/_*.html', 'src/html/**/*.html']);
	
	// build style.css
	CSS(cssSrc);
	
	// build script.js
	JS(jsSrc);
	
	// copy common script
	gulp.src('src/js/*.js')
	.pipe(gulp.dest(dist_path +'/js'))
	.pipe(notify('Common script had copied!'));
	
	// import js assets
	gulp.src(jsAssets)
	.pipe(gulp.dest(dist_path +'/js'))
	.pipe(notify('JS Assets had imported!'));
	
	// watch css
	gulp.watch(['src/sass/*.scss'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.scss')), function() {
		CSS(cssSrc);
	});
	
	// watch js
	gulp.watch(modulesOn.map((m) => 'src/modules/'+ m + '/*.js'), function() {
		JS(jsSrc);
	});
	
	gulp.watch('src/js/*.js', function() {
		gulp.src('src/js/*.js')
		.pipe(gulp.dest(dist_path +'/js'))
		.pipe(notify('Script had Refreshed!'));
	});
	
	// watch html
	gulp.watch(['!src/html/**/_*.html', 'src/html/**/*.html'], function(event) {
		HTML(['!src/html/**/_*.html', event.path]);
	});
	
	gulp.watch(['src/html/**/_*.html'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.html')), function() {
		HTML(['!src/html/**/_*.html', 'src/html/**/*.html']);
	});
});

// svg sprite
gulp.task('svgs', function() {
	gulp.src('src/images/svg/*.svg')
	.pipe(svgSprite({
		shape: {
			spacing: {
				padding: 10
			}
		},
		mode: {
			view: {
				bust: false,
				sprite: '../'+ dist_path +'/images/sprite.svg',
				prefix: '%%svg-%s',
				render: {
					scss: {dest: '../src/sass/_sprite-extends.scss'}
				}
			}
		}
	}))
	.pipe(replace(dist_path +'/', ''))
	.pipe(gulp.dest('.'))
	.pipe(notify({
		title: 'SVG',
		message: 'SVG Sprites had built!'
	}));
});

// DISTRIBUTION
gulp.task('dist', function() {
	HTML(['src/html/**/*.html', '!src/html/**/_*.html'], true);
	
	CSS(cssSrc, true);
	
	JS(jsSrc, true);
	
	gulp.src('src/js/*.js')
	.pipe(babel())
	.on('error', notify.onError(function(err) { return err; }))
	.pipe(gulp.dest(dist_path +'/js'))
	.pipe(notify({
		title: 'JS',
		message: 'Dist Common Script'
	}));
});

// Functions
// css
function CSS(src, dist) {
	setTimeout(function() {
		if (dist) {
			gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
			.pipe(autoprefixer(['last 3 versions']))
			.pipe(concat('style.css'))
			// .pipe(rename({suffix: '.min'}))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(dist_path +'/css'))
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
			.pipe(gulp.dest(dist_path +'/css'))
			.pipe(notify({
				onLast: true,
				title: 'CSS',
				message: 'Styles had Compiled!'
			}));
		}
	}, 321);
}

// javascript
function JS(src, dist) {
	if (dist) {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.on('error', notify.onError(function(err) { return err; }))
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dist_path +'/js'))
		.pipe(notify({
			title: 'JS',
			message: 'Dist Scripts'
		}));
	} else {
		gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dist_path +'/js'))
		.pipe(notify({
			onLast: true,
			title: 'JS',
			message: 'Scripts had Compiled!'
		}));
	}
}

// html
function HTML(src, dist) {
	if (dist) {
		gulp.src(src, {base: 'src/html/'})
		.pipe(fileinclude())
		.on('error', notify.onError(function(err) { return err; }))
		.pipe(gulp.dest(dist_path))
		.pipe(notify({
			title: 'HTML',
			message: 'Dist HTML'
		}));
	} else {
		gulp.src(src, {base: 'src/html/'})
		.pipe(fileinclude())
		.on('error', notify.onError(function(err) { return err; }))
		.pipe(gulp.dest(dist_path))
		.pipe(notify({
			onLast: true,
			title: 'HTML',
			message: 'HTML had Compiled!'
		}));
	}
}