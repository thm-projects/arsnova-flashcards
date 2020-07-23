import * as RouteNames from "../../../util/routeNames";
import {ServerStyle} from "../../../util/styles";
import {MainNavigation} from "../../../util/mainNavigation";
import {Session} from "meteor/session";
import {Route} from "../../../util/route";
import {Meteor} from "meteor/meteor";
import {CardVisuals} from "../../../util/cardVisuals";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LoginTasks} from "../../../util/login";


var linksWithNoLoginRequirement = function () {
	let links = [
		RouteNames.home,
		RouteNames.about,
		RouteNames.learning,
		RouteNames.faq,
		RouteNames.help,
		RouteNames.impressum,
		RouteNames.demo,
		RouteNames.demolist,
		RouteNames.agb,
		RouteNames.datenschutz,
		RouteNames.making,
		RouteNames.makinglist
	];
	if (ServerStyle.isLoginEnabled("guest") && MainNavigation.isGuestLoginActive()) {
		let linksGuest = [
			RouteNames.cardsetdetailsid,
			RouteNames.cardsetcard,
			RouteNames.presentation,
			RouteNames.presentationlist
		];
		if (ServerStyle.gotNavigationFeature("public.cardset.enabled")) {
			linksGuest.push('pool');
		}
		if (ServerStyle.gotNavigationFeature("public.repetitorium.enabled")) {
			linksGuest.push('repetitorium');
		}
		return links.concat(linksGuest);
	} else {
		MainNavigation.setGuestLogin("false");
		return links;
	}
};

export let setLanguage = function () {
	let language = ServerStyle.getClientLanguage();
	Session.set('activeLanguage', language);
	TAPi18n.setLanguage(language);
};

function setBackground (backgroundObject, cssClass = undefined) {
	let body = $('body');
	body.removeAttr('class');
	body.removeAttr('style');
	if (cssClass !== undefined) {
		body.addClass(cssClass);
	}
	for (let i = 0; i < Object.keys(backgroundObject).length; i++) {
		let key = Object.keys(backgroundObject)[i];
		body.css(key, backgroundObject[key]);
	}
}

function landingPageBackgrounds () {
	if (Route.isDemo() | Route.isMakingOf()) {
		if (Route.isPresentationViewList()) {
			setBackground(ServerStyle.getBackground("demoIndex"), 'presentation-list');
		} else {
			setBackground(ServerStyle.getBackground("demo"), 'demo');
		}
	} else if (Route.isAGB()) {
		setBackground(ServerStyle.getBackground("agb"));
	} else if (Route.isDatenschutz()) {
		setBackground(ServerStyle.getBackground("datenschutz"));
	} else if (Route.isImpressum()) {
		setBackground(ServerStyle.getBackground("impressum"));
	} else if (Route.isAbout()) {
		setBackground(ServerStyle.getBackground("about"));
	} else if (Route.isLearning()) {
		setBackground(ServerStyle.getBackground("learning"));
	} else if (Route.isFaq()) {
		setBackground(ServerStyle.getBackground("faq"));
	} else if (Route.isHelp()) {
		setBackground(ServerStyle.getBackground("help"));
	} else {
		setBackground(ServerStyle.getBackground("landing-page"));
	}
}

export let setTheme = function () {
	if (Route.isRouteWithoutMainNavigation()) {
		Session.set('displayMainNavigation', false);
	} else {
		Session.set('displayMainNavigation', true);
	}
	if (Meteor.user()) {
		// If there is no selectedColorTheme the Session var "theme" will stay NULL.
		if (Meteor.users.findOne(Meteor.userId())) {
			if (Meteor.users.findOne(Meteor.userId()).selectedColorTheme) {
				Session.set("theme", ServerStyle.getDefaultTheme());
			}
		}
	} else {
		// When user logged out, go back to default Theme
		Session.set("theme", ServerStyle.getDefaultTheme());
	}
	let themeId = "";
	if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
		if (Session.get('fullscreen') && !Route.isPresentationList()) {
			themeId = 'theme-wrapper-no-nav';
		} else {
			themeId = 'theme-wrapper';
		}
	} else {
		if (!Session.get('fullscreen') && !Route.isPresentationList()) {
			themeId = 'theme-wrapper-no-nav-welcome';
		} else {
			themeId = 'theme-wrapper-no-nav';
		}
	}
	let html = $('html');
	if (Route.isCardset()) {
		themeId = 'theme-wrapper-cardset';
	}
	html.attr('id', themeId);
	html.attr('class', Session.get("theme"));

	//Background
	if (Route.isLandingPageRoutes()) {
		landingPageBackgrounds();
	} else if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
		if (Route.isBackend()) {
			setBackground(ServerStyle.getBackground("backend"), 'backend');
		} else {
			let internal = 'internal';
			if (Route.isProfile()) {
				if (Route.isProfileSettings()) {
					setBackground(ServerStyle.getBackground("profileSettings"), internal);
				} else if (Route.isProfileMembership())  {
					setBackground(ServerStyle.getBackground("profileMembership"), internal);
				} else if (Route.isProfileRequests()) {
					setBackground(ServerStyle.getBackground("profileRequests"), internal);
				} else {
					setBackground(ServerStyle.getBackground("profileBilling"), internal);
				}
			} else if (Route.isPublic()) {
				setBackground(ServerStyle.getBackground("pool"), internal);
			} else if (Route.isWorkload()) {
				setBackground(ServerStyle.getBackground("workload"), internal);
			} else if (Route.isPersonal()) {
				setBackground(ServerStyle.getBackground("personal"), internal);
			} else if (Route.isMyTranscripts() || Route.isMyBonusTranscripts()) {
				setBackground(ServerStyle.getBackground("transcripts"), internal);
			} else if (Route.isAll()) {
				setBackground(ServerStyle.getBackground("allPool"), internal);
			} else if (Route.isCardset()) {
				setBackground(ServerStyle.getBackground("cardset"), internal);
			} else if (Route.isCardsetLeitnerStats()) {
				setBackground(ServerStyle.getBackground("cardsetLeitnerStats"), internal);
			} else if (Route.isTranscriptBonus()) {
				setBackground(ServerStyle.getBackground("cardsetTranscriptBonus"), internal);
			} else if (Route.isPresentation()) {
				if (Route.isPresentationViewList()) {
					setBackground(ServerStyle.getBackground("presentationIndex"), 'presentation-list');
				} else {
					setBackground(ServerStyle.getBackground("presentation"), 'presentation');
				}
			} else if (Route.isBox() || Route.isMemo()) {
				let learning = 'learning';
				if (Route.isBox()) {
					setBackground(ServerStyle.getBackground("leitner"), learning);
				} else {
					setBackground(ServerStyle.getBackground("wozniak"), learning);
				}
			} else if (Route.isEditMode()) {
				setBackground(ServerStyle.getBackground("editor"), 'editor');
			} else if (Route.isLandingPageRoutes()) {
				landingPageBackgrounds(ServerStyle.getBackground("internal"), internal);
			} else {
				setBackground(ServerStyle.getBackground("internal"), internal);
			}
		}
	} else {
		let landingPage;
		if (!Route.isLandingPageRoutes()) {
			landingPage = 'landing-page';
		}
		setBackground(ServerStyle.getBackground("landing-page"), landingPage);
	}
};

var isSignedIn = function () {
	if (!(Meteor.user() || Meteor.loggingIn()) && !MainNavigation.isGuestLoginActive()) {
		Session.set("theme", ServerStyle.getDefaultTheme());
		if (MainNavigation.getLoginTarget() === undefined) {
			if (linksWithNoLoginRequirement().includes(FlowRouter.getRouteName())) {
				MainNavigation.setLoginTarget(false);
			} else {
				if (FlowRouter.getRouteName() !== 'firstLogin' && FlowRouter.getRouteName() !== 'accessDenied') {
					MainNavigation.setLoginTarget(FlowRouter.current().path);
				} else {
					MainNavigation.setLoginTarget(false);
				}
			}
		}
		FlowRouter.go('home');
	} else {
		Route.setFirstTimeVisit();
		if (Roles.userIsInRole(Meteor.userId(), ['firstLogin'])) {
			FlowRouter.go('firstLogin');
		}
		if (Roles.userIsInRole(Meteor.userId(), ['blocked'])) {
			FlowRouter.go('accessDenied');
		}
	}
};

export let setLoginTarget = function () {
	if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
		if (!Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked']) && MainNavigation.getLoginTarget() !== undefined && MainNavigation.getLoginTarget() !== false && MainNavigation.getLoginTarget() !== "/") {
			FlowRouter.go(MainNavigation.getLoginTarget());
			MainNavigation.setLoginTarget(false);
		} else {
			LoginTasks.setLoginRedirect();
		}
	}
};

FlowRouter.triggers.enter([setLanguage, setTheme]);

FlowRouter.triggers.exit( function (context) {
	Session.set('previousRouteName', context.route.name);
});

FlowRouter.triggers.enter([isSignedIn], {
	except: linksWithNoLoginRequirement()
});

FlowRouter.triggers.enter([setLoginTarget], {
	only: [RouteNames.home]
});
