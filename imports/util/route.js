import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import * as icons from "../config/icons.js";
import * as conf from "../config/routes.js";
import {Cardsets} from "../api/subscriptions/cardsets";
import {ServerStyle} from "./styles";
import {UserPermissions} from "./permissions";
import {getAuthorName} from "./userData";
import * as RouteNames from "./routeNames";
let firstTimeVisit = 'isFirstTimeVisit';

export let Route = class Route {
	static isCardsetGroup () {
		return this.isCardset() || this.isCardsetDetails() || this.isBox() || this.isMemo() || this.isCardsetLeitnerStats() || this.isEditMode();
	}

	static isCardsetDetails () {
		return FlowRouter.getRouteName() === RouteNames.cardsetdetailsid;
	}

	/**
	 * Function checks if route is a Cardset
	 * @return {Boolean} Return true, when route is a Cardset.
	 */
	static isCardset () {
		return (this.isCardsetDetails() || FlowRouter.getRouteName() === RouteNames.cardsetcard);
	}

	/**
	 * Function checks if route is a card edit Mode
	 * @return {Boolean} Return true, when route is new Card or edit Card.
	 */
	static isEditMode () {
		return this.isNewCard() || this.isEditCard() | this.isNewTranscript() | this.isEditTranscript();
	}

	static isNewCard () {
		return FlowRouter.getRouteName() === RouteNames.newCard || this.isNewTranscript();
	}

	static requiresUserInputForFullscreen () {
		return (this.isPresentation() || this.isBox() || this.isMemo());
	}

	static isEditCard () {
		return FlowRouter.getRouteName() === RouteNames.editCard || this.isEditTranscript();
	}

	static isLearningMode () {
		return (this.isBox() || this.isMemo());
	}

	static isDemo () {
		return FlowRouter.getRouteName() === RouteNames.demo || this.isDemoList();
	}

	static isDemoList () {
		return FlowRouter.getRouteName() === RouteNames.demolist;
	}

	static gotIndexHotkey () {
		return this.isDemo() || this.isCardset() || this.isPresentation() || this.isMakingOf();
	}

	static isMakingOf () {
		return FlowRouter.getRouteName() === RouteNames.making || this.isMakingOfList();
	}

	static isTranscript () {
		return this.isMyTranscripts() || this.isMyBonusTranscripts() || this.isNewTranscript() || this.isEditTranscript() || this.isPresentationTranscript() || this.isPresentationTranscriptBonus() || this.isPresentationTranscriptBonusCardset() || this.isPresentationTranscriptReview();
	}

	static isPresentationTranscript () {
		return this.isPresentationTranscriptPersonal() || this.isPresentationTranscriptBonus() || this.isPresentationTranscriptBonusCardset();
	}

	static isPresentationTranscriptPersonal () {
		return FlowRouter.getRouteName() === RouteNames.presentationTranscriptPersonal;
	}

	static isPresentationTranscriptReview () {
		return FlowRouter.getRouteName() === RouteNames.presentationTranscriptReview;
	}

	static isPresentationTranscriptBonus () {
		return FlowRouter.getRouteName() === RouteNames.presentationTranscriptBonus;
	}

	static isPresentationTranscriptBonusCardset () {
		return FlowRouter.getRouteName() === RouteNames.presentationTranscriptBonusCardset;
	}

	static isNewTranscript () {
		return FlowRouter.getRouteName() === RouteNames.newTranscript;
	}

	static isEditTranscript () {
		return FlowRouter.getRouteName() === RouteNames.editTranscript;
	}

	static isMakingOfList () {
		return FlowRouter.getRouteName() === RouteNames.makinglist;
	}

	static isProfile () {
		return this.isProfileBilling() || this.isProfileMembership() || this.isProfileSettings() || this.isProfileRequests();
	}

	static isProfileMembership () {
		return FlowRouter.getRouteName() === RouteNames.profileMembership;
	}

	static isProfileBilling () {
		return FlowRouter.getRouteName() === RouteNames.profileBilling;
	}

	static isProfileSettings () {
		return FlowRouter.getRouteName() === RouteNames.profileSettings;
	}

	static isProfileRequests () {
		return FlowRouter.getRouteName() === RouteNames.profileRequests;
	}

	static isAGB () {
		return FlowRouter.getRouteName() === RouteNames.agb;
	}

	static isAbout () {
		return FlowRouter.getRouteName() === RouteNames.about;
	}

	static isImpressum () {
		return FlowRouter.getRouteName() === RouteNames.impressum;
	}

	static isDatenschutz () {
		return FlowRouter.getRouteName() === RouteNames.datenschutz;
	}

	static isLearning () {
		return FlowRouter.getRouteName() === RouteNames.learning;
	}

	static isFaq () {
		return FlowRouter.getRouteName() === RouteNames.faq;
	}

	static isHelp () {
		return FlowRouter.getRouteName() === RouteNames.help;
	}

	static isBackend () {
		if (FlowRouter.getRouteName() !== undefined) {
			return FlowRouter.getRouteName().substring(0, 5) === "admin";
		} else {
			return false;
		}
	}

	static isTableOfContent () {
		return (this.isPresentationList() || this.isDemoList() || this.isMakingOfList()) ;
	}

	/**
	 * Function checks if route is a presentation view
	 * @return {Boolean} Return true, when route is a presentation view.
	 */
	static isPresentation () {
		return (this.isDefaultPresentation() || this.isPresentationList() || this.isPresentationTranscript() || this.isPresentationTranscriptReview());
	}

	static isDefaultPresentation () {
		return FlowRouter.getRouteName() === RouteNames.presentation;
	}

	static isPresentationList () {
		return FlowRouter.getRouteName() === RouteNames.presentationlist;
	}

	static isPresentationViewList () {
		return this.isPresentationList() || this.isMakingOfList() || this.isDemoList();
	}

	static isPresentationOrDemo () {
		return this.isPresentation() || this.isDemo() || this.isMakingOf() || this.isPresentationTranscript();
	}

	static isEditModeOrPresentation () {
		return this.isEditMode() || this.isPresentationOrDemo();
	}

	/**
	 * Function checks if route is a Box
	 * @return {Boolean} Return true, when the current route is a Box.
	 */
	static isBox () {
		return FlowRouter.getRouteName() === RouteNames.box;
	}

	static isCardsetLeitnerStats () {
		return FlowRouter.getRouteName() === RouteNames.cardsetstats;
	}

	/**
	 * Function checks if route is a Cardset
	 * @return {Boolean} Return true, when route is a Memo.
	 */
	static isMemo () {
		return FlowRouter.getRouteName() === RouteNames.memo;
	}

	static isHome () {
		return FlowRouter.getRouteName() === RouteNames.home;
	}

	static isMyCardsets () {
		return FlowRouter.getRouteName() === RouteNames.create;
	}

	static isMyTranscripts () {
		return FlowRouter.getRouteName() === RouteNames.transcriptsPersonal;
	}

	static isMyBonusTranscripts () {
		return FlowRouter.getRouteName() === RouteNames.transcriptsBonus;
	}

	static isAllCardsets () {
		return FlowRouter.getRouteName() === RouteNames.alldecks;
	}

	static isNotFound () {
		return FlowRouter.getRouteName() === RouteNames.notFound;
	}

	static isWorkload () {
		return FlowRouter.getRouteName() === RouteNames.learn;
	}

	static isShuffle () {
		return FlowRouter.getRouteName() === RouteNames.shuffle;
	}

	static isEditShuffle () {
		return FlowRouter.getRouteName() === RouteNames.editshuffle;
	}

	static isRepetitorium () {
		return FlowRouter.getRouteName() === RouteNames.repetitorium;
	}

	static isTranscriptBonus () {
		return FlowRouter.getRouteName() === RouteNames.transcriptBonus;
	}

	static isPool () {
		return FlowRouter.getRouteName() === RouteNames.pool;
	}

	static isPublic () {
		return this.isRepetitorium() || this.isPool();
	}

	static isPersonal () {
		return this.isMyCardsets() || this.isPersonalRepetitorien();
	}

	static isPersonalRepetitorien () {
		return FlowRouter.getRouteName() === RouteNames.personalRepetitorien;
	}

	static isAll () {
		return this.isAllCardsets() || this.isAllRepetitorien();
	}

	static isAllRepetitorien () {
		return FlowRouter.getRouteName() === RouteNames.allRepetitorien;
	}

	static isRepetitorienFilterIndex () {
		return (this.isAllRepetitorien() || this.isPersonalRepetitorien() || this.isRepetitorium());
	}

	static isFilterIndex () {
		return (this.isHome() || this.isPool() || this.isMyCardsets() || this.isRepetitorium() || this.isAllCardsets() || this.isWorkload() || this.isAllRepetitorien() || this.isPersonalRepetitorien() || this.isMyTranscripts() || this.isMyBonusTranscripts() || this.isShuffle() || this.isEditShuffle() || this.isTranscriptBonus());
	}

	static isFirstTimeVisit () {
		if (Route.isMakingOf()) {
			return false;
		}
		if (localStorage.getItem(firstTimeVisit) === undefined || localStorage.getItem(firstTimeVisit) === null) {
			localStorage.setItem(firstTimeVisit, "true");
		}
		if ($(window).width() < 768) {
			this.setFirstTimeVisit();
		}
		Session.set('isFirstTimeVisit', localStorage.getItem(firstTimeVisit));
		return Session.get('isFirstTimeVisit') === "true";
	}

	static setFirstTimeVisit () {
		localStorage.setItem(firstTimeVisit, "false");
	}

	static isLandingPageRoutes () {
		return conf.impressumRoutes.includes(FlowRouter.getRouteName());
	}

	//0 Personal
	//1 cardsets
	//2 repetitorien
	static getPersonalRouteName (type = 0) {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			let routeType = type; // Fix for browsers such as Vivaldi
			if (routeType === 0) {
				switch (Meteor.user().count.cardsets + Meteor.user().count.shuffled + Meteor.user().count.transcripts + Meteor.user().count.transcriptsBonus) {
					case 0:
						return TAPi18n.__('navbar-collapse.personal.personal.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.personal.personal.one');
					default:
						return TAPi18n.__('navbar-collapse.personal.personal.multiple');
				}
			} else if (routeType === 1) {
				switch (Meteor.user().count.cardsets) {
					case 0:
						return TAPi18n.__('navbar-collapse.personal.cardsets.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.personal.cardsets.one');
					default:
						return TAPi18n.__('navbar-collapse.personal.cardsets.multiple');
				}
			} else if (routeType === 2) {
				switch (Meteor.user().count.transcripts + Meteor.user().count.transcriptsBonus) {
					case 0:
						return TAPi18n.__('navbar-collapse.transcripts.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.transcripts.one');
					default:
						return TAPi18n.__('navbar-collapse.transcripts.multiple');
				}
			} else if (routeType === 3) {
				switch (Meteor.user().count.transcripts) {
					case 0:
						return TAPi18n.__('navbar-collapse.transcripts.personal.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.transcripts.personal.one');
					default:
						return TAPi18n.__('navbar-collapse.transcripts.personal.multiple');
				}
			} else if (routeType === 4) {
				switch (Meteor.user().count.transcriptsBonus) {
					case 0:
						return TAPi18n.__('navbar-collapse.transcripts.bonus.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.transcripts.bonus.one');
					default:
						return TAPi18n.__('navbar-collapse.transcripts.bonus.multiple');
				}
			} else if (routeType === 5) {
				switch (Meteor.user().count.transcripts + Meteor.user().count.transcriptsBonus) {
					case 0:
						return TAPi18n.__('navbar-collapse.transcripts.short.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.transcripts.short.one');
					default:
						return TAPi18n.__('navbar-collapse.transcripts.short.multiple');
				}
			} else {
				switch (Meteor.user().count.shuffled) {
					case 0:
						return TAPi18n.__('navbar-collapse.personal.repetitorien.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.personal.repetitorien.one');
					default:
						return TAPi18n.__('navbar-collapse.personal.repetitorien.multiple');
				}
			}
		}
	}

	static getNavigationName (name) {
		let iconName = name; // Fix for browsers such as Vivaldi
		let result;
		let caret = "<span class='caret'></span>";
		switch (iconName) {
			case "about":
				return TAPi18n.__('contact.about', {lastAppTitle: ServerStyle.getLastAppTitle()});
			case "agb":
				return icons.footerNavigation.agb + TAPi18n.__('contact.agb');
			case "backToHome":
				return icons.footerNavigation.backToHome + TAPi18n.__('contact.home');
			case "datenschutz":
				return icons.footerNavigation.datenschutz + TAPi18n.__('contact.datenschutz');
			case "demo":
			case "demolist":
				return icons.footerNavigation.demo + TAPi18n.__('contact.demo');
			case "faq":
				return icons.footerNavigation.faq + TAPi18n.__('contact.faq');
			case "help":
				return icons.footerNavigation.help + TAPi18n.__('contact.help');
			case "impressum":
				return icons.footerNavigation.impressum + TAPi18n.__('contact.impressum');
			case "learn":
				return icons.topNavigation.workload  + TAPi18n.__('navbar-collapse.learndecks');
			case "learning":
				return icons.footerNavigation.learning  + TAPi18n.__('contact.learning');
			case "all":
				result = icons.topNavigation.all.all + TAPi18n.__('navbar-collapse.all.all');
				if (!ServerStyle.gotSimplifiedNav()) {
					result += caret;
				}
				return result;
			case "allCardsets":
			case "alldecks":
				if (ServerStyle.gotSimplifiedNav()) {
					return icons.topNavigation.all.all + TAPi18n.__('navbar-collapse.all.all');
				} else {
					return icons.topNavigation.all.cardsets + TAPi18n.__('navbar-collapse.all.cardsets');
				}
				break;
			case "allRepetitorien":
				return icons.topNavigation.all.repetitorien +  TAPi18n.__('navbar-collapse.all.repetitorien');
			case "public":
				result = icons.topNavigation.public.public + TAPi18n.__('navbar-collapse.public.public');
				if (ServerStyle.gotNavigationFeature("public.cardset.enabled") && ServerStyle.gotNavigationFeature("public.repetitorium.enabled") && !ServerStyle.gotSimplifiedNav()) {
					result += caret;
				}
				return result;
			case "publicCardsets":
			case "home":
			case "pool":
				if (ServerStyle.gotSimplifiedNav()) {
					return icons.topNavigation.public.public + TAPi18n.__('navbar-collapse.public.public');
				} else {
					return icons.topNavigation.public.cardsets + TAPi18n.__('navbar-collapse.public.cardsets');
				}
				break;
			case "publicRepetitorien":
			case "repetitorium":
				return icons.topNavigation.public.repetitorien +  TAPi18n.__('navbar-collapse.public.repetitorien');
			case "personal":
				result = icons.topNavigation.personal.personal + this.getPersonalRouteName(0);
				if (ServerStyle.gotNavigationFeature("personal.cardset.enabled") && ServerStyle.gotNavigationFeature("personal.repetitorium.enabled") && !ServerStyle.gotSimplifiedNav()) {
					result += caret;
				}
				return result;
			case "transcripts":
				result = icons.topNavigation.transcripts.transcripts + this.getPersonalRouteName(2);
				if (ServerStyle.gotNavigationFeature("transcript.bonus.enabled") && ServerStyle.gotNavigationFeature("transcript.personal.enabled") && !ServerStyle.gotSimplifiedNav()) {
					result += caret;
				}
				return result;
			case "transcriptsShort":
				result = icons.topNavigation.transcripts.transcripts + this.getPersonalRouteName(5);
				if (ServerStyle.gotNavigationFeature("transcript.bonus.enabled") && ServerStyle.gotNavigationFeature("transcript.personal.enabled") && !ServerStyle.gotSimplifiedNav()) {
					result += caret;
				}
				return result;
			case "transcriptsPersonal":
				return icons.topNavigation.transcripts.personal + this.getPersonalRouteName(3);
			case "transcriptsBonus":
				return icons.topNavigation.transcripts.bonus + this.getPersonalRouteName(4);
			case "personalCardsets":
			case "myCardsets":
			case "create":
				if (ServerStyle.gotSimplifiedNav()) {
					return icons.topNavigation.personal.cardsets + this.getPersonalRouteName(0);
				} else {
					return icons.topNavigation.personal.cardsets + this.getPersonalRouteName(1);
				}
				break;
			case "personalRepetitorien":
				return icons.topNavigation.personal.repetitorien +  this.getPersonalRouteName(6);
			case "workload":
				return icons.topNavigation.workload + TAPi18n.__('navbar-collapse.learndecks');
			case "backend":
				return icons.topNavigation.backend + "<span class='hidden-on-iPad'>" + TAPi18n.__('navbar-collapse.backend') + "</span>";
			case "profile":
				let name = icons.topNavigation.profile;
				if (Meteor.user().profile.birthname === undefined || Meteor.user().profile.birthname === "") {
					name += TAPi18n.__('profile.finishProfile');
				} else {
					name += getAuthorName(Meteor.userId(), true, true);
				}
				return name + caret;
			case "profileIPad":
				if (UserPermissions.isAdmin()) {
					return icons.topNavigation.profile + caret;
				} else {
					return icons.topNavigation.profile + TAPi18n.__('navbar-collapse.myprofile') + caret;
				}
				break;
			case "profileOverview":
				return icons.topNavigation.profileOverview + TAPi18n.__('profile.activity');
			case "profileBilling":
				return icons.topNavigation.profileBilling + TAPi18n.__('navbar-collapse.billing');
			case "profileMembership":
				return icons.topNavigation.profileMembership + TAPi18n.__('navbar-collapse.membership');
			case "profileNotifications":
				return icons.topNavigation.profileNotifications + TAPi18n.__('profile.notifications');
			case "profileSettings":
				return icons.topNavigation.profileSettings + TAPi18n.__('profile.settings.name');
			case "profileRequests":
				return icons.topNavigation.profileRequests + TAPi18n.__('profile.requests');
			case "cardsetdetailsid":
			case "cardsetcard":
				let cardset = Cardsets.findOne({_id: FlowRouter.getParam('_id')}, {fields: {shuffled: 1}});
				if (cardset !== undefined && cardset.shuffled) {
					return icons.miscNavigation.repetitorium + TAPi18n.__('courseIteration.name');
				} else {
					return icons.miscNavigation.cardset + TAPi18n.__('modal-dialog.cardsetname');
				}
				break;
			case "progress":
				return icons.miscNavigation.progress + TAPi18n.__('admin.myProgress');
			case "toggleImpressum":
				return icons.miscNavigation.toggleImpressum;
			case "mobileInfo":
				return icons.landingPageNavigation.mobileInfo;
			case "statistics":
				return icons.footerNavigation.statistics + TAPi18n.__('contact.statistics');
			case "statisticsMobile":
				return icons.footerNavigation.statistics;
			case "useCasesIcon":
			case "useCases":
				return icons.topNavigation.useCases;
		}
	}

	static isRouteWithoutMainNavigation () {
		return (this.isPresentation() && !this.isTableOfContent()) || this.isBox() || this.isMemo();
	}

	static isRouteWithFullscreenFeature () {
		return this.isPresentationOrDemo() || this.isBox() || this.isMemo();
	}
};
