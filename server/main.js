// STARTUP -------------------------------------------------------
import { WebApp } from 'meteor/webapp';
import "../imports/startup/server/accounts-config.js";
import "../imports/startup/server/initialize.js";
import "../imports/startup/server/browser-policy.js";
import "../imports/api/subscriptions/adminSettings.js";
import "../imports/api/subscriptions/cards.js";
import "../imports/api/subscriptions/cardsets.js";
import "../imports/api/subscriptions/collegesCourses.js";
import "../imports/api/subscriptions/colorThemes.js";
import "../imports/api/subscriptions/leitner.js";
import "../imports/api/subscriptions/leitnerHistory.js";
import "../imports/api/subscriptions/notifications.js";
import "../imports/api/subscriptions/paid.js";
import "../imports/api/subscriptions/ratings.js";
import "../imports/api/subscriptions/serverInventory.js";
import "../imports/api/subscriptions/transcriptBonus.js";
import "../imports/api/subscriptions/users.js";
import "../imports/api/subscriptions/workload.js";
import "../imports/api/subscriptions/wozniak.js";
import "../imports/api/adminSettings.js";
import "../imports/api/allusers.js";
import "../imports/api/billing.js";
import "../imports/api/cards.js";
import "../imports/api/cardsets.js";
import "../imports/api/cardsetAPI.js";
import "../imports/api/cardsetUserlist.js";
import "../imports/api/colleges_courses.js";
import "../imports/api/import.js";
import "../imports/api/learned.js";
import "../imports/api/leitner.js";
import "../imports/api/notifications.js";
import "../imports/api/paid.js";
import "../imports/api/ratings.js";
import "../imports/api/export.js";
import "../imports/api/import.js";
import "../imports/api/userdata.js";
import "../imports/api/transcriptBonus.js";
import "../imports/api/webPushSubscriptions.js";
import "../imports/api/wozniak.js";
import "./leitner.js";

WebApp.addHtmlAttributeHook(() => ({lang: 'de', charset: 'utf-8'}));
