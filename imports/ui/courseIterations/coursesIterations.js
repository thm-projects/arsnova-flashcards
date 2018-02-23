//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CourseIterations} from "../../api/courseIterations.js";
import "./coursesIterations.js";
import "./coursesIterations.html";
import {cleanModal} from "../forms/cardsetCourseIterationForm";

Session.setDefault('courseId', undefined);
Session.set('moduleActive', true);

Meteor.subscribe("courses");


/*
 * ############################################################################
 * courseIterations
 * ############################################################################
 */


Template.courseIterations.onRendered(function () {
	cleanModal();
});

/*
 * ############################################################################
 * courseIterationsList
 * ############################################################################
 */

Template.courseIterationsList.helpers({
	courseIterationsList: function () {
		return CourseIterations.find();
	}
});

/*
 * ############################################################################
 * courseIterationsRow
 * ############################################################################
 */

Template.courseIterationsRow.helpers({
	gotDescription: function (text) {
		if (text !== "" && text !== undefined) {
			return true;
		}
	}
});
