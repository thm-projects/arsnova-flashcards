import "./item/about.js";
import "./item/agb.js";
import "./item/backToHome.js";
import "./item/datenschutz.js";
import "./item/demo.js";
import "./item/faq.js";
import "./item/help.js";
import "./item/impressum.js";
import "./item/learning.js";
import "./item/statistics.js";
import "./navigation.html";
import {Template} from "meteor/templating";

/*
 * ############################################################################
 * impressumNavigation
 * ############################################################################
 */

Template.impressumNavigation.events({
	'click a': function () {
		window.scrollTo(0, 0);
		$('#contact-nav-collapse').collapse('hide');
	}
});
