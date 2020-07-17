import {ServerSettings} from "../../../../util/settings";
import {ServerStyle} from "../../../../util/styles";

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
