import * as RouteNames from "../../../util/routeNames";
import {ServerStyle} from "../../../util/styles";
import {MainNavigation} from "../../../util/mainNavigation";
import {Session} from "meteor/session";
import {Route} from "../../../util/route";
import {Meteor} from "meteor/meteor";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {LoginTasks} from "../../../util/login";
import {checkForNewMessages} from "../../../ui/messageOfTheDay/messageOfTheDay";
import {ThemeSwitcher} from "../../../util/themeSwitcher";
import {Utilities} from "../../../util/utilities";


var linksWithNoLoginRequirement = function () {
	let links = [
		RouteNames.notFound,
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

var isSignedIn = function () {
	if (!(Meteor.user() || Meteor.loggingIn()) && !MainNavigation.isGuestLoginActive()) {
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

export let checkMotds = function () {
	Meteor.subscribe('MessageOfTheDayFiltered', MainNavigation.isGuestLoginActive(), () => {
		if (checkForNewMessages()) {
			$('#messageOfTheDayModal').modal('show');
		}
	});
};

FlowRouter.triggers.enter([Utilities.setActiveLanguage, ThemeSwitcher.setTheme]);

FlowRouter.triggers.exit(function (context) {
	Session.set('previousRouteName', context.route.name);
});

FlowRouter.triggers.enter([isSignedIn], {
	except: linksWithNoLoginRequirement()
});

FlowRouter.triggers.enter([setLoginTarget], {
	only: [RouteNames.home]
});

FlowRouter.triggers.enter([checkMotds]);
