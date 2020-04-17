// STARTUP IMPORTS
import "../imports/startup/client/i18n.js";
import "../imports/startup/client/registerhelper.js";
import "../imports/startup/client/registerServiceWorker";
import "../imports/startup/client/routes.js";
import "../imports/ui/main/main.js";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
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
			"message": TAPi18n.__('cookieconsent.message', {firstAppTitle: ServerStyle.getFirstAppTitle(), lastAppTitle: ServerStyle.getLastAppTitle()}, (Session.get('activeLanguage'))),
			"dismiss": TAPi18n.__('cookieconsent.dismiss', {}, (Session.get('activeLanguage'))),
			"link": TAPi18n.__('cookieconsent.link', {}, (Session.get('activeLanguage'))),
			"href": "/datenschutz"
		}
	});
	if (Meteor.settings.public.matomo.USE_MATOMO) {
		var siteID = Meteor.settings.public.matomo.MATOMO_SITE_ID;
		var _paq = window._paq || [];
		/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		(function () {
			var u = Meteor.settings.public.matomo.MATOMO_URL;
			_paq.push(['setTrackerUrl', u + 'matomo.php']);
			_paq.push(['setSiteId', siteID]);
			var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
			g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'matomo.js'; s.parentNode.insertBefore(g,s);
		})();
	}
});

// USER INTERFACE IMPORTS -------------------------------------------------
