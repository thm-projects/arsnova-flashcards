import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
let firstTimeVisit = 'isFirstTimeVisit';
import * as icons from "../config/icons.js";
import * as conf from "../config/routes.js";
import {Cardsets} from "./cardsets";
import {ServerStyle} from "./styles";
import {UserPermissions} from "./permissions";
import {getAuthorName} from "./userdata";

export let Route = class Route {
	/**
	 * Function checks if route is a Cardset
	 * @return {Boolean} Return true, when route is a Cardset.
	 */
	static isCardset () {
		return (this.isCardsetList() || Router.current().route.getName() === 'cardsetdetailsid' || Router.current().route.getName() === "cardsetcard" || Router.current().route.getName() === 'admin_cardset');
	}

	static isCardsetList () {
		return Router.current().route.getName() === 'cardsetlistid';
	}

	/**
	 * Function checks if route is a card edit Mode
	 * @return {Boolean} Return true, when route is new Card or edit Card.
	 */
	static isEditMode () {
		return this.isNewCard() || this.isEditCard() | this.isNewTranscript() | this.isEditTranscript();
	}

	static isNewCard () {
		return Router.current().route.getName() === "newCard" || this.isNewTranscript();
	}

	static requiresUserInputForFullscreen () {
		return (this.isPresentation() || this.isBox() || this.isMemo());
	}

	static isEditCard () {
		return Router.current().route.getName() === "editCard" || this.isEditTranscript();
	}

	static isDemo () {
		return Router.current().route.getName() === "demo" || this.isDemoList();
	}

	static isDemoList () {
		return Router.current().route.getName() === "demolist";
	}

	static isMakingOf () {
		return Router.current().route.getName() === "making" || this.isMakingOfList();
	}

	static isTranscript () {
		return this.isMyTranscripts() || this.isNewTranscript() || this.isEditTranscript() || this.isPresentationTranscript();
	}

	static isPresentationTranscript () {
		return Router.current().route.getName() === "presentationTranscript";
	}

	static isNewTranscript () {
		return Router.current().route.getName() === "newTranscript";
	}

	static isEditTranscript () {
		return Router.current().route.getName() === "editTranscript";
	}

	static isMakingOfList () {
		return Router.current().route.getName() === "makinglist";
	}

	static isBackend () {
		if (Router.current().route.getName() !== undefined) {
			return Router.current().route.getName().substring(0, 5) === "admin";
		} else {
			return false;
		}
	}

	static isTableOfContent () {
		return (this.isPresentationList() || this.isCardsetList() || this.isDemoList() | this.isMakingOfList()) ;
	}

	/**
	 * Function checks if route is a presentation view
	 * @return {Boolean} Return true, when route is a presentation view.
	 */
	static isPresentation () {
		return (Router.current().route.getName() === "presentation" || this.isPresentationList() || this.isPresentationTranscript());
	}

	static isPresentationList () {
		return Router.current().route.getName() === "presentationlist";
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
		return Router.current().route.getName() === "box";
	}

	static isLeitnerProgress () {
		return Router.current().route.getName() === "progress";
	}

	static isCardsetLeitnerStats () {
		return Router.current().route.getName() === "cardsetstats";
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

	static isMyTranscripts () {
		return Router.current().route.getName() === "transcripts";
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

	static isTranscriptBonus () {
		return Router.current().route.getName() === "transcriptBonus";
	}

	static isPool () {
		return Router.current().route.getName() === "pool";
	}

	static isPublic () {
		return this.isRepetitorium() || this.isPool();
	}

	static isPersonal () {
		return this.isMyCardsets() || this.isPersonalRepetitorien() || this.isMyTranscripts();
	}

	static isPersonalRepetitorien () {
		return Router.current().route.getName() === "personalRepetitorien";
	}

	static isAll () {
		return this.isAllCardsets() || this.isAllRepetitorien();
	}

	static isAllRepetitorien () {
		return Router.current().route.getName() === "allRepetitorien";
	}

	static isRepetitorienFilterIndex () {
		return (this.isAllRepetitorien() || this.isPersonalRepetitorien() || this.isRepetitorium());
	}

	static isFilterIndex () {
		return (this.isHome() || this.isPool() || this.isMyCardsets() || this.isRepetitorium() || this.isAllCardsets() || this.isWorkload() || this.isAllRepetitorien() || this.isPersonalRepetitorien() || this.isMyTranscripts());
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

	//0 Personal
	//1 cardsets
	//2 repetitorien
	static getPersonalRouteName (type = 0) {
		if (Meteor.user() && Meteor.user().count !== undefined) {
			if (type === 0) {
				switch (Meteor.user().count.cardsets + Meteor.user().count.shuffled + Meteor.user().count.transcripts) {
					case 0:
						return TAPi18n.__('navbar-collapse.personal.personal.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.personal.personal.one');
					default:
						return TAPi18n.__('navbar-collapse.personal.personal.multiple');
				}
			} else if (type === 1) {
				switch (Meteor.user().count.cardsets) {
					case 0:
						return TAPi18n.__('navbar-collapse.personal.cardsets.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.personal.cardsets.one');
					default:
						return TAPi18n.__('navbar-collapse.personal.cardsets.multiple');
				}
			} else if (type === 2) {
				switch (Meteor.user().count.transcripts) {
					case 0:
						return TAPi18n.__('navbar-collapse.personal.transcripts.zero');
					case 1:
						return TAPi18n.__('navbar-collapse.personal.transcripts.one');
					default:
						return TAPi18n.__('navbar-collapse.personal.transcripts.multiple');
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
			case "learn":
				return icons.topNavigation.workload  + TAPi18n.__('navbar-collapse.learndecks');
			case "learning":
				return icons.footerNavigation.learning  + TAPi18n.__('contact.learning');
			case "all":
				return icons.topNavigation.all.all + TAPi18n.__('navbar-collapse.all.all') + "<span class='caret'></span>";
			case "allCardsets":
			case "alldecks":
				return icons.topNavigation.all.cardsets + TAPi18n.__('navbar-collapse.all.cardsets');
			case "allRepetitorien":
				return icons.topNavigation.all.repetitorien +  TAPi18n.__('navbar-collapse.all.repetitorien');
			case "public":
				return icons.topNavigation.public.public + TAPi18n.__('navbar-collapse.public.public') + "<span class='caret'></span>";
			case "publicCardsets":
			case "home":
			case "pool":
				return icons.topNavigation.public.cardsets + TAPi18n.__('navbar-collapse.public.cardsets');
			case "publicRepetitorien":
			case "repetitorium":
				return icons.topNavigation.public.repetitorien +  TAPi18n.__('navbar-collapse.public.repetitorien');
			case "personal":
				return icons.topNavigation.personal.personal + this.getPersonalRouteName(0) + "<span class='caret'></span>";
			case "personalTranscripts":
			case "transcripts":
				return icons.topNavigation.personal.transcripts + this.getPersonalRouteName(2);
			case "personalCardsets":
			case "myCardsets":
			case "create":
				return icons.topNavigation.personal.cardsets + this.getPersonalRouteName(1);
			case "personalRepetitorien":
				return icons.topNavigation.personal.repetitorien +  this.getPersonalRouteName(3);
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
				return name + "<span class='caret'></span>";
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
				let cardset = Cardsets.findOne({_id: Router.current().params._id}, {fields: {shuffled: 1}});
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
};
