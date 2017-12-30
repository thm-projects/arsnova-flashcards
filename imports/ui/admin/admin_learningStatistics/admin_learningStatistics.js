//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import "./admin_learningStatistics.html";

Meteor.subscribe('leitner', function () {
	Session.set('data_loaded', true);
});
