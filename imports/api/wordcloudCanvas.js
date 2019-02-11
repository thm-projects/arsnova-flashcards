import WordCloud from "wordcloud";
import {Cardsets} from "./cardsets.js";
import {Filter} from "./filter.js";
import {Session} from "meteor/session";
import * as fakeWordCloud from "../../public/fakeStatistics/wordcloud";
import {ReactiveVar} from 'meteor/reactive-var';
import {Meteor} from "meteor/meteor";
import {PomodoroTimer} from "./pomodoroTimer";
import {FilterNavigation} from "./filterNavigation";
import {NavigatorCheck} from "./navigatorCheck";

let clearCanvas;
let drawOutOfBound;
let gridSize;
let weightFactor;
let rotateRatio;
let fontFamily;
let color;
let backgroundColor;
let wait;
let wordcloudPomodoroSize = 0.6;
let defaultToFilterWordcloudThreshold = 100;

export let WordcloudCanvas = class WordcloudCanvas {

	static setConfig () {
		if (Meteor.userId()) {
			clearCanvas = true;
			drawOutOfBound = false;
			gridSize = 24;
			weightFactor = 24;
			rotateRatio = 0;
			fontFamily = 'Roboto Condensed, Arial Narrow, sans-serif';
			color = "random-light";
			backgroundColor = 'rgba(255,255,255, 0)';
			wait = 50;
		} else {
			clearCanvas = true;
			drawOutOfBound = false;
			gridSize = 24;
			weightFactor = 24;
			rotateRatio = 0;
			fontFamily = 'Roboto Condensed, Arial Narrow, sans-serif';
			color = "random-light";
			backgroundColor = 'rgba(255,255,255, 0)';
			wait = 400;
		}
	}

	static draw () {
		if (document.getElementById('wordcloud-canvas') !== null) {
			this.setCanvasSize();
			if (!NavigatorCheck.isSmartphone() && Meteor.userId()) {
				PomodoroTimer.setCloudShown(true);
				this.setConfig();
				let wordcloundContent = this.getContent();
				this.setWordcloudTheme();
				WordCloud(document.getElementById('wordcloud-canvas'),
					{
						clearCanvas: clearCanvas,
						drawOutOfBound: drawOutOfBound,
						list: wordcloundContent,
						gridSize: gridSize,
						weightFactor: weightFactor,
						rotateRatio: rotateRatio,
						fontFamily: fontFamily,
						color: color,
						hover: WordcloudCanvas.wordcloudHover,
						click: WordcloudCanvas.wordcloudClick,
						backgroundColor: backgroundColor,
						wait: wait
					});
			} else if (!NavigatorCheck.isSmartphone() && !Session.get('isLandingPagePomodoroActive')) {
				PomodoroTimer.setCloudShown(true);
				this.setConfig();
				let wordcloundContent = this.getContent();
				if (Meteor.settings.public.welcome.fakeStatistics) {
					this.setWordcloudTheme();
					WordCloud(document.getElementById('wordcloud-canvas'),
						{
							clearCanvas: clearCanvas,
							drawOutOfBound: drawOutOfBound,
							list: wordcloundContent,
							gridSize: gridSize,
							weightFactor: weightFactor,
							rotateRatio: rotateRatio,
							fontFamily: fontFamily,
							color: function (word) {
								for (let i = 0; i < wordcloundContent.length; i++) {
									if (word === wordcloundContent[i][0]) {
										return wordcloundContent[i][3];
									}
								}
							},
							backgroundColor: backgroundColor,
							wait: wait
						});
				} else {
					this.setWordcloudTheme();
					WordCloud(document.getElementById('wordcloud-canvas'),
						{
							clearCanvas: clearCanvas,
							drawOutOfBound: drawOutOfBound,
							list: wordcloundContent,
							gridSize: gridSize,
							weightFactor: weightFactor,
							rotateRatio: rotateRatio,
							fontFamily: fontFamily,
							color: color,
							hover: WordcloudCanvas.wordcloudHover,
							click: WordcloudCanvas.wordcloudClick,
							backgroundColor: backgroundColor,
							wait: wait
						});
				}
			} else {
				PomodoroTimer.setCloudShown(false);
			}
		} else {
			setTimeout(function () {
				WordcloudCanvas.draw();
			}, 100);
		}
	}

	static setCanvasSize () {
		if (Meteor.userId()) {
			document.getElementById('wordcloud-canvas').width = ($('#wordcloud-container').width());
			let filterNavigation = $('#filter-nav-wrapper');
			document.getElementById('wordcloud-canvas').height = ($(window).height() - (filterNavigation.offset().top + filterNavigation.height()) - 30);
		} else {
			let newWidth = $('#wordcloud-container').width();
			if (newWidth > 1024) {
				newWidth = 1024;
			}
			document.getElementById('wordcloud-canvas').width = newWidth;
			let newHeight = $(window).height() - ($('#welcome').outerHeight(true) + $('#welcome-login').outerHeight(true));
			if (!NavigatorCheck.isSmartphone() && !Session.get('isLandingPagePomodoroActive')) {
				document.getElementById('wordcloud-canvas').height = newHeight;
				$('.pomodoroClock').css('height', 'unset');
			} else {
				$('#pomodoroTimerWordcloudContainer .pomodoroClock').css('margin-top', newHeight * ((1 - wordcloudPomodoroSize) / 2));
				$('#pomodoroTimerWordcloudContainer .pomodoroClock').css('height', newHeight * wordcloudPomodoroSize);
				this.disableWordcloud();
			}
		}
	}

	static wordcloudClick (item) {
		Session.set('wordcloudItem', item[2]);
		$('#wordcloudModal').modal('show');
	}

	static wordcloudHover (item, dimension) {
		if (dimension !== undefined) {
			$('#wordcloud-canvas').css('cursor', 'pointer');
		} else {
			$('#wordcloud-canvas').css('cursor', 'unset');
			$('.wordcloud-tooltip').css('display', 'none');
		}
	}

	static enableWordcloud () {
		if (NavigatorCheck.gotFeatureSupport(2)) {
			Session.set('filterDisplayWordcloud', true);
			this.setWordcloudTheme();
		} else {
			this.disableWordcloud();
		}
	}

	static disableWordcloud () {
		Session.set('filterDisplayWordcloud', false);
		this.setWordcloudTheme();
	}

	static setWordcloudTheme () {
		if (Meteor.userId()) {
			if (FilterNavigation.isDisplayWordcloudActive(FilterNavigation.getRouteId())) {
				$('html').attr('id', 'theme-wrapper-wordcloud');
			} else {
				$('html').attr('id', 'theme-wrapper');
			}
		} else {
			$('html').attr('id', 'theme-wrapper-welcome');
		}
	}

	static getContent () {
		let cloud = {};
		let minimumSize = 1;
		let biggestCardsetSize = 1;
		let list = [];
		if (Meteor.userId()) {
			cloud = Cardsets.find(Filter.getFilterQuery()).fetch();
		} else {
			if (Meteor.settings.public.welcome.fakeStatistics) {
				cloud = new ReactiveVar(fakeWordCloud).curValue.default;
			} else {
				cloud = Cardsets.find({wordcloud: true}, {fields: {name: 1, quantity: 1}}).fetch();
			}
		}
		cloud.forEach(function (cloud) {
			if (cloud.quantity > biggestCardsetSize) {
				biggestCardsetSize = cloud.quantity;
			}
		});

		cloud.forEach(function (cloud) {
			let name = cloud.name;

			if (name.length > 30) {
				name = name.substring(0, 30) + "…";
			}
			let quantitiy = cloud.quantity / biggestCardsetSize * 5;
			quantitiy = (quantitiy > minimumSize ? quantitiy : minimumSize);
			list.push([name, Number(quantitiy), cloud._id, cloud.color]);
		});
		list.sort(function (a, b) {
			return (b[0].length * b[1]) - (a[0].length * a[1]);
		});
		return list;
	}

	static setDefaultView () {
		if (NavigatorCheck.isSmartphone()) {
			this.disableWordcloud();
		} else if (Cardsets.find(Filter.getFilterQuery()).count() >= defaultToFilterWordcloudThreshold || Session.get('filterDisplayWordcloud')) {
			this.enableWordcloud();
		} else {
			this.disableWordcloud();
		}
	}
};
