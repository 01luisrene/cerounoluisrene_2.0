var gulp = require('gulp'),
		sass = require('gulp-sass'),
		rename = require("gulp-rename"),
		cleanCss = require('gulp-clean-css'),
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		sourceMaps = require('gulp-sourcemaps'),
		gcmq = require('gulp-group-css-media-queries'),
		uglify = require('gulp-uglify'),
		notify = require('gulp-notify'),
		imagemin = require('gulp-imagemin'),
		pngcrush = require('imagemin-pngcrush'),
		fontmin = require('gulp-fontmin'),
		livereload = require('gulp-livereload'),
		runSequence = require('run-sequence');

gulp.task('screen', function(){
	return gulp.src('./dev/screen/main.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(sourceMaps.init())
	.pipe(autoprefixer({browsers: ['last 2 versions'], cascade: true }))
	.pipe(gcmq())
	.pipe(cleanCss())
	.pipe(rename('screen.css'))
	.pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('./assets/css/'))
  .pipe(livereload())
  .pipe(notify('Tarea screen terminada!'));
});

//Comprimir archivos css de terceros
gulp.task("vendor-css", function(){
	return gulp.src('./dev/vendor-css/*.css')
	.pipe(cleanCss())
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./assets/css/'))
  .pipe(notify('Tarea vendor-css terminada!'));;
});

//Comprimir archivo app.js
gulp.task('fichero-js', function () {
   return gulp.src('./dev/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'))
    .pipe(notify('Tarea js terminada!'));
});

//Comprimir archivos js de terceros
gulp.task('vendor-js', function () {
   return gulp.src(['./dev/vendor-js/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});

//Comprimir imagenes
gulp.task('images', function() {
  gulp.src('./dev/images/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest('./dev/images-compress'));
});

//Comprimir fuentes
gulp.task('fonts', function () {
  return gulp.src([
			'./dev/fonts/*.ttf',
			'./dev/fonts/*.eot',
			'./dev/fonts/*.woff',
			'./dev/fonts/*.svg'
  	])
    .pipe(fontmin())
    .pipe(gulp.dest('./assets/fonts/'));
});

//Secuencia de ficheros css
gulp.task('build-css', function() {
    runSequence('screen', 'vendor-css')
})

//Secuencia de ficheros js
gulp.task('build-js', function() {
    runSequence(['fichero-js', 'vendor-js'])
})

//Otros ficheros
gulp.task('build-others', function() {
    runSequence(['images', 'fonts'])
})

//Vigila los cambios en las tareas asignadas
gulp.task('watch', function(){
	livereload.listen({ start: true })
	gulp.watch('./dev/screen/**/*', ['screen'])
	gulp.watch('./dev/js/**/*', ['fichero-js'])
	gulp.watch('./dev/vendor-css/*.css', ['vendor-css'])
});

//Tarea por defecto
gulp.task('default', function(){
	 runSequence(['build-css', 'build-js', 'build-others'], 'watch')
});