const gulp = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");

gulp.task("default", function () {
  return gulp.src("src/**/*.js")
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(gulp.dest("dist"));
});