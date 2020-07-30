import {ServerStyle} from "./styles";
import {AUTO_FULLSCREEN, MANUAL_FULLSCREEN, CHOOSE_FULLSCREEN} from "../config/server";
import {Session} from "meteor/session";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {CardVisuals} from "./cardVisuals";
import {SweetAlertMessages} from "./sweetAlert";
import {Route} from "./route";
import * as RouteNames from "./routeNames.js";

export let editorFullScreenActive = false;

export let Fullscreen = class Fullscreen {

	static isActive () {
		return Session.get('fullscreen');
	}

	static isEditorFullscreenActive () {
		return editorFullScreenActive;
	}

	static getChooseMode () {
		return Session.get('chooseFullscreenMode');
	}

	static getChooseModeSession () {
		switch (FlowRouter.getRouteName()) {
			case RouteNames.demo:
			case RouteNames.demolist:
				return Session.get('fullscreenDemoSession');
			case RouteNames.box:
				return Session.get('fullscreenLeitnerSession');
			case RouteNames.memo:
				return Session.get('fullscreenWozniakSession');
			default:
				return Session.get('fullscreenPresentationSession');
		}
	}

	static setChooseModeSession (mode) {
		switch (FlowRouter.getRouteName()) {
			case RouteNames.demo:
			case RouteNames.demolist:
				Session.set('fullscreenDemoSession', mode);
				break;
			case RouteNames.box:
				Session.set('fullscreenLeitnerSession', mode);
				break;
			case RouteNames.memo:
				Session.set('fullscreenWozniakSession', mode);
				break;
			default:
				Session.set('fullscreenPresentationSession', mode);
				break;
		}
	}

	static resetChooseModeSessions (filter = undefined) {
		if (filter === undefined) {
			Session.set('fullscreenPresentationSession', 0);
			Session.set('fullscreenDemoSession', 0);
			Session.set('fullscreenLeitnerSession', 0);
			Session.set('fullscreenWozniakSession', 0);
		} else {
			switch (filter) {
				case 0:
					Session.set('fullscreenPresentationSession', 0);
					break;
				case 1:
					Session.set('fullscreenDemoSession', 0);
					break;
				case 2:
					Session.set('fullscreenLeitnerSession', 0);
					break;
				case 3:
					Session.set('fullscreenWozniakSession', 0);
					break;
			}
		}
	}

	static setChooseMode (mode) {
		switch (mode) {
			case 0:
				Session.set('chooseFullscreenMode', 0);
				break;
			case AUTO_FULLSCREEN:
				Session.set('chooseFullscreenMode', AUTO_FULLSCREEN);
				this.enable();
				break;
			case MANUAL_FULLSCREEN:
				Session.set('chooseFullscreenMode', MANUAL_FULLSCREEN);
				break;
		}
	}

	static setMode () {
		let mode = ServerStyle.getFullscreenMode();

		switch (mode) {
			case AUTO_FULLSCREEN:
				this.enable();
				break;
			case MANUAL_FULLSCREEN:
				break;
			case CHOOSE_FULLSCREEN:
				if (this.getChooseMode() === 0) {
					SweetAlertMessages.chooseFullscreenMode();
				}
				break;
		}
	}

	static toggle (isMarkdeepEditor = false) {
		if (this.isActive()) {
			this.disable();
		} else {
			this.enable(isMarkdeepEditor);
		}
	}

	static disable () {
		Session.set('dictionaryBeolingus', 0);
		Session.set('dictionaryLinguee', 0);
		Session.set('dictionaryGoogle', 0);
		if (!Route.isRouteWithFullscreenFeature()) {
			this.setChooseMode(0);
		}
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}
		$("#theme-wrapper").removeClass('theme-wrapper-fullscreen');
		$(".editorElement").css("display", '');
		$("#preview").css("display", "unset");
		$("#markdeepNavigation").css("display", '');
		$("#markdeepEditorContent").css("display", '');
		$(".fullscreen-button").removeClass("pressed");
		let card_id;
		if (FlowRouter.getParam('card_id')) {
			card_id = FlowRouter.getParam('card_id');
		} else {
			card_id = "-1";
		}
		$("#collapseLecture-" + card_id).removeClass('in');
		editorFullScreenActive = false;
		Session.set('fullscreen', false);
		CardVisuals.resizeFlashcard();
	}

	static enable (isMarkdeepEditor = false) {
		Session.set('dictionaryBeolingus', 0);
		Session.set('dictionaryLinguee', 0);
		Session.set('dictionaryGoogle', 0);
		if (document.fullscreenElement === null && !isMarkdeepEditor) {
			document.documentElement.requestFullscreen();
		}
		$(".box").removeClass("disableCardTransition");
		$("#theme-wrapper").addClass('theme-wrapper-fullscreen');
		$(".editorElement").css("display", "none");
		if (isMarkdeepEditor) {
			$("#preview").css("display", "none");
			editorFullScreenActive = true;
			$(".fullscreen-button").addClass("pressed");
		} else {
			$("#markdeepNavigation").css("display", "none");
			$("#markdeepEditorContent").css("display", 'none');
		}
		Session.set('fullscreen', true);
		CardVisuals.resizeFlashcard();
	}
};
