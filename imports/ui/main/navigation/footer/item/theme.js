import "./theme.html";
import {ThemeSwitcher} from "../../../../../util/themeSwitcher";

Template.mainNavigationFooterItemTheme.events({
	"click .themeSelection": function (event) {
		ThemeSwitcher.saveGuestTheme($(event.currentTarget).data('id'));
	}
});
