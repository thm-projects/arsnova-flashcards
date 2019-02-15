// STARTUP IMPORTS

import "../imports/startup/client/i18n.js";
import "../imports/startup/client/registerhelper.js";
import "../imports/startup/client/registerServiceWorker";
import "../imports/startup/client/routes.js";
import "../imports/ui/main/main.js";
import {ServerStyle} from "../imports/api/styles.js";

window.addEventListener("load", function () {
	window.cookieconsent.initialise({
		"palette": {
			"popup": {
				"background": "#4A5C66",
				"text": "#ffffff"
			},
			"button": {
				"background": "#FF9F30",
				"text": "#4a5c66"
			}
		},
		"theme": "edgeless",
		"position": "bottom-right",

		"content": {
			"message": ServerStyle.getFirstAppTitle() + "." + ServerStyle.getLastAppTitle() + " verwendet Cookies. Wenn du auf dieser Seite bleibst, stimmst du der Cookie-Nutzung zu.",
			"dismiss": "Ich stimme zu",
			"link": "→ Datenschutz",
			"href": "/datenschutz"
		}
	});
});
// USER INTERFACE IMPORTS -------------------------------------------------
