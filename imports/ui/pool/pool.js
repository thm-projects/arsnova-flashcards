//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {Cardsets} from '../../api/cardsets.js';

import './pool.html';


Meteor.subscribe("categories");
Meteor.subscribe("cardsets");

Session.setDefault('poolSortTopic', {name: 1});
Session.setDefault('poolFilterAuthor');
Session.setDefault('poolFilterModule');
Session.setDefault('poolFilterDiscipline');
Session.setDefault('poolFilterSection');
Session.setDefault('poolFilterMajor');
Session.setDefault('poolFilter', ["free", "edu", "pro"]);

/**
 * ############################################################################
 * category
 * ############################################################################
 */

function getCollection(sortFilter, filterList, limit) {
	var query = {};
	query.visible = true;
	query.kind = {$in: Session.get('poolFilter')};
	if (Session.get('poolFilterAuthor') && !filterList) {
		query.lastName = Session.get('poolFilterAuthor');
	}
	if (Session.get('poolFilterModule') && !filterList) {
		query.moduleShort = Session.get('poolFilterModule');
	}
	if (Session.get('poolFilterDiscipline') && !filterList) {
		query.discipline = Session.get('poolFilterDiscipline');
	}
	if (Session.get('poolFilterSection') && !filterList) {
		query.section = Session.get('poolFilterSection');
	}
	if (Session.get('poolFilterMajor') && !filterList) {
		query.major = Session.get('poolFilterMajor');
	}
	if (!filterList) {
		return Cardsets.find(query, {sort: sortFilter}, {limit: limit});
	} else {
		return Cardsets.find(query, {sort: sortFilter}).fetch();
	}
}

Template.category.helpers({
	getDecks: function () {
		return getCollection(Session.get('poolSortTopic'), 0);
	},
	getAuthors: function () {
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
	getDisciplines: function () {
		var Array = getCollection({discipline: 1}, 1);
		var distinctArray = _.uniq(Array, false, function (d) {
			return d.discipline;
		});
		return _.pluck(distinctArray, 'discipline');
	},
	getSections: function () {
		var Array = getCollection({section: 1}, 1);
		return _.uniq(Array, false, function (d) {
			return d.section;
		});
	},
	getMajors: function () {
		var Array = getCollection({major: 1}, 1);
		var distinctArray = _.uniq(Array, false, function (d) {
			return d.major;
		});
		return _.pluck(distinctArray, 'major');
	},
	odd: function (index) {
		return !(index % 2 === 0);
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
	'click .filterAuthor': function (event) {
		var button = $(".filterAuthorGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterAuthor', $(event.target).data('id'));
	},
	'click .filterModule': function (event) {
		var button = $(".filterModuleGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterModule', $(event.target).data('id'));
	},
	'click .filterDiscipline': function (event) {
		var button = $(".filterDisciplineGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterDiscipline', $(event.target).data('id'));
	},
	'click .filterSection': function (event) {
		var button = $(".filterSectionGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterSection', $(event.target).data('id'));
	},
	'click .filterMajor': function (event) {
		var button = $(".filterMajorGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterMajor', $(event.target).data('id'));
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
