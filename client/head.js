// STARTUP IMPORTS

import "../imports/startup/client/i18n.js";
import "../imports/startup/client/registerhelper.js";
import "../imports/startup/client/registerServiceWorker";
import "../imports/startup/client/routes.js";
import "../imports/ui/main/main.js";

window.cookieconsent_options = {
	"message": "THMcards verwendet Cookies, um Ihnen den bestmöglichen Service zu gewährleisten. Wenn Sie auf der Seite weitersurfen stimmen Sie der Cookie-Nutzung zu.",
	"dismiss": "Ich stimme zu",
	"learnMore": " Mehr über Datenschutz",
	"link": "/datenschutz",
	"theme": "light-top"
};

// USER INTERFACE IMPORTS -------------------------------------------------
