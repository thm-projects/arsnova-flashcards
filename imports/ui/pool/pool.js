//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {Cardsets} from '../../api/cardsets.js';

import './pool.html';


Meteor.subscribe("categories");
Meteor.subscribe("cardsets");

Session.setDefault('poolSortTopic', {name: 1});
Session.setDefault('poolFilterAutor');
Session.setDefault('poolFilterModule');
Session.setDefault('poolFilterCourse');
Session.setDefault('poolFilterDepartment');
Session.setDefault('poolFilterStudyType');
Session.setDefault('poolFilter', ["free", "edu", "pro"]);

/**
 * ############################################################################
 * category
 * ############################################################################
 */

function getCollection(sortFilter, listType) {
	//0 =
	var query = {};
	query.visible = true;
	query.kind = {$in: Session.get('poolFilter')};
	if (Session.get('poolFilterAutor') && listType === 0) {
		query.lastName = Session.get('poolFilterAutor');
	}
	if (Session.get('poolFilterModule') && listType === 0) {
		query.moduleShort = Session.get('poolFilterModule');
	}
	if (Session.get('poolFilterCourse') && listType === 0) {
		query.academicCourse = Session.get('poolFilterCourse');
	}
	if (Session.get('poolFilterDepartment') && listType === 0) {
		query.department = Session.get('poolFilterDepartment');
	}
	if (Session.get('poolFilterStudyType') && listType === 0) {
		query.studyType = Session.get('poolFilterStudyType');
	}
	if (listType === 0) {
		return Cardsets.find(query, {sort: sortFilter});
	} else {
		return Cardsets.find(query, {sort: sortFilter}).fetch();
	}
}

Template.category.helpers({
	getDecks: function () {
		return getCollection(Session.get('poolSortTopic'), 0);
	},
	getAutors: function () {
		var Array = getCollection({lastName: 1}, 1);
		return _.uniq(Array, false, function (d) {
			return (d.lastName);
		});
	},
	getModules: function () {
		var Array = getCollection({moduleLong: 1}, 1);
		return _.uniq(Array, false, function (d) {
			return d.moduleLong;
		});
	},
	getCourses: function () {
		var Array = getCollection({academicCourse: 1}, 1);
		var distinctArray = _.uniq(Array, false, function (d) {
			return d.academicCourse;
		});
		return _.pluck(distinctArray, 'academicCourse');
	},
	getDepartments: function () {
		var Array = getCollection({department: 1}, 1);
		return _.uniq(Array, false, function (d) {
			return d.department;
		});
	},
	getTypes: function () {
		var Array = getCollection({studyType: 1}, 1);
		var distinctArray = _.uniq(Array, false, function (d) {
			return d.studyType;
		});
		return _.pluck(distinctArray, 'studyType');
	}
});

Template.poolCardsetRow.helpers({
	getKind: function () {
		switch (this.kind) {
			case "free":
				return '<span class="label label-default">Free</span>';
			case "edu":
				return '<span class="label label-success">Edu</span>';
			case "pro":
				return '<span class="label label-info">Pro</span>';
			default:
				return '<span class="label label-danger">Undefined!</span>';
		}
	}
});
Template.category.events({
	'click .sortTopic': function () {
		var sort = Session.get('poolSortTopic');
		if (sort.name === 1) {
			Session.set('poolSortTopic', {name: -1});
		} else {
			Session.set('poolSortTopic', {name: 1});
		}
	},
	'click .filterAutor': function (event) {
		Session.set('poolFilterAutor', $(event.target).data('id'));
	},
	'click .filterModule': function (event) {
		Session.set('poolFilterModule', $(event.target).data('id'));
	},
	'click .filterCourse': function (event) {
		Session.set('poolFilterCourse', $(event.target).data('id'));
	},
	'click .filterDepartment': function (event) {
		Session.set('poolFilterDepartment', $(event.target).data('id'));
	},
	'click .filterType': function (event) {
		Session.set('poolFilterStudyType', $(event.target).data('id'));
	},
	'change #filterCheckbox': function () {
		var filter = [];
		$("#filterCheckbox input:checkbox:checked").each(function () {
			filter.push($(this).val());
		});
		Session.set('poolFilter', filter);
	}
});

Template.category.onDestroyed(function () {
	Session.set('poolSort', {relevance: -1});
});
