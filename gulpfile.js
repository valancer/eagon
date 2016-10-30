'use strict';

var	gulp = require('gulp'),
	fs = require('fs'),
	clean = require('gulp-clean'),
	fileinclude = require('gulp-file-include'),
	sass = require('gulp-sass'),
	buffer = require('vinyl-buffer'),
	csso = require('gulp-csso'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	imagemin = require('gulp-imagemin'),
	merge = require('merge-stream'),
	spritesmith = require('gulp.spritesmith'),
	autoprefixer = require('gulp-autoprefixer'),
	csscomb = require('gulp-csscomb'),
	newer = require('gulp-newer'),
	jshint = require('gulp-jshint'),
	connect = require('gulp-connect'),
	livereload = require('gulp-livereload'),
	watch = require('gulp-watch'),
	notify = require('gulp-notify'),
	runSequence = require('run-sequence'),
	awspublish = require('gulp-awspublish');


var paths = {
	sources: 'sources/**',
	build: 'build/',
	release: 'release/',
	html: {
		src: 'sources/html/*.html',
		base: 'sources/html/includes/',
		dest: 'build/'
	},
	sprites : {
		desktop: {
			src: 'sources/assets/images/desktop/sprites/*.png',
			filter: 'sources/assets/images/desktop/sprites/*@2x.png',
			dest: {
				img: 'sources/assets/images/desktop/',
				css: 'sources/assets/styles/scss/'
			}
		},
		mobile: {
			src: 'sources/assets/images/mobile/sprites/*.png',
			filter: 'sources/assets/images/mobile/sprites/*@2x.png',
			dest: {
				img: 'sources/assets/images/mobile/',
				css: 'sources/assets/styles/scss/'
			}
		}
	},
	scss: {
		src: 'sources/assets/styles/scss/**/*.scss',
		dest: 'sources/assets/styles/'
	},
	styles: {
		src: ['sources/assets/styles/*.css', '!sources/assets/styles/*.min.css'],
		dest: 'sources/assets/styles/'
	},
	scripts: {
		src: 'sources/assets/scripts/*.js',
		gulp: 'gulpfile.js',
		vendor: 'sources/assets/scripts/libs/*.js'
	}
};







/* html */
gulp.task('includes', function() {
	gulp.src([paths.html.src])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: paths.html.base,
			indent: true
		}))
		.pipe(gulp.dest(paths.html.dest))
		.pipe(livereload());
});


/* styles */
gulp.task('sprites:desktop', function () {
	var spriteData = gulp.src(paths.sprites.desktop.src).pipe(spritesmith({
		imgPath: '../images/desktop/sprites.png',
		imgName: 'sprites.png',
		cssName: '_sprites_desktop.scss',
		padding: 6,
		cssVarMap: function (sprite) {
			sprite.name = 'sd-' + sprite.name;
		}
	}));

	var imgStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin())
		.pipe(gulp.dest(paths.sprites.desktop.dest.img));

	var cssStream = spriteData.css
		.pipe(gulp.dest(paths.sprites.desktop.dest.css));

	return merge(imgStream, cssStream).pipe(livereload());
});

gulp.task('sprites:mobile', function () {
	var spriteData = gulp.src(paths.sprites.mobile.src).pipe(spritesmith({
		retinaSrcFilter: paths.sprites.mobile.filter,
		imgPath: '../images/mobile/sprites.png',
		imgName: 'sprites.png',
		retinaImgPath: '../images/mobile/sprites@2x.png',
		retinaImgName: 'sprites@2x.png',
		cssName: '_sprites_mobile.scss',
		padding: 6,
		cssVarMap: function (sprite) {
			sprite.name = 'sm-' + sprite.name;
		}
	}));

	var imgStream = spriteData.img
		.pipe(buffer())
		.pipe(imagemin())
		.pipe(gulp.dest(paths.sprites.mobile.dest.img));

	var cssStream = spriteData.css
		.pipe(gulp.dest(paths.sprites.mobile.dest.css));

	return merge(imgStream, cssStream).pipe(livereload());
});


gulp.task('sass', function () {
	return gulp.src(paths.scss.src)
        .pipe(sass({ errLogToConsole: false }))
		// .pipe(sass().on('error', sass.logError))
		.on('error', function(err) {
			notify().write(err);
			this.emit('end');
		})
		.pipe(gulp.dest(paths.scss.dest))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			expand: true,
			flatten: true
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(livereload());
});


gulp.task('csscomb', function() {
	return gulp.src('build/assets/styles/*.css')
		.pipe(csscomb('config/csscomb.json'))
		.pipe(gulp.dest('build/assets/styles/'));
});


/* scripts */
gulp.task('jshint', function() {
  return gulp.src([paths.scripts.gulp, paths.scripts.src])
    .pipe(jshint())
    .pipe(jshint.reporter(require('jshint-stylish')))
    .pipe(livereload());
});


/* files - clean */
gulp.task('clean:build', function () {
	return gulp.src(paths.build, {read: false})
	.pipe(clean());
});
gulp.task('clean:release', function () {
	return gulp.src(paths.release, {read: false})
	.pipe(clean());
});


/* files - copy */
gulp.task('copy:assets', function () {
	return gulp.src(['sources/assets/**', '!**/scss', '!**/scss/**', '!**/psd/**', '!**/sprites', '!**/sprites/**', '!**/templates/', '!**/templates/**', '!**/assets/icons/', '!**/assets/icons/**'])
	.pipe(gulp.dest('build/assets/'));
});
gulp.task('copy:scripts', function () {
	return gulp.src('sources/assets/scripts/**')
	.pipe(gulp.dest('build/assets/scripts/'));
});
gulp.task('copy:iconfont', function () {
	return gulp.src(['sources/assets/fonts/icons/**'])
	.pipe(gulp.dest('build/assets/fonts/icons/'));
});
gulp.task('copy:styles', function () {
	return gulp.src('sources/assets/styles/*.css')
	.pipe(gulp.dest('build/assets/styles/'));
});
gulp.task('copy:images', function () {
	return gulp.src(['sources/assets/images/**', '!**/sprites', '!**/sprites/**'])
	.pipe(gulp.dest('build/assets/images/'));
});
gulp.task('copy:release', function () {
	return gulp.src(['build/**'])
	.pipe(gulp.dest('release/'));
});



/* watch */
gulp.task('check', function() {
	return gulp.src([paths.scripts.gulp, paths.scripts.src, paths.scripts.vendor, 'sources/assets/images/*', ])
		.pipe(livereload());
});

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(['sources/html/**/*.html'], ['includes']);
	gulp.watch(['sources/assets/styles/scss/*.scss'], ['watch-sass']);
	// gulp.watch(['sources/assets/styles/*.css'], ['sass', 'copy:styles']);
	gulp.watch([paths.scripts.gulp], ['jshint', 'copy:scripts']);
	gulp.watch([paths.scripts.src, paths.scripts.vendor], ['copy:scripts']);
	gulp.watch(['sources/assets/images/**'], ['check', 'copy:images']);
	gulp.watch(['sources/assets/images/desktop/sprites/*'], ['sprites:desktop', 'copy:images']);
	gulp.watch(['sources/assets/images/mobile/sprites/*'], ['sprites:mobile', 'copy:images']);
});


/* connect */
gulp.task('connect', function () {
	connect.server({
		root: paths.build,
		port: 9001,
		livereload: true
	});
});


/* publish s3 */
gulp.task('publish', function () {
	var credentials = JSON.parse(fs.readFileSync('aws-credentials.json', 'utf8'));
	var publisher = awspublish.create(credentials);
	var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

	return gulp.src('release/**')
		.pipe(publisher.publish(headers))
		// .pipe(publisher.cache())
		.pipe(awspublish.reporter());

});



gulp.task('watch-sass', ['sass'], function(callback) {
	runSequence(['copy:styles'], callback);
});
gulp.task('sass-build', ['sprites:desktop', 'sprites:mobile', 'sass'], function() { });
gulp.task('sass-release', ['sprites:desktop', 'sprites:mobile', 'sass'], function() { });
gulp.task('scripts-build', ['jshint'], function() { });
gulp.task('html-build', ['includes'], function() { });

gulp.task('build', ['clean:build'], function(callback) {
	runSequence(['sass-build', 'scripts-build', 'html-build'], ['copy:assets'], ['connect', 'watch'], callback);
});
gulp.task('release', function(callback) {
	runSequence('clean:release', ['sass-release', 'scripts-build', 'html-build', 'copy:assets'], ['csscomb', 'copy:release'], callback);
});
