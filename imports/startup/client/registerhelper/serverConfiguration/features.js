import {ServerStyle} from "../../../../util/styles";
import {Meteor} from "meteor/meteor";
import {NavigatorCheck} from "../../../../util/navigatorCheck";

Template.registerHelper('enabledMatomo', function () {
	return Meteor.settings.public.matomo.USE_MATOMO;
});

Template.registerHelper('gotTranscriptsEnabled', function () {
	return ServerStyle.gotTranscriptsEnabled();
});

Template.registerHelper('isLinuxHelp', function () {
	return ServerStyle.getHelpStyle() === "linux";
});

Template.registerHelper('gotCenteredLandingPagePomodoro', function () {
	return ServerStyle.gotCenteredLandingPagePomodoro();
});

Template.registerHelper('gotSimplifiedNav', function () {
	return ServerStyle.gotSimplifiedNav();
});

Template.registerHelper('gotFeatureSupport', function (feature) {
	return NavigatorCheck.gotFeatureSupport(feature);
});

Template.registerHelper('gotNavigationFeature', function (feature, addRoutePath = false) {
	return ServerStyle.gotNavigationFeature(feature, addRoutePath);
});
