//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {Authors} from '../../api/authors.js';
import {Cardsets} from '../../api/cardsets.js';
import {Categories} from '../../api/categories.js';
import {Disciplines} from '../../api/disciplines.js';
import {Majors} from '../../api/majors.js';
import {Modules} from '../../api/modules.js';

import './pool.html';

var ITEMS_INCREMENT = 20;
Session.setDefault('itemsLimit', ITEMS_INCREMENT);

Meteor.subscribe("authors");
Meteor.subscribe("cardsets");
Meteor.subscribe("categories");
Meteor.subscribe("disciplines");
Meteor.subscribe("majors");
Meteor.subscribe("modules");

Session.setDefault('poolSortTopic', {name: 1});
Session.setDefault('poolFilterAuthor');
Session.setDefault('poolFilterModule');
Session.setDefault('poolFilterDiscipline');
Session.setDefault('poolFilterCategory');
Session.setDefault('poolFilterMajor');
Session.setDefault('poolFilter', ["free", "edu", "pro"]);

/**
 * ############################################################################
 * category
 * ############################################################################
 */

Template.category.helpers({
	getDecks: function () {
		var query = {};
		query.visible = true;
		query.kind = {$in: Session.get('poolFilter')};
		if (Session.get('poolFilterAuthor')) {
			query.owner = Session.get('poolFilterAuthor');
		}
		if (Session.get('poolFilterModule')) {
			query.module = Session.get('poolFilterModule');
		}
		if (Session.get('poolFilterDiscipline')) {
			query.discipline = Session.get('poolFilterDiscipline');
		}
		if (Session.get('poolFilterCategory')) {
			query.category = Session.get('poolFilterCategory');
		}
		if (Session.get('poolFilterMajor')) {
			query.major = Session.get('poolFilterMajor');
		}
		return Cardsets.find(query, {sort: Session.get('poolSortTopic')});
	},
	getAuthors: function () {
		return Authors.find({}, {sort: {lastName: 1}});
	},
	getModules: function () {
		return Modules.find({}, {sort: {name: 1}});
	},
	getDisciplines: function () {
		return Disciplines.find({}, {sort: {name: 1}});
	},
	getCategories: function () {
		return Categories.find({}, {sort: {name: 1}});
	},
	getMajors: function () {
		return Majors.find({}, {sort: {name: 1}});
	},
	oddRow: function (index) {
		return !(index % 2 === 0);
	}
});


Template.poolCardsetRow.helpers({
	getAuthorName: function () {
		var author = Authors.findOne({owner: this.owner});
		if (typeof author !== 'undefined') {
			return author.degree + " " + author.firstName + " " + author.lastName;
		}
	},
	getModuleToken: function () {
		var module = Modules.findOne({_id: this.module});
		if (typeof module !== 'undefined') {
			return module.token;
		}
	},
	getDisciplineName: function () {
		var discipline = Disciplines.findOne({_id: this.discipline});
		if (typeof discipline !== 'undefined') {
			return discipline.name;
		}
	},
	getCategoryToken: function () {
		var category = Categories.findOne({_id: this.category});
		if (typeof category !== 'undefined') {
			return category.token;
		}
	},
	getMajorToken: function () {
		var major = Majors.findOne({_id: this.major});
		if (typeof major !== 'undefined') {
			return major.token;
		}
	},
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
	'click .filterCategory': function (event) {
		var button = $(".filterCategoryGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterCategory', $(event.target).data('id'));
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
