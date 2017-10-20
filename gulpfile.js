'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	connect = require('gulp-connect'),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require('gulp-plumber'),
	htmlmin = require('gulp-htmlmin');

const dirs = {
	prod: 'public/',
	src: 'app/'
};

const path = {
	production: {
		html: dirs.prod,
		js: dirs.prod + 'js/',
		css: dirs.prod + 'css/',
		img: dirs.prod + 'img/'
	},
	src: {
		default: dirs.src,
		html: dirs.src + 'html/**/*.html',
		js: dirs.src + 'js/**/*.js',
		styles: dirs.src + 'styles/style.scss',
		img: dirs.src + 'img/**/*.*'
	},
	watch: {
		html: dirs.src + '**/*.html',
		js: dirs.src + 'js/**/*.js',
		styles: dirs.src + 'styles/**/*.scss'
	}
}

gulp.task('images', function() {
	return gulp.src(path.src.img)
		.pipe(gulp.dest(path.production.img));
});

gulp.task('styles', function() {
	return gulp.src(path.src.styles)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(clean({compatibility: 'ie8'}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(rename('bundle.min.css'))
		.pipe(gulp.dest(path.production.css))
		.pipe(connect.reload());
});

gulp.task('html', function() {
	return gulp.src(path.src.html)
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(path.production.html))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(concat('bundle.js'))
		.pipe(rename('bundle.min.js'))
		.pipe(gulp.dest(path.production.js))
		.pipe(connect.reload());
})

gulp.task('connect', function() {
	connect.server({
		port: 1113,
		root: [path.production.html],
		livereload: true
	});
});

gulp.task('default',
	['html', 'styles', 'js', 'images', 'watch', 'connect']
);

gulp.task('watch', function() {
	gulp.watch(path.src.default + '/**/*.*', function() {
		gulp.start('html');
		gulp.start('styles');
		gulp.start('js');
		gulp.start('images');
	});
});
