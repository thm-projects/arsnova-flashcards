/*
 * This file is part of cards.
 * Copyright (C) 2018 The ARSnova Team
 *
 * cards is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * cards is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with cards.  If not, see <http://www.gnu.org/licenses/>.*/

let gulp = require('gulp4'),
	watch = require('gulp-watch');
let jshint = require('gulp-jshint');
let jscs = require('gulp-jscs');
let stylish = require('jshint-stylish');

let paths = [
	'./{imports,i18n,server,errors}/**/*.js',
	'./client/head.js'
];

gulp.task('watch', function () {
	gulp.watch(paths, gulp.series('codeCheck'));
});

gulp.task('lint', function () {
	return gulp.src(paths)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('jscs', function () {
	return gulp.src(paths)
		.pipe(jscs())
		.pipe(jscs.reporter());
});

gulp.task(
	'codeCheck',
	gulp.series('lint', 'jscs')
);

gulp.task(
	'default',
	gulp.series('codeCheck')
);
