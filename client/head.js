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
				"background": "#4a5c66",
				"text": "#80ba24"
			},
			"button": {
				"background": "#80ba24",
				"text": "#ffffff"
			}
		},
		"theme": "classic",
		"position": "top-left",

		"content": {
			"message": "THMcards verwendet Cookies, um Ihnen den bestmöglichen Service zu gewährleisten. Wenn Sie auf der Seite weitersurfen, stimmen Sie der Cookie-Nutzung zu.",
			"dismiss": "Ich stimme zu.",
			"link": "Mehr über Datenschutz",
			"href": "/datenschutz"
		}
	});
});
// USER INTERFACE IMPORTS -------------------------------------------------
