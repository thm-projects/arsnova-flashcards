import {ServerStyle} from "../../../util/styles";
import {Fullscreen} from "../../../util/fullscreen";

Template.registerHelper('gotFullscreenSettingsAccess', function (modeFilter) {
	return ServerStyle.gotFullscreenSettingsAccess(modeFilter);
});

Template.registerHelper('getFullscreenMode', function () {
	return ServerStyle.getFullscreenMode();
});

Template.registerHelper('gotFullscreenMode', function (mode) {
	return mode === ServerStyle.getFullscreenMode();
});


Template.registerHelper('canDisplayFullscreenButton', function () {
	if (ServerStyle.getFullscreenMode() === 3 && Fullscreen.getChooseModeSession() === 1) {
		return false;
	} else {
		return ServerStyle.getFullscreenMode() !== 1;
	}
});

