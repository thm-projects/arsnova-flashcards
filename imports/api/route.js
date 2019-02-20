import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
let firstTimeVisit = 'isFirstTimeVisit';
import * as icons from "../config/icons.js";
import * as conf from "../config/routes.js";
import {Cardsets} from "./cardsets";
import {ServerStyle} from "./styles";
import {UserPermissions} from "./permissions";

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
			case "learning":
				return icons.footerNavigation.learning  + TAPi18n.__('contact.learning');
			case "myCardsets":
				switch (Meteor.user().count.cardsets) {
					case 0:
						return icons.topNavigation.myCardsets + TAPi18n.__('navbar-collapse.noCarddecks');
					case 1:
						return icons.topNavigation.myCardsets + TAPi18n.__('navbar-collapse.oneCarddeck');
					default:
						return icons.topNavigation.myCardsets + TAPi18n.__('navbar-collapse.carddecks');
				}
				break;
			case "alldecks":
				return icons.topNavigation.alldecks + "<span class='hidden-on-iPad'>" + TAPi18n.__('navbar-collapse.alldecks') + "</span>";
			case "repetitorium":
				return icons.topNavigation.repetitorium + TAPi18n.__('navbar-collapse.course');
			case "workload":
				return icons.topNavigation.workload + TAPi18n.__('navbar-collapse.learndecks');
			case "pool":
			case "home":
				return icons.topNavigation.pool + TAPi18n.__('navbar-collapse.pool');
			case "backend":
				return icons.topNavigation.backend + "<span class='hidden-on-iPad'>" + TAPi18n.__('navbar-collapse.backend') + "</span>";
			case "profile":
				return icons.topNavigation.profile + Meteor.user().profile.name + "<span class='caret'></span>";
			case "profileIPad":
				if (UserPermissions.isAdmin()) {
					return icons.topNavigation.profile + "<span class='caret'></span>";
				} else {
					return icons.topNavigation.profile + TAPi18n.__('navbar-collapse.myprofile') + "<span class='caret'></span>";
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
				return icons.footerNavigation.statistics + TAPi18n.__('contact.statistics');
			case "statisticsMobile":
				return icons.footerNavigation.statistics;
		}
	}
};
