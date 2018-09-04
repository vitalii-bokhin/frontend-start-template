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

var assets = {
	form: ['src/assets/maskinput.min.js', 'src/assets/jquery-3.1.1.min.js'],
	slickslider: ['src/assets/slick.min.js', 'src/assets/jquery-3.1.1.min.js'],
	scrollpane: ['src/assets/scrollpane.min.js', 'src/assets/jquery-3.1.1.min.js', 'src/assets/mousewheel.js']
},
jsAssets = [];

modulesOn.forEach(function(val) {
	if (assets[val]) {
		jsAssets = jsAssets.concat(assets[val]);
	}
});

//src
var cssSrc = ['src/sass/reset.scss', 'src/sass/font.scss', 'src/sass/base.scss', 'src/sass/grid.scss', 'src/sass/button.scss'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.scss'), 'src/sass/styles.scss', 'src/sass/sprite.scss', 'src/sass/animation.scss', 'src/sass/decor.scss', 'src/sass/class.scss'),
jsSrc = ['src/js/global.js'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.js'));

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

gulp.task('clean_js_folder', ['include_modules'], function() {
	return del(['dist/js/*']);
});

gulp.task('dev', ['clean_js_folder'], function() {
	//html dev
	HTML(['!src/html/_*.html', 'src/html/*.html']);

	//build style.css
	CSS(cssSrc);

	//delete style.min.css
	//del(['dist/css/style.min.css', 'dist/css/style.min.css.map']);

	//build script.js
	JS(jsSrc);

	//refresh common script
	gulp.src(['!src/js/global.js', 'src/js/*.js'])
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Script has Refreshed!'));

	//import js assets
	gulp.src(jsAssets)
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('JS Assets had imported!'));

	//watch css
	gulp.watch(['src/sass/*.scss'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.scss')), function() {
		CSS(cssSrc);
	});

	//watch js
	gulp.watch(['src/js/global.js'].concat(modulesOn.map((m) => 'src/modules/'+ m + '/*.js')), function() {
		JS(jsSrc);
	});

	gulp.watch(['!src/js/global.js', 'src/js/*.js'], function() {
		gulp.src(['!src/js/global.js', 'src/js/*.js'])
		.pipe(gulp.dest('dist/js'))
		.pipe(notify('Script has Refreshed!'));;
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
		shape: {
			spacing: {
				padding: 10
			}
		},
		mode: {
			view: {
				bust: false,
				sprite: '../dist/images/sprite.svg',
				prefix: '%%svg-%s',
				render: {
					scss: {dest: '../src/sass/_sprite-extends.scss'}
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

	//del(['dist/css/style.css', 'dist/css/style.css.map']);

	JS(jsSrc, true);

	gulp.src(['!src/js/global.js', 'src/js/*.js'])
	.pipe(gulp.dest('dist/js'))
	.pipe(notify('Common Script has Refreshed!'));

	//del(['dist/js/script.js', 'dist/js/script.js.map']);
});

//Functions
//css
function CSS(src, dist) {
	setTimeout(function() {
		if (dist) {
			gulp.src(src)
			.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
			.pipe(autoprefixer(['last 3 versions']))
			.pipe(concat('style.css'))
			//.pipe(rename({suffix: '.min'}))
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
		//.pipe(uglify())
		.on('error', notify.onError(function(err) { return err; }))
		.pipe(concat('script.js'))
		//.pipe(rename({suffix: '.min'}))
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
	if (dist) {
		gulp.src(src)
		.pipe(fileinclude())
		.on('error', notify.onError(function(err) { return err; }))
		//.pipe(replace('style.css', 'style.min.css'))
		//.pipe(replace('script.js', 'script.min.js'))
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
}