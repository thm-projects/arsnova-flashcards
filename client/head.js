// STARTUP IMPORTS

import {Meteor} from "meteor/meteor";
import "../imports/startup/client/i18n.js";
import "../imports/startup/client/registerhelper.js";
import "../imports/startup/client/registerServiceWorker";
import "../imports/startup/client/routes.js";
import "../imports/ui/main/main.js";

window.addEventListener("load", function () {
	window.cookieconsent.initialise({
		"palette": {
			"popup": {
				"background": "#4A5C66",
				"text": "#ffffff"
			},
			"button": {
				"background": "#FF9F30",
				"text": "#ffffff"
			}
		},
		"theme": "edgeless",
		"position": "bottom-right",

		"content": {
			"message": Meteor.settings.public.welcome.title.first + "🍅" + Meteor.settings.public.welcome.title.last + " verwendet Cookies. Wenn du auf dieser Seite bleibst, stimmst du der Cookie-Nutzung zu.",
			"dismiss": "Ich stimme zu",
			"link": "→ Datenschutz",
			"href": "/datenschutz"
		}
	});
});
// USER INTERFACE IMPORTS -------------------------------------------------
