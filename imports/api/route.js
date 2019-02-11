import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
let firstTimeVisit = 'isFirstTimeVisit';
import * as icons from "../config/icons.js";
import * as conf from "../config/routes.js";
import {Cardsets} from "./cardsets";
import {ServerStyle} from "./styles";

export let Route = class Route {
	/**
	 * Function checks if route is a Cardset
	 * @return {Boolean} Return true, when route is a Cardset.
	 */
	static isCardset () {
		return Router.current().route.getName() === 'cardsetlistid' || Router.current().route.getName() === 'cardsetdetailsid' || Router.current().route.getName() === "cardsetcard" || Router.current().route.getName() === 'admin_cardset';
	}
	/**
	 * Function checks if route is a card edit Mode
	 * @return {Boolean} Return true, when route is new Card or edit Card.
	 */
	static isEditMode () {
		return this.isNewCard() || this.isEditCard();
	}

	static isNewCard () {
		return Router.current().route.getName() === "newCard";
	}

	static requiresUserInputForFullscreen () {
		return (this.isPresentation() || this.isBox() || this.isMemo());
	}

	static isEditCard () {
		return Router.current().route.getName() === "editCard";
	}

	static isDemo () {
		return Router.current().route.getName() === "demo" || Router.current().route.getName() === "demolist";
	}

	static isMakingOf () {
		return Router.current().route.getName() === "making" || Router.current().route.getName() === "makinglist";
	}

	static isBackend () {
		return Router.current().route.getName().substring(0, 5) === "admin";
	}

	/**
	 * Function checks if route is a presentation view
	 * @return {Boolean} Return true, when route is a presentation view.
	 */
	static isPresentation () {
		return (Router.current().route.getName() === "presentation" || Router.current().route.getName() === "presentationlist");
	}

	static isPresentationOrDemo () {
		return this.isPresentation() || this.isDemo() || this.isMakingOf();
	}

	static isEditModeOrPresentation () {
		return this.isEditMode() || this.isPresentationOrDemo();
	}

	/**
	 * Function checks if route is a Box
	 * @return {Boolean} Return true, when the current route is a Box.
	 */
	static isBox () {
		return Router.current().route.getName() === "box";
	}

	static isLeitnerProgress () {
		return Router.current().route.getName() === "progress";
	}

	static isLeitnerProgressProfileOverview () {
		return Router.current().route.getName() === "profileOverview";
	}

	/**
	 * Function checks if route is a Cardset
	 * @return {Boolean} Return true, when route is a Memo.
	 */
	static isMemo () {
		return Router.current().route.getName() === "memo";
	}

	static isHome () {
		return Router.current().route.getName() === "home";
	}

	static isMyCardsets () {
		return Router.current().route.getName() === "create";
	}

	static isAllCardsets () {
		return Router.current().route.getName() === "alldecks";
	}

	static isWorkload () {
		return Router.current().route.getName() === "learn";
	}

	static isShuffle () {
		return Router.current().route.getName() === "shuffle";
	}

	static isEditShuffle () {
		return Router.current().route.getName() === "editshuffle";
	}

	static isRepetitorium () {
		return Router.current().route.getName() === "repetitorium";
	}

	static isPool () {
		return Router.current().route.getName() === "pool";
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

	static isImpressum () {
		return conf.impressumRoutes.includes(Router.current().route.getName());
	}

	static getNavigationName (name) {
		switch (name) {
			case "about":
				return TAPi18n.__('contact.about', {lastAppTitle: ServerStyle.getLastAppTitle()});
			case "agb":
				return icons.impressumNavigation.agb + TAPi18n.__('contact.agb');
			case "backToHome":
				return icons.impressumNavigation.backToHome + TAPi18n.__('contact.home');
			case "datenschutz":
				return icons.impressumNavigation.datenschutz + TAPi18n.__('contact.datenschutz');
			case "demo":
			case "demolist":
				return icons.impressumNavigation.demo + TAPi18n.__('contact.demo');
			case "faq":
				return icons.impressumNavigation.faq + TAPi18n.__('contact.faq');
			case "help":
				return icons.impressumNavigation.help + TAPi18n.__('contact.help');
			case "impressum":
				return icons.impressumNavigation.impressum + TAPi18n.__('contact.impressum');
			case "learning":
				return icons.impressumNavigation.learning  + TAPi18n.__('contact.learning');
			case "create":
				switch (Cardsets.find({owner: Meteor.userId()}).count()) {
					case 0:
						return TAPi18n.__('navbar-collapse.noCarddecks');
					case 1:
						return TAPi18n.__('navbar-collapse.oneCarddeck');
					default:
						return TAPi18n.__('navbar-collapse.carddecks');
				}
				break;
			case "alldecks":
				return icons.mainNavigation.alldecks + TAPi18n.__('navbar-collapse.alldecks');
			case "repetitorium":
				return icons.mainNavigation.repetitorium + TAPi18n.__('navbar-collapse.course');
			case "learn":
				return icons.mainNavigation.learn + TAPi18n.__('navbar-collapse.learndecks');
			case "pool":
			case "home":
				return icons.mainNavigation.pool + TAPi18n.__('navbar-collapse.pool');
			case "profileOverview":
				return icons.mainNavigation.profileOverview + TAPi18n.__('profile.activity');
			case "profileBilling":
				return icons.mainNavigation.profileBilling + TAPi18n.__('profile.billing');
			case "profileMembership":
				return icons.mainNavigation.profileMembership + TAPi18n.__('profile.membership');
			case "profileNotifications":
				return icons.mainNavigation.profileNotifications + TAPi18n.__('profile.notifications');
			case "profileSettings":
				return icons.mainNavigation.profileSettings + TAPi18n.__('profile.settings.name');
			case "profileRequests":
				return icons.mainNavigation.profileRequests + TAPi18n.__('profile.requests');
			case "cardsetdetailsid":
			case "cardsetcard":
			case "cardsetlistid":
				if (Cardsets.findOne({_id: Router.current().params._id}).shuffled) {
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
				return icons.impressumNavigation.statistics + TAPi18n.__('contact.statistics');
			case "statisticsMobile":
				return icons.impressumNavigation.statistics;
		}
	}
};
