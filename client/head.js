// STARTUP IMPORTS

import "../imports/startup/client/i18n.js";
import "../imports/startup/client/registerhelper.js";
import "../imports/startup/client/registerServiceWorker";
import "../imports/startup/client/routes.js";
import "../imports/ui/main/main.js";

window.addEventListener("load", function () {
	window.cookieconsent.initialise({
		"palette": {
			"popup": {
				"background": "#F5AA01",
				"text": "#ffffff"
			},
			"button": {
				"background": "#4A5C66",
				"text": "#ffffff"
			}
		},
		"theme": "classic",
		"position": "bottom-right",

		"content": {
			"message": "THMcards verwendet Cookies. Wenn Sie auf der Seite weitersurfen, stimmen Sie der Cookie-Nutzung zu.",
			"dismiss": "Ich stimme zu",
			"link": "Details zum Datenschutz",
			"href": "/datenschutz"
		}
	});
});
// USER INTERFACE IMPORTS -------------------------------------------------
