import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // сжатие css файла
import webpCss from 'gulp-webpcss'; //вы webp изображений
import autoprefixer from 'gulp-autoprefixer'; //добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries'; //групировка медиа запросов

const sass = gulpSass(dartSass);

export const scss = () => {
  return (
    app.gulp
      .src(app.path.src.scss, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            tittle: 'SCSS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      .pipe(app.plugins.replace(/@img\//g, '../img/'))

      .pipe(
        sass({
          outputStyle: 'expanded',
        })
      )
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
      .pipe(
        webpCss(
          app.plugins.if(app.isBuild, {
            webpClass: '.webp',
            noWebpClass: '.no-webp',
          })
        )
      )
      .pipe(
        app.plugins.if(
          app.isBuild,
          autoprefixer({
            grid: true,
            overrideBrowserlist: ['last 3 version'],
            cascade: true,
          })
        )
      )
      //расскоментировать если нужен не зжатый файл стилей
      // .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.if(app.isBuild, cleanCss()))
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
  );
};
