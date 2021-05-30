import "./theme.html";
import {ThemeSwitcher} from "../../../../../util/themeSwitcher";

Template.mainNavigationTopItemTheme.events({
	"click .themeSelection": function (event) {
		ThemeSwitcher.saveGuestTheme($(event.currentTarget).data('id'));
	}
});
