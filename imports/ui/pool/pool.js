//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';
import {Cardsets} from '../../api/cardsets.js';
import "./pool.html";

Meteor.subscribe("cardsets");
Meteor.subscribe("allLearned");

Session.setDefault('poolSortTopic', {name: 1});
Session.setDefault('poolFilterAuthor');
Session.setDefault('poolFilterCollege');
Session.setDefault('poolFilterCourse');
Session.setDefault('poolFilterModule');
Session.setDefault('poolFilter', ["free", "edu", "pro"]);

/**
 * Creates a browser-popup with defined content
 * @param title Heading for notification
 * @param message Body of notification
 */
export function notification(title, message) {
	var messageIcon = "https://git.thm.de/uploads/project/avatar/374/cards_logo.png";
	//source: https://developer.mozilla.org/de/docs/Web/API/notification
	if (Notification.permission === "granted") {
		var options = {
			body: message,
			icon: messageIcon
		};
		new Notification(title, options);
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				var options = {
					body: message,
					icon: messageIcon
				};
				new Notification(title, options);
			}
		});
	}
}

var query = {};

function prepareQuery() {
	query = {};
	query.visible = true;
	query.kind = {$in: Session.get('poolFilter')};
	if (Session.get('poolFilterAuthor')) {
		query.owner = Session.get('poolFilterAuthor');
	}
	if (Session.get('poolFilterCollege')) {
		query.college = Session.get('poolFilterCollege');
	}
	if (Session.get('poolFilterCourse')) {
		query.course = Session.get('poolFilterCourse');
	}
	if (Session.get('poolFilterModule')) {
		query.module = Session.get('poolFilterModule');
	}
}

/**
 * ############################################################################
 * category
 * ############################################################################
 */

Template.category.helpers({
	filterAuthors: function () {
		prepareQuery();
		query.owner = this._id;
		return Cardsets.findOne(query);
	},
	getDecks: function () {
		prepareQuery();
		return Cardsets.find(query, {sort: Session.get('poolSortTopic')});
	},
	getAuthors: function () {
		return Meteor.users.find({}, {fields: {_id: 1, profile: 1}}).fetch();
	},
	getColleges: function () {
		prepareQuery();
		return _.uniq(Cardsets.find(query, {sort: {"college": 1}}).fetch(), function (item) {
			return item.college;
		});
	},
	getCourses: function () {
		prepareQuery();
		return _.uniq(Cardsets.find(query, {sort: {"course": 1}}).fetch(), function (item) {
			return item.course;
		});
	},
	getModules: function () {
		prepareQuery();
		return _.uniq(Cardsets.find(query, {sort: {"module": 1}}).fetch(), function (item) {
			return item.moduleNum;
		});
	},
	oddRow: function (index) {
		return (index % 2 === 1);
	}
});

Template.category.greeting = function () {
	return Session.get('authors');
};

Template.poolCardsetRow.helpers({
	getAuthorName: function () {
		var author = Meteor.users.findOne({"_id": this.owner});
		if (author) {
			var degree = "";
			if (author.profile.title) {
				degree = author.profile.title;
			}
			if (author.profile.givenname === undefined && author.profile.birthname === undefined) {
				author.profile.givenname = TAPi18n.__('cardset.info.undefinedAuthor');
				return author.profile.givenname;
			}
			return degree + " " + author.profile.givenname + " " + author.profile.birthname;
		}
	},
	getKind: function () {
		switch (this.kind) {
			case "free":
				return '<span class="label label-info">Free</span>';
			case "edu":
				return '<span class="label label-success">Edu</span>';
			case "pro":
				return '<span class="label label-danger">Pro</span>';
			default:
				return '<span class="label label-default">Undefined!</span>';
		}
	},
	getPrice: function () {
		if (this.price !== 0) {
			return this.price + '€';
		}
	},
	getLicense: function () {
		var licenseString = "";

		if (this.license.length > 0) {
			if (this.license.includes('by')) {
				licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" />');
			}
			if (this.license.includes('nc')) {
				licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" />');
			}
			if (this.license.includes('nd')) {
				licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" />');
			}
			if (this.license.includes('sa')) {
				licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="Weitergabe unter gleichen Bedingungen" />');
			}

			return new Spacebars.SafeString(licenseString);
		} else {
			return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="Kein Copyright" />');
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
	'click .filterCollege': function (event) {
		var button = $(".filterCollegeGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterCollege', $(event.target).data('id'));
	},
	'click .filterCourse': function (event) {
		var button = $(".filterCourseGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
		} else {
			button.addClass('active');
		}
		Session.set('poolFilterCourse', $(event.target).data('id'));
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

Template.pool.onRendered(function () {
	var toLearn = Cardsets.find({webNotification: true, learningActive: true}).fetch();
	for (var i = 0; i < toLearn.length; ++i) {
		notification(TAPi18n.__('notifications.heading'), TAPi18n.__('notifications.content') + toLearn[i].name);
	}
});
