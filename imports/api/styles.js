import {Meteor} from "meteor/meteor";
import * as serverConf from "../config/server.js";
import * as backgroundsConf from "../config/backgrounds.js";
import {UserPermissions} from "./permissions";
import {MainNavigation} from "./mainNavigation";
import {Route} from "./route";

const FREE = 0;
const EDU = 1;
const PRO = 2;
const LECTURER = 3;
const GUEST = 4;

export let ServerStyle = class ServerStyle {

	static getAppTitle () {
		return `${this.getFirstAppTitle()}.${this.getLastAppTitle()}`;
	}

	static getFirstAppTitle () {
		return this.getConfig().welcome.title.first;
	}

	static gotLandingPageWordcloud () {
		return this.getConfig().welcome.wordcloud.enabled;
	}

	static getLastAppTitle () {
		return this.getConfig().welcome.title.last;
	}

	static exitDemoOnFullscreenBackgroundClick () {
		return this.getConfig().demo.exitOnFullscreenBackgroundClick;
	}

	static exitPresentationOnFullscreenBackgroundClick () {
		return this.getConfig().presentation.exitOnFullscreenBackgroundClick;
	}

	static gotDemoAutoFullscreen () {
		return this.getConfig().demo.autoFullscreen;
	}

	static getHelpStyle () {
		return this.getConfig().help.style;
	}

	static getAppSlogan () {
		let config  = this.getConfig();
		switch (config.language.client) {
			case "de":
				return this.getConfig().welcome.title.slogan_de;
			case "en":
				return this.getConfig().welcome.title.slogan_en;
		}
	}

	static getAboutButton (isMobile = false) {
		let config  = this.getConfig();
		if (isMobile) {
			switch (config.language.client) {
				case "de":
					return this.getConfig().welcome.button.about.mobile_de;
				case "en":
					return this.getConfig().welcome.button.about.mobile_en;
			}
		} else {
			switch (config.language.client) {
				case "de":
					return this.getConfig().welcome.button.about.default_de;
				case "en":
					return this.getConfig().welcome.button.about.default_en;
			}
		}
	}

	static getConfig () {
		switch (Meteor.settings.public.dynamicSettings) {
			case "debug":
				return serverConf.debug;
			case "linux":
				return serverConf.linux;
			case "review":
				return serverConf.review;
			case "staging":
				return serverConf.staging;
			default:
				return serverConf.defaultSettings;
		}
	}

	static gotNavigationFeature (feature, addRoutePath = false) {
		if (!Meteor.isServer) {
			if ((Route.isAll() || Route.isShuffle() || Route.isEditShuffle() || Route.isTranscriptBonus()) && (feature === "wordcloud" || feature === 'filter' || feature === 'search')) {
				return true;
			}
		}
		if (!Meteor.isServer && addRoutePath) {
			let route = "";
			if (Route.isPublic()) {
				route += "public.";
				if (Route.isPool()) {
					route += "cardset.";
				} else {
					route += "repetitorium.";
				}
			} else if (Route.isPersonal()) {
				route += "personal.";
				if (Route.isMyCardsets()) {
					route += "cardset.";
				} else {
					route += "repetitorium.";
				}
			} else if (Route.isTranscript()) {
				route += "transcript.";
				if (Route.isMyTranscripts()) {
					route += "personal.";
				} else {
					route += "bonus.";
				}
			}
			feature = route + feature;
		}
		let featurePath = feature.split('.');
		if (featurePath.length < 3) {
			return false;
		}
		if (UserPermissions.isAdmin()) {
			return true;
		}
		let userType = -1;

		if (UserPermissions.isLecturer()) {
			userType = LECTURER;
		} else if (UserPermissions.isPro()) {
			userType = PRO;
		} else if (UserPermissions.isEdu()) {
			userType = EDU;
		} else if (UserPermissions.isSocialLogin()) {
			userType = FREE;
		} else {
			if (Meteor.isServer) {
				if (!Meteor.user() && this.isLoginEnabled("guest")) {
					userType = GUEST;
				}
			} else {
				if (!Meteor.user() && MainNavigation.isGuestLoginActive()) {
					userType = GUEST;
				}
			}
		}
		if (userType !== -1) {
			let navigationFeatures = this.getConfig().navigationFeatures;
			if (navigationFeatures[featurePath[0]][featurePath[1]][featurePath[2]] !== undefined) {
				return navigationFeatures[featurePath[0]][featurePath[1]][featurePath[2]].includes(userType);
			}
		}
	}

	static isLoginEnabled (loginType) {
		let settings = this.getConfig();
		switch (loginType) {
			case "cas":
				return settings.login.cas;
			case "guest":
				return settings.login.guest;
			case "pro":
				return settings.login.pro;
			case "google":
				return settings.login.google;
			case "twitter":
				return settings.login.twitter;
			case "facebook":
				return settings.login.facebook;
			case "backdoor":
				return Meteor.settings.public.backdoorEnabled;
		}
	}

	static getClientLanguage () {
		return this.getConfig().language.client;
	}

	static getDemoFolder () {
		return this.getConfig().demo.folder;
	}

	static getServerLanguage () {
		return this.getConfig().language.server;
	}

	static gotTranscriptsEnabled () {
		return this.getConfig().transcripts.enabled;
	}

	static gotCenteredLandingPagePomodoro () {
		return this.getConfig().welcome.centeredLandingPagePomodoro;
	}

	static getUserRolesWithCreatePermission () {
		let usersWithPermission = this.getConfig().roles.create;
		let list = ['admin', 'editor'];
		if (usersWithPermission.standard === true) {
			list.push('standard');
		}
		if (usersWithPermission.edu === true) {
			list.push('university');
		}
		if (usersWithPermission.lecturer === true) {
			list.push('lecturer');
		}
		if (usersWithPermission.pro === true) {
			list.push('pro');
		}
		return list;
	}

	static newUser (feature) {
		switch (feature) {
			case "mail":
				return this.getConfig().newUser.enabledNotifications.mail;
			case "web":
				return this.getConfig().newUser.enabledNotifications.web;
		}
	}

	static getDemoArsnovaClick () {
		let config  = this.getConfig();
		return config.demo.arsnovaClick;
	}

	static getDemoFragJetzt () {
		let config  = this.getConfig();
		return config.demo.fragJetzt;
	}

	static getMarkdeepFormatingPath () {
		let config = this.getConfig();
		return config.help.markdeepFormatingCardsetID;
	}

	static getDefaultTheme () {
		let config = this.getConfig().themes;
		return config.list[config.defaultID].theme;
	}

	static adjustForLandingPageBackground (backgrounds, target = "") {
		if (target === "none" || target.trim().length === 0)  {
			target = backgrounds["landing-page"];
		}
		return target;
	}

	static adjustForInternalBackground (backgrounds, target = "") {
		if (target === "none" || target.trim().length === 0)  {
			target = backgrounds.internal;
		}
		return target;
	}

	static adjustForCardsetBackground (backgrounds, target = "") {
		if (target === "none" || target.trim().length === 0)  {
			target = backgrounds.cardset;
		}
		return this.adjustForInternalBackground(backgrounds, target);
	}

	static getBackground (type) {
		let backgrounds;
		let none = "none";
		let backgroundSring = "";
		let config = this.getConfig().themes;
		backgrounds = backgroundsConf[config.list[config.defaultID].backgrounds];
		switch (type) {
			case "landing-page":
				backgroundSring = backgrounds["landing-page"];
				break;
			case "demo":
				backgroundSring = backgrounds.demo;
				break;
			case "demoIndex":
				backgroundSring = backgrounds.demoIndex;
				break;
			case "internal":
				backgroundSring = backgrounds.internal;
				break;
			case "pool":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.pool);
				break;
			case "workload":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.workload);
				break;
			case "personal":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.personal);
				break;
			case "transcripts":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.transcripts);
				break;
			case "allPool":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.allPool);
				break;
			case "cardset":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.cardset);
				break;
			case "cardsetLeitnerStats":
				backgroundSring = this.adjustForCardsetBackground(backgrounds, backgrounds.cardsetLeitnerStats);
				break;
			case "cardsetTranscriptBonus":
				backgroundSring = this.adjustForCardsetBackground(backgrounds, backgrounds.cardsetTranscriptBonus);
				break;
			case "presentation":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.presentation);
				break;
			case "presentationIndex":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.presentationIndex);
				break;
			case "leitner":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.leitner);
				break;
			case "wozniak":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.wozniak);
				break;
			case "editor":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.editor);
				break;
			case "profileSettings":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.profileSettings);
				break;
			case "profileMembership":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.profileMembership);
				break;
			case "profileBilling":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.profileBilling);
				break;
			case "profileRequests":
				backgroundSring = this.adjustForInternalBackground(backgrounds, backgrounds.profileRequests);
				break;
			case "agb":
				backgroundSring = this.adjustForLandingPageBackground(backgrounds, backgrounds.agb);
				break;
			case "datenschutz":
				backgroundSring = this.adjustForLandingPageBackground(backgrounds, backgrounds.datenschutz);
				break;
			case "faq":
				backgroundSring = this.adjustForLandingPageBackground(backgrounds, backgrounds.faq);
				break;
			case "help":
				backgroundSring = this.adjustForLandingPageBackground(backgrounds, backgrounds.help);
				break;
			case "impressum":
				backgroundSring = this.adjustForLandingPageBackground(backgrounds, backgrounds.impressum);
				break;
			case "about":
				backgroundSring = this.adjustForLandingPageBackground(backgrounds, backgrounds.about);
				break;
			case "learning":
				backgroundSring = this.adjustForLandingPageBackground(backgrounds, backgrounds.learning);
				break;
			case "backend":
				backgroundSring = backgrounds.backend;
				break;
		}
		if (backgroundSring === none) {
			return backgroundSring;
		} else {
			return "url('" + backgroundSring + "')";
		}
	}
};
