const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"))
const pug = require("gulp-pug")
const rename = require("gulp-rename")
const fs = require("fs");
const browserSync = require('browser-sync').create();
const exec = require("util").promisify(require("child_process").exec);

let dest = "build";
let hash = undefined;

exports.styles = function styles() {
    return gulp.src(["src/**/*.scss", "!src/**/_*"])
        .pipe(sass.sync())
        .pipe(rename({extname: ".css"}))
        .pipe(gulp.dest(dest))
}

exports.views = function views() {
    return gulp.src(["src/**/*.pug", "!src/**/_*"])
        .pipe(rename({extname: ".html"}))
        .pipe(pug(
            {
                pretty: true,
                locals: {'hash' : hash}
            }
        ))
        .pipe(gulp.dest(dest))
}

exports.resources = function resources() {
    return gulp.src(["src/**/*", "!src/**/*.pug", "!src/**/*.scss", "!src/**/_*"])
        .pipe(gulp.dest(dest))
}

exports.revision = async function revision() {
    let json = {};
    await exec("git update-index --refresh").catch(() => {});
    await exec("git diff-index --quiet HEAD --").catch(() => {json['uncommitted_changes'] = true;});
    hash = (await exec("git rev-parse HEAD")).stdout.trim();
    json['timestamp'] = parseInt((await exec(`git show ${hash} -s --format="%ct"`)).stdout);
    json['hash'] = hash;
    await fs.promises.writeFile(`${dest}/revision.json`, JSON.stringify(json));
}

exports.clean = async function clean() {
    await fs.promises.rm(dest, {recursive: true, force: true});
    await fs.promises.mkdir(dest);
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

exports.build = gulp.series(exports.clean, exports.revision, gulp.parallel(exports.styles, exports.views, exports.resources));

exports.watch = function watch() {
    gulp.watch("src/**/*", gulp.series(exports.build, exports.refresh));
}

exports.default = gulp.series(exports.build, exports.serve, exports.watch);
