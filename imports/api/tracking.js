import {Meteor} from 'meteor/meteor';

const idSite = Meteor.settings.public.matomo.MATOMO_SITE_ID;
const matomoTrackingApiUrl = Meteor.settings.public.matomo.MATOMO_URL;

var _paq = window._paq || [];
_paq.push(['setTrackerUrl', matomoTrackingApiUrl]);
_paq.push(['setSiteId', idSite]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);

