// STARTUP -------------------------------------------------------
import { WebApp } from 'meteor/webapp';

// Server startup files
import "../imports/startup/server/accounts-config.js";
import "../imports/startup/server/initialize.js";
import "../imports/startup/server/browser-policy.js";

// Server settings
import "../imports/config/accounts.js";

//Server methods and subscriptions
import "../imports/api/meteorMethods/accounts.js";
import "../imports/api/meteorMethods/adminSettings.js";
import "../imports/api/meteorMethods/allUsers.js";
import "../imports/api/meteorMethods/billing.js";
import "../imports/api/meteorMethods/cards.js";
import "../imports/api/meteorMethods/cardsetApiAccess.js";
import "../imports/api/meteorMethods/cardsets.js";
import "../imports/api/meteorMethods/cardsetUserlist.js";
import "../imports/api/meteorMethods/collegesCourses.js";
import "../imports/api/meteorMethods/export.js";
import "../imports/api/meteorMethods/import.js";
import "../imports/api/meteorMethods/learned.js";
import "../imports/api/meteorMethods/leitner.js";
import "../imports/api/meteorMethods/matomo.js";
import "../imports/api/meteorMethods/notifications.js";
import "../imports/api/meteorMethods/paid.js";
import "../imports/api/meteorMethods/ratings.js";
import "../imports/api/meteorMethods/transcriptBonus.js";
import "../imports/api/meteorMethods/useCases.js";
import "../imports/api/meteorMethods/userData.js";
import "../imports/api/meteorMethods/webPushSubscriptions.js";
import "../imports/api/meteorMethods/wozniak.js";
import "../imports/api/rest/cardsetApiAccess.js";
import "../imports/api/subscriptions/adminSettings.js";
import "../imports/api/subscriptions/cards.js";
import "../imports/api/subscriptions/cardsetApiAccess.js";
import "../imports/api/subscriptions/cardsets.js";
import "../imports/api/subscriptions/collegesCourses.js";
import "../imports/api/subscriptions/colorThemes.js";
import "../imports/api/subscriptions/leitner.js";
import "../imports/api/subscriptions/leitnerHistory.js";
import "../imports/api/subscriptions/leitnerTasks.js";
import "../imports/api/subscriptions/notifications.js";
import "../imports/api/subscriptions/paid.js";
import "../imports/api/subscriptions/ratings.js";
import "../imports/api/subscriptions/serverInventory.js";
import "../imports/api/subscriptions/transcriptBonus.js";
import "../imports/api/subscriptions/users.js";
import "../imports/api/subscriptions/webPushNotifications.js";
import "../imports/api/subscriptions/workload.js";
import "../imports/api/subscriptions/wozniak.js";

// Server only leitner functions
import "./leitner.js";

WebApp.addHtmlAttributeHook(() => ({lang: 'de', charset: 'utf-8'}));
