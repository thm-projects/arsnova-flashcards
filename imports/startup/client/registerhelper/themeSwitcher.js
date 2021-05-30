import {ServerStyle} from "../../../util/styles";
import {ThemeSwitcher} from "../../../util/themeSwitcher";

Template.registerHelper("gotMultipleThemes", function () {
	return ServerStyle.getAppThemes().length > 1;
});

Template.registerHelper("getAppThemes", function () {
	return ServerStyle.getAppThemes();
});

Template.registerHelper("getActiveTheme", function () {
	let activeTheme = ServerStyle.getActiveTheme();
	return TAPi18n.__(`themes.list.${activeTheme.theme}`);
});

Template.registerHelper("getAppThemeName", function (theme) {
	let string = TAPi18n.__(`themes.list.${theme}`);
	if (theme === ServerStyle.getDefaultThemeID()) {
		string += `&nbsp;<span class="hidden-xs">${TAPi18n.__(`themes.profile.default`)}</span>`;
	}
	let savedThemeID = ThemeSwitcher.getSavedThemeID();
	if (savedThemeID !== undefined && theme === savedThemeID) {
		string += `&nbsp;<span class="hidden-xs">${TAPi18n.__(`themes.profile.saved`)}</span>`;
	}
	return string;
});
