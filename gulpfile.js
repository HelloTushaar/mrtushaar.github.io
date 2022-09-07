
const gulp = require("gulp"),
    cleanCSS = require('gulp-clean-css'),
    sass = require("gulp-sass")(require('sass')),
    uglify = require("gulp-uglify"),
    browserSync = require('browser-sync').create();
// const imageMin = require("gulp-imagemin");
// const webpConverter = require("gulp-webp");

// copy favicon
function copyFavicon() {
    return gulp.src('src/*.ico')
        .pipe(gulp.dest('docs'));
}
exports.copyFavicon = copyFavicon;

// copy xml-sitemap 
function copySitemap() {
    return gulp.src('src/*.xml')
        .pipe(gulp.dest('docs'));
}
exports.copySitemap = copySitemap;

// copy images
function copyImages() {
    return gulp.src('./src/images/*')
        .pipe(gulp.dest('./docs/images'));
}
exports.copyImages = copyImages;

// copy icons
function copyIcons() {
    return gulp.src('./src/icons/*')
        .pipe(gulp.dest('./docs/icons'));
}
exports.copyIcons = copyIcons;

// copy assets
function copyAssets() {
    return gulp.src('./src/assets/*')
        .pipe(gulp.dest('./docs/assets'));
}
exports.copyAssets = copyAssets;

// *** Note: Run 'copy_nonHtml_files' only when favicon, or xml-sitemap are modified
gulp.task('copy_nonHtml_files', gulp.series(copyFavicon, copySitemap, copyImages, copyIcons, copyAssets));

// build tasks ------------------------------------------------------------------------
// copy .html files 
function copyHtml() {
    return gulp.src("src/*.html")
        .pipe(gulp.dest("docs"))
        .pipe(browserSync.stream());
}
exports.copyHtml = copyHtml;

// compile sass to css and minify
function sassify() {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({ debug: true }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(gulp.dest('docs/styles/'))
        .pipe(browserSync.stream());
}
exports.sassify = sassify;

// minify js files 
function minifyJs() {
    return gulp.src('src/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('docs/scripts'))
        .pipe(browserSync.stream());
}
exports.minifyJs = minifyJs;

gulp.task('build', gulp.series(copyHtml, sassify, minifyJs));

// watching files for changes
function watch() {
    browserSync.init({
        server: {
            baseDir: './docs'
        }
    });
    gulp.watch('src/*.html', gulp.series(copyHtml)).on('change', browserSync.reload);
    gulp.watch('src/scripts/*.js', gulp.series(minifyJs)).on('change', browserSync.reload);
    gulp.watch('src/styles/**/*.scss', gulp.series(sassify)).on('change', browserSync.reload);
}
exports.watch = watch;

gulp.task('default', gulp.series('build', 'copy_nonHtml_files', watch));