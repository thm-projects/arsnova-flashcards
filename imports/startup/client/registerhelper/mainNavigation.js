import {Session} from "meteor/session";
import {ServerStyle} from "../../../util/styles";
import {Icons} from "../../../util/icons";
import {MainNavigation} from "../../../util/mainNavigation";
import {Route} from "../../../util/route";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

Template.registerHelper("isProLoginActive", function () {
	return (ServerStyle.isLoginEnabled("legacy") || ServerStyle.isLoginEnabled("pro"));
});

Template.registerHelper("getNavigationIcon", function (type) {
	return Icons.getNavigationIcon(type);
});

Template.registerHelper("getSignal", function () {
	switch (Session.get('connectionStatus')) {
		case (0):
			return "disconnected";
		case (1):
			return "connected";
		case (2):
			return "connecting";
	}
});

Template.registerHelper("getSignalTooltip", function () {
	switch (Session.get('connectionStatus')) {
		case (0):
			return TAPi18n.__('connection.disconnected');
		case (1):
			return TAPi18n.__('connection.connected');
		case (2):
			return TAPi18n.__('connection.connecting');
	}
});

// detects if the app is offline or not
Template.registerHelper("isConnected", function () {
	return Session.get("connectionStatus") === 1;
});

Template.registerHelper('canUseWorkload', function () {
	return MainNavigation.canUseWorkload();
});

Template.registerHelper('isFirstTimeVisitNavigation', function () {
	return (Route.isFirstTimeVisit() && (Route.isHome() || Route.isDemo() || Route.isMakingOf()));
});

Template.registerHelper('getNavigationName', function (name = undefined) {
	if (name === undefined) {
		return Route.getNavigationName(FlowRouter.getRouteName());
	} else {
		return Route.getNavigationName(name);
	}
});

Template.registerHelper("getCardsetIcons", function (isShuffled) {
	if (isShuffled) {
		return "<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-archive'></i>&nbsp;<i class='fas fa-ellipsis-h'></i>&nbsp;";
	} else {
		return "<i class='fas fa-archive'></i>&nbsp;";
	}
});

Template.registerHelper("isUseCasesModalOpen", function () {
	return Session.get('useCasesModalOpen');
});

Template.registerHelper("getUseCasesIcon", function (type) {
	return Icons.useCases(type);
});
