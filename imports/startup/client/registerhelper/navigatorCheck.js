import {NavigatorCheck} from "../../../api/navigatorCheck";

Template.registerHelper("isIOSOrSafari", function () {
	return (NavigatorCheck.isIOS() | NavigatorCheck.isSafari());
});

Template.registerHelper("isIOSSafari", function () {
	return (NavigatorCheck.isIOS() && NavigatorCheck.isSafari());
});

Template.registerHelper("isIOS", function () {
	return NavigatorCheck.isIOS();
});

Template.registerHelper("isSmartphone", function () {
	return NavigatorCheck.isSmartphone();
});
