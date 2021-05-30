import "./themeIcon.html";
import {ThemeSwitcher} from "../../../../../util/themeSwitcher";

Template.mainNavigationFooterItemThemeIcon.events({
	"click .themeSelection": function (event) {
		ThemeSwitcher.saveGuestTheme($(event.currentTarget).data('id'));
	}
});
