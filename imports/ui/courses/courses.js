//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Courses} from "../../api/courses.js";
import "./courses.js";
import "./courses.html";

Session.setDefault('courseId', undefined);
Session.set('moduleActive', true);

Meteor.subscribe("Courses");


/*
 * ############################################################################
 * coursesList
 * ############################################################################
 */

Template.coursesList.helpers({
	coursesList: function () {
		return Courses.find().count();
	}
});
