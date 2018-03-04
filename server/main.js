// STARTUP -------------------------------------------------------
import "../imports/startup/server/accounts-config.js";
import "../imports/startup/server/initialize.js";
import "../imports/startup/server/browser-policy.js";
import "../imports/api/cardsets.js";
import "../imports/api/cards.js";
import "../imports/api/learned.js";
import "./leitner.js";
import "./wordcloud.js";
import "../imports/api/ratings.js";
import "../imports/api/notifications.js";
import "../imports/api/paid.js";
import "../imports/api/userdata.js";
import "../imports/api/markdown.js";
import "../imports/api/upload.js";
import "../imports/api/allusers.js";
import "../imports/api/billing.js";
import "../imports/api/adminSettings.js";
import "../imports/api/cardsetUserlist.js";
import "../imports/api/cardsets.js";
import "../imports/api/cards.js";
import "../imports/api/colleges_courses.js";
import "../imports/api/courseIterations.js";
import "../imports/api/ratings.js";
import "../imports/api/notifications.js";
import "../imports/api/paid.js";
import "../imports/api/adminSettings.js";
import "../imports/api/webPushSubscriptions.js";

// STARTUP -------------------------------------------------------

import { WebApp } from 'meteor/webapp';

WebApp.addHtmlAttributeHook(() => ({lang: 'de'}));
