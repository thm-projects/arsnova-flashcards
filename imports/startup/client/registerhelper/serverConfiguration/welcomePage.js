import {ServerStyle} from "../../../../api/styles";
import {BarfyStarsConfig} from "../../../../api/barfyStars";

Template.registerHelper('getFirstAppTitle', function () {
	return ServerStyle.getFirstAppTitle();
});

Template.registerHelper('getLastAppTitle', function () {
	return ServerStyle.getLastAppTitle();
});

Template.registerHelper('getAppSlogan', function () {
	return ServerStyle.getAppSlogan();
});

Template.registerHelper('gotLandingPageWordcloud', function () {
	return ServerStyle.gotLandingPageWordcloud();
});

Template.registerHelper('getBarfyStarsConfig', function (type = "default") {
	return JSON.stringify(BarfyStarsConfig.getConfig(type));
});

Template.registerHelper('getBarfyStarsStyle', function (type = "default") {
	return BarfyStarsConfig.getStyle(type);
});

Template.registerHelper('getAboutButton', function (isMobile = false) {
	return ServerStyle.getAboutButton(isMobile);
});
