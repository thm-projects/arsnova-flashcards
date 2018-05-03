//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CourseIterations} from "../../api/courseIterations.js";
import "./coursesIterations.js";
import "./coursesIterations.html";
import {cleanModal} from "../forms/cardsetCourseIterationForm";
import {
	prepareQuery,
	resetFilters
} from "../filter/filter";

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
		let query = Session.get('filterQuery');
		prepareQuery();
		return CourseIterations.find(query, {sort: Session.get('poolSortTopic'), limit: Session.get('itemsLimit')});
	}
});

Template.courseIterationsList.onCreated(function () {
	resetFilters();
});

Template.courseIterationsList.events({
	'click #createCourse': function () {
		cleanModal();
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
	'click #alsoDeleteAssociatedDecks': function () {
		if ($('#alsoDeleteAssociatedDecks').is(":checked")) {
			$("#underDevelopmentModal").modal("show");
			$('#alsoDeleteAssociatedDecks').attr("checked", false);
		}
	},
	'click #deleteCourseIteration': function () {
		// Uncheck following line, if course cards feature is implemented.
		// const alsoDeleteDecks = $('#alsoDeleteAssociatedDecks').is(":checked");
		const alsoDeleteDecks = false;
		Meteor.call("deleteCourseIteration", Session.get('courseIterationId'), alsoDeleteDecks, (error) => {
			if (error) {
				if (error.error === "not-implemented") {
					$("#underDevelopmentModal").modal("show");
				} else {
					console.error(error);
				}
			} else {
				$('#confirmDeleteCourseIterationModal').modal('hide');
			}
		});
	}
});
