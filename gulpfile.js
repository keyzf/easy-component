const gulp = require('gulp');

const buildTask = function(){
  return gulp.src('./src/**/*.less')
  .pipe(gulp.dest('./es'))
  .pipe(gulp.dest('./cjs'));
}
exports.default = buildTask