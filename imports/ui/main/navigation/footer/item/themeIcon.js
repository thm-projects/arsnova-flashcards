import "./themeIcon.html";
import {Session} from "meteor/session";
import {ThemeSwitcher} from "../../../../../util/themeSwitcher";

Template.mainNavigationFooterItemThemeIcon.events({
	"click .themeSelection": function (event) {
		Session.set("theme", $(event.currentTarget).data('id'));
		ThemeSwitcher.displayTheme();
	}
});
