// STARTUP IMPORTS
import "../imports/startup/client/i18n.js";
import "../imports/config/accounts.js";
import "../imports/ui/main/main.js";
import "../imports/startup/client/routes/main.js";
import "../imports/startup/client/registerhelper/main.js";
import "../imports/startup/client/registerServiceWorker";
import {Session} from "meteor/session";
import {ServerStyle} from "../imports/util/styles.js";

window.addEventListener("load", function () {
		window.cookieconsent.initialise({
			"palette": {
				"popup": {
					"background": "#4A5C66",
					"text": "#ffffff"
				},
				"button": {
					"background": "lightgrey",
					"text": "#4a5c66"
				}
			},
			"theme": "edgeless",
			"position": "bottom-right",

			"content": {
				"message": TAPi18n.__('cookieconsent.message', {firstAppTitle: ServerStyle.getFirstAppTitle(), lastAppTitle: ServerStyle.getLastAppTitle()}, (Session.get('activeLanguage'))),
				"dismiss": TAPi18n.__('cookieconsent.dismiss', {}, (Session.get('activeLanguage'))),
				"link": TAPi18n.__('cookieconsent.link', {}, (Session.get('activeLanguage'))),
				"href": "/datenschutz"
			}
		});
	});

// USER INTERFACE IMPORTS -------------------------------------------------
