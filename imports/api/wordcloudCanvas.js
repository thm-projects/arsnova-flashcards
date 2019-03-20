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
import * as config from "../config/wordcloud.js";
import {Route} from "./route";
import {MainNavigation} from "./mainNavigation";
Session.setDefault('firstTimeWordcloudModalLandingPage', true);
Session.setDefault('firstTimeWordcloudModalFilter', true);
let canvasSettings;
let firstTimeWordcloudModalLandingPage = 'isFirstTimeWordcloudModalLandingPage';
let firstTimeWordcloudModalFilter = 'isFirstTimeWordcloudModalFilter';

export let WordcloudCanvas = class WordcloudCanvas {

	static setConfig () {
		if (Meteor.userId() || MainNavigation.isGuestLoginActive()) {
			canvasSettings = config.wordcloudDefault;
		} else {
			canvasSettings = config.wordcloudLandingPage;
		}
	}

	static displayHelpModal () {
		if (Route.isHome() && config.displayHelpModalSettings.landingPage.active) {
			switch (config.displayHelpModalSettings.landingPage.type) {
				case 0:
					if (localStorage.getItem(firstTimeWordcloudModalLandingPage) === undefined || localStorage.getItem(firstTimeWordcloudModalLandingPage) === null) {
						localStorage.setItem(firstTimeWordcloudModalLandingPage, "true");
						return true;
					}
					break;
				case 1:
					if (Session.get('firstTimeWordcloudModalLandingPage')) {
						Session.set('firstTimeWordcloudModalLandingPage');
						return true;
					}
					break;
				case 2:
					return true;
			}
		} else if (Route.isFilterIndex() && config.displayHelpModalSettings.filter.active) {
			switch (config.displayHelpModalSettings.filter.type) {
				case 0:
					if (localStorage.getItem(firstTimeWordcloudModalFilter) === undefined || localStorage.getItem(firstTimeWordcloudModalFilter) === null) {
						localStorage.setItem(firstTimeWordcloudModalFilter, "true");
						return true;
					}
					break;
				case 1:
					if (Session.get('firstTimeWordcloudModalFilter')) {
						Session.set('firstTimeWordcloudModalFilter');
						return true;
					}
					break;
				case 2:
					return true;
			}
		}
	}

	static draw () {
		if (document.getElementById('wordcloud-canvas') !== null) {
			this.setCanvasSize();
			if (!NavigatorCheck.isSmartphone() && (Meteor.userId() || MainNavigation.isGuestLoginActive())) {
				PomodoroTimer.setCloudShown(true);
				this.setConfig();
				this.setWordcloudTheme();
				canvasSettings.list = this.getContent();
				canvasSettings.hover = WordcloudCanvas.wordcloudHover;
				canvasSettings.click = WordcloudCanvas.wordcloudClick;
				WordCloud(document.getElementById('wordcloud-canvas'), canvasSettings);
			} else if (!NavigatorCheck.isSmartphone() && !Session.get('isLandingPagePomodoroActive')) {
				PomodoroTimer.setCloudShown(true);
				this.setConfig();
				canvasSettings.list = this.getContent();
				if (Meteor.settings.public.welcome.fakeStatistics) {
					this.setWordcloudTheme();
					canvasSettings.color = function (word) {
						for (let i = 0; i < canvasSettings.list.length; i++) {
							if (word === canvasSettings.list[i][0]) {
								return canvasSettings.list[i][3];
							}
						}
					};
					WordCloud(document.getElementById('wordcloud-canvas'), canvasSettings);
				} else {
					this.setWordcloudTheme();
					canvasSettings.hover = WordcloudCanvas.wordcloudHover;
					canvasSettings.click = WordcloudCanvas.wordcloudClick;
					WordCloud(document.getElementById('wordcloud-canvas'), canvasSettings);
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
		if (Meteor.userId() || MainNavigation.isGuestLoginActive()) {
			document.getElementById('wordcloud-canvas').width = ($('#wordcloud-container').width());
			document.getElementById('wordcloud-canvas').height = ($(window).height() - $('#wordcloud-container').offset().top - 30);
			let canvas = $('#wordcloud-canvas');
			let canvas_background = $('#wordcloud-canvas-background');
			canvas_background.height(canvas.height());
			canvas_background.width(canvas.width());
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
				let canvas = $('#wordcloud-canvas');
				let canvas_background = $('#wordcloud-canvas-background');
				canvas_background.css('left', canvas.offset().left);
				canvas_background.height(canvas.height());
				canvas_background.width(canvas.width());
			} else {
				$('#pomodoroTimerWordcloudContainer .pomodoroClock').css('margin-top', newHeight * ((1 - config.wordcloudPomodoroSize) / 2));
				$('#pomodoroTimerWordcloudContainer .pomodoroClock').css('height', newHeight * config.wordcloudPomodoroSize);
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
			$('#wordcloud-hover-box').css('display', 'block');
			let canvas = $('#wordcloud-canvas');
			let leftOffset = canvas.offset().left;
			if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
				leftOffset = parseInt($('#wordcloud-container').css('padding-left'));
			}
			$('#wordcloud-hover-box').css({
				left: leftOffset + dimension.x + 'px',
				top: dimension.y + 'px',
				width: dimension.w + 'px',
				height: dimension.h + 'px'
			});
		} else {
			$('#wordcloud-canvas').css('cursor', 'unset');
			$('#wordcloud-hover-box').css('display', 'none');
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
		if (Meteor.userId() || MainNavigation.isGuestLoginActive()) {
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
		if (Meteor.userId() || MainNavigation.isGuestLoginActive()) {
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
			let quantitiy = cloud.quantity / biggestCardsetSize * 4;
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
		} else if (Cardsets.find(Filter.getFilterQuery()).count() >= config.defaultToFilterWordcloudThreshold || Session.get('filterDisplayWordcloud')) {
			this.enableWordcloud();
		} else {
			this.disableWordcloud();
		}
	}
};
