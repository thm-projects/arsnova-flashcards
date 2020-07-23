import {ServerStyle} from "../../../util/styles";

Template.registerHelper('gotFullscreenSettingsAccess', function (modeFilter) {
	return ServerStyle.gotFullscreenSettingsAccess(modeFilter);
});

Template.registerHelper('getFullscreenMode', function () {
	return ServerStyle.getFullscreenMode();
});

Template.registerHelper('gotFullscreenMode', function (mode) {
	return mode === ServerStyle.getFullscreenMode();
});
