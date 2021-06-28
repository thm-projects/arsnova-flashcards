import {Meteor} from "meteor/meteor";
import * as serverConf from "../config/serverStyle/exportStyle.js";
import * as backgroundsConf from "../config/backgrounds.js";
import {UserPermissions} from "./permissions";
import {MainNavigation} from "./mainNavigation";
import {Route} from "./route";
import * as RouteNames from "../util/routeNames.js";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {EDU, FREE, GUEST, LECTURER, PRO, SERVER_VERSION} from "../config/serverStyle/style/global/const";
import {CardsetNavigation} from "./cardsetNavigation";
import {Session} from "meteor/session";

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
		let config = this.getConfig();
		switch (config.language.client) {
			case "de":
				return this.getConfig().welcome.title.slogan_de;
			case "en":
				return this.getConfig().welcome.title.slogan_en;
		}
	}

	static getAboutButton (isMobile = false) {
		let config = this.getConfig();
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
			case "cards":
				return settings.login.cards.enabled;
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

	static getGitlabLink () {
		return this.getConfig().error.errorReporting.gitlabLink;
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

	static gotSimplifiedNav () {
		return this.getConfig().navigationFeatures.simplifiedNav;
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
		let config = this.getConfig();
		return config.demo.arsnovaClick;
	}

	static getDemoFragJetzt () {
		let config = this.getConfig();
		return config.demo.fragJetzt;
	}

	static getMarkdeepFormatingPath () {
		let config = this.getConfig();
		return config.help.markdeepFormatingCardsetID;
	}

	static getDefaultThemeID () {
		return this.getConfig().themes.default;
	}

	static getActiveTheme () {
		let config = this.getConfig().themes;
		return config.list.filter(object => {
			return object.theme === Session.get('theme');
		})[0];
	}

	static getAppThemes () {
		let config = this.getConfig().themes;
		return config.list;
	}

	static adjustForLandingPageBackground (backgrounds, target = "") {
		if (target['background-image'] === "none" || target['background-image'].trim().length === 0) {
			target = backgrounds["landing-page"];
		}
		return target;
	}

	static adjustForInternalBackground (backgrounds, target = "") {
		if (target['background-image'] === "none" || target['background-image'].trim().length === 0) {
			target = backgrounds.internal;
		}
		return target;
	}

	static adjustForCardsetBackground (backgrounds, target = "") {
		if (target['background-image'] === "none" || target['background-image'].trim().length === 0) {
			target = backgrounds.cardset;
		}
		return this.adjustForInternalBackground(backgrounds, target);
	}

	static getBackground (type) {
		let backgrounds;
		let backgroundObject = "";
		backgrounds = backgroundsConf[this.getActiveTheme().backgrounds];
		if (Route.isCardsetGroup() && !CardsetNavigation.doesCardsetExist(FlowRouter.current().params._id)) {
			backgroundObject = this.adjustForInternalBackground(backgrounds, backgrounds.notFound);
		} else {
			switch (type) {
				case "landing-page":
				case "demo":
				case "demoIndex":
				case "internal":
				case "backend":
				case "wordcloud":
					backgroundObject = backgrounds[type];
					break;
				case "pool":
				case "workload":
				case "personal":
				case "transcripts":
				case "allPool":
				case "cardset":
				case "presentation":
				case "presentationIndex":
				case "leitner":
				case "wozniak":
				case "editor":
				case "profileSettings":
				case "profileMembership":
				case "profileBilling":
				case "profileRequests":
					backgroundObject = this.adjustForInternalBackground(backgrounds, backgrounds[type]);
					break;
				case "cardsetLeitnerStats":
				case "cardsetTranscriptBonus":
					backgroundObject = this.adjustForCardsetBackground(backgrounds, backgrounds[type]);
					break;
				case "agb":
				case "datenschutz":
				case "faq":
				case "help":
				case "impressum":
				case "about":
				case "learning":
					backgroundObject = this.adjustForLandingPageBackground(backgrounds, backgrounds[type]);
					break;
				case "notFound":
					if (UserPermissions.canAccessFrontend()) {
						backgroundObject = this.adjustForInternalBackground(backgrounds, backgrounds.notFound);
					} else {
						backgroundObject = this.adjustForLandingPageBackground(backgrounds, backgrounds.notFound);
					}
					break;
			}
		}
		return backgroundObject;
	}

	static gotFullscreenSettingsAccess (modeFilter = undefined) {
		let highestRole = UserPermissions.getHighestRole(true);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isAdmin()) {
			return true;
		} else {
			let config = this.getConfig();
			let fullscreenSettings = config.fullscreen.settings;
			if (modeFilter === undefined) {
				return fullscreenSettings.enabled.includes(highestRole);
			} else {
				switch (modeFilter) {
					case 1:
						return fullscreenSettings.presentation.includes(highestRole);
					case 2:
						return fullscreenSettings.demo.includes(highestRole);
					case 3:
						return fullscreenSettings.leitner.includes(highestRole);
					case 4:
						return fullscreenSettings.wozniak.includes(highestRole);
				}
			}
		}
	}

	static getFullscreenMode () {
		switch (FlowRouter.current().route.name) {
			// Presentation Triggers
			case RouteNames.presentation:
			case RouteNames.presentationlist:
			case RouteNames.presentationTranscriptBonusCardset:
			case RouteNames.presentationTranscriptReview:
			case RouteNames.presentationTranscriptPersonal:
			case RouteNames.presentationTranscriptBonus:
				if (this.gotFullscreenSettingsAccess() && this.gotFullscreenSettingsAccess(1)) {
					return Meteor.user().fullscreen.settings.presentation;
				} else {
					return this.getDefaultFullscreenMode(1);
				}
				break;
			// Demo Triggers
			case RouteNames.demo:
			case RouteNames.demolist:
			case RouteNames.making:
			case RouteNames.makinglist:
				if (this.gotFullscreenSettingsAccess() && this.gotFullscreenSettingsAccess(2)) {
					return Meteor.user().fullscreen.settings.demo;
				} else if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
					return this.getDefaultFullscreenMode(2);
				} else {
					return this.getDefaultFullscreenMode(5);
				}
				break;
			// Leitner Trigger
			case RouteNames.box:
				if (this.gotFullscreenSettingsAccess() && this.gotFullscreenSettingsAccess(3)) {
					return Meteor.user().fullscreen.settings.leitner;
				} else {
					return this.getDefaultFullscreenMode(3);
				}
				break;
			// Wozniak Trigger
			case RouteNames.memo:
				if (this.gotFullscreenSettingsAccess() && this.gotFullscreenSettingsAccess(4)) {
					return Meteor.user().fullscreen.settings.wozniak;
				} else {
					return this.getDefaultFullscreenMode(4);
				}
				break;
			default:
				return this.getDefaultFullscreenMode(6);
		}
	}

	static getDefaultFullscreenMode (mode, userId) {
		let highestRole = UserPermissions.getHighestRole(false, userId);
		let config = this.getConfig();
		let fullscreenDefaults = config.fullscreen.defaults;
		let landingPage = 'landingPage';
		switch (mode) {
			// Presentation
			case 1:
				return fullscreenDefaults[highestRole].presentation;
			// Demo
			case 2:
				return fullscreenDefaults[highestRole].demo;
			// Leitner
			case 3:
				return fullscreenDefaults[highestRole].leitner;
			// Wozniak
			case 4:
				return fullscreenDefaults[highestRole].wozniak;
			// Landing-Page Demo
			case 5:
				return fullscreenDefaults[landingPage].demo;
		}
	}

	static debugServerBoot () {
		let config = this.getConfig();
		return config.debugServerBoot;
	}

	static getServerVersion () {
		return SERVER_VERSION;
	}

	static getNotificationsBlacklist () {
		let config = this.getConfig();
		return config.notificationsBlacklist;
	}
};
