import {ServerSettings} from "../../../../api/settings";
import {ServerStyle} from "../../../../api/styles";

Template.registerHelper('isMailEnabled', function () {
	return ServerSettings.isMailEnabled();
});

Template.registerHelper('isPushEnabled', function () {
	return ServerSettings.isPushEnabled();
});

Template.registerHelper('isNotificationEnabled', function () {
	return ServerSettings.isPushEnabled() || ServerSettings.isMailEnabled();
});

Template.registerHelper("isImprintMode", function (mode) {
	return ServerStyle.getConfig().imprint.folder === mode;
});
