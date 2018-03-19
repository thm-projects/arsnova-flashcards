//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CourseIterations} from "../../api/courseIterations.js";
import "./coursesIterations.js";
import "./coursesIterations.html";
import {cleanModal} from "../forms/cardsetCourseIterationForm";
import {getTargetAudienceAbbreviation} from "../../api/targetAudience";

Session.set('courseIterationId', undefined);
Session.set('moduleActive', true);
Meteor.subscribe("courseIterations");

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
		return CourseIterations.find({owner: Meteor.userId()});
	}
});

Template.courseIterationsList.events({
	'click #createCourse': function () {
		cleanModal();
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
	},
	getTargetAudienceAbbreviation: function (targetAudience) {
		return getTargetAudienceAbbreviation(targetAudience);
	}
});

Template.courseIterationsRow.events({
	'click .deleteCourseIteration': function (event) {
		Session.set('courseIterationId', $(event.target).data('id'));
	}
});


/*
 * ############################################################################
 * courseIterationsEmpty
 * ############################################################################
 */

Template.courseIterationsEmpty.events({
	'click #createCourse': function () {
		cleanModal();
	}
});

/*
 * ############################################################################
 * courseIterationDeleteForm
 * ############################################################################
 */

Template.courseIterationDeleteForm.events({
	'click #deleteCourseIteration': function () {
		$('#confirmDeleteModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteCourseIteration", Session.get('courseIterationId'));
		}).modal('hide');
	}
});
