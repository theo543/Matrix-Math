const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"))
const pug = require("gulp-pug")
const rename = require("gulp-rename")
const fs = require("fs");
const browserSync = require('browser-sync').create();

let dest = "build";

exports.styles = function styles() {
    return gulp.src(["src/**/*.scss", "!src/**/_*"])
        .pipe(sass.sync())
        .pipe(rename({extname: ".css"}))
        .pipe(gulp.dest(dest))
}

exports.views = function views() {
    return gulp.src(["src/**/*.pug", "!src/**/_*"])
        .pipe(rename({extname: ".html"}))
        .pipe(pug())
        .pipe(gulp.dest(dest))
}

exports.clean = function clean() {
    return fs.promises.rm(dest, {recursive: true, force: true});
}

exports.serve = function serve(cb) {
    browserSync.init({
        server: {
            baseDir: dest
        }
    });
    cb();
}

exports.refresh = function refresh(cb) {
    browserSync.reload("**/*");
    cb();
}

exports.build = gulp.series(exports.clean, gulp.parallel(exports.styles, exports.views));

exports.watch = function watch() {
    gulp.watch("src/**/*", gulp.series(exports.build, exports.refresh));
}

exports.default = gulp.series(exports.build, exports.serve, exports.watch);
