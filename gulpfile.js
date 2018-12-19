const gulp = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");

gulp.task("default", done => {
  browserify({entries: "milkshake.js"})
    .transform(babelify)
    .bundle()
    .pipe(source('milkshake.js'))
    .pipe(gulp.dest('dist'));
  done();
});