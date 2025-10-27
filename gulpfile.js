// const gulp        = require('gulp');
// const browserSync = require('browser-sync').create();
// const sass        = require('gulp-sass')(require('sass'));
// const cleanCSS = require('gulp-clean-css');
// const autoprefixer = require('gulp-autoprefixer');
// const rename = require("gulp-rename");
// const imagemin = require('gulp-imagemin');
// const htmlmin = require('gulp-htmlmin');
// const uglify = require('gulp-uglify');
// const ghPages = require('gulp-gh-pages');

import gulp from 'gulp';
import { create } from 'browser-sync';
const browserSync = create();
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import rename from "gulp-rename";
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import uglify from 'gulp-uglify';
import ghPages from 'gulp-gh-pages';

gulp.task('deploy', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        },
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        // .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.parallel('scripts'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
});

gulp.task('icons', function () {
    return gulp.src("src/icons/**/*", { encoding: false })
        .pipe(imagemin())
        .pipe(gulp.dest("dist/icons"));
});

gulp.task('images', function () {
    return gulp.src("src/img/**/*", { encoding: false })
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
});

gulp.task('models', function () {
    return gulp.src("src/models/**/*", { encoding: false })
        .pipe(gulp.dest("dist/models"));
});

gulp.task('default', gulp.parallel('deploy', 'watch', 'server', 'styles', 'scripts', 'icons', 'html', 'images', 'models'));