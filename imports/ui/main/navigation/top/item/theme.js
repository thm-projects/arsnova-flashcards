import "./theme.html";
import {Session} from "meteor/session";
import {ThemeSwitcher} from "../../../../../util/themeSwitcher";

Template.mainNavigationTopItemTheme.events({
	"click .themeSelection": function (event) {
		Session.set("theme", $(event.currentTarget).data('id'));
		ThemeSwitcher.displayTheme();
	}
});
