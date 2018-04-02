//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CourseIterations} from "../../api/courseIterations.js";
import "./coursesIterations.js";
import "./coursesIterations.html";
import {cleanModal} from "../forms/cardsetCourseIterationForm";
import {getTargetAudienceAbbreviation, getTargetAudienceName} from "../../api/targetAudience";
import {
	filterAuthor, filterCheckbox, filterCollege, filterCourse, filterModule, filterSemester, filterTargetAudience,
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
	},
	getTargetAudienceName: function (targetAudience) {
		return getTargetAudienceName(targetAudience);
	}
});

Template.courseIterationsRow.events({
	'click .deleteCourseIteration': function (event) {
		Session.set('courseIterationId', $(event.target).data('id'));
	},
	'click .filterAuthor': function (event) {
		filterAuthor(event);
	},
	'click .filterTargetAudience': function (event) {
		filterTargetAudience(event);
	},
	'click .filterCollege': function (event) {
		filterCollege(event);
	},
	'click .filterCourse': function (event) {
		filterCourse(event);
	},
	'click .filterSemester': function (event) {
		filterSemester(event);
	},
	'click .filterModule': function (event) {
		filterModule(event);
	},
	'click .filterCheckbox': function (event) {
		Session.set('poolFilter', [$(event.target).data('id')]);
		filterCheckbox();
	},
	'click .showLicense': function (event) {
		Session.set('selectedCardset', $(event.target).data('id'));
	},
	'click .poolText ': function (event) {
		Session.set('selectedCardset', $(event.target).data('id'));
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
