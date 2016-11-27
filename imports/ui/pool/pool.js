//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Learned} from "../../api/learned.js";
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

function checkFilters() {
	if (Session.get('poolFilterAuthor')) {
		$(".filterAuthorGroup").addClass('active');
	} else {
		$(".filterAuthorGroup").removeClass('active').first().text(TAPi18n.__('set-list.author'));
	}
	if (Session.get('poolFilterCollege')) {
		$(".filterCollegeGroup").addClass('active');
	} else {
		$(".filterCollegeGroup").removeClass('active').first().text(TAPi18n.__('set-list.college'));
	}
	if (Session.get('poolFilterCourse')) {
		$(".filterCourseGroup").addClass('active');
	} else {
		$(".filterCourseGroup").removeClass('active').first().text(TAPi18n.__('set-list.course'));
	}
	if (Session.get('poolFilterModule')) {
		$(".filterModuleGroup").addClass('active');
	} else {
		$(".filterModuleGroup").removeClass('active').first().text(TAPi18n.__('set-list.module'));
	}
	$("#filterCheckbox input:checkbox").each(function () {
		if (!Session.get('poolFilter').includes($(this).val())) {
			$(this).prop('checked', false);
			$(this).closest("label").removeClass('active');
		} else {
			$(this).prop('checked', true);
			$(this).closest("label").addClass('active');
		}
	});
}

function deadline(cardset) {
	var active = Learned.findOne({cardset_id: cardset._id, user_id: Meteor.userId(), active: true});
	var deadline = new Date(active.currentDate.getTime() + cardset.daysBeforeReset * 86400000);
	if (deadline.getTime() > cardset.learningEnd.getTime()) {
		return (TAPi18n.__('notifications.deadline') + cardset.learningEnd.toLocaleDateString());
	} else {
		return (TAPi18n.__('notifications.deadline') + deadline.toLocaleDateString() + TAPi18n.__('notifications.warning'));
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
		return Meteor.users.find({}, {fields: {_id: 1, profile: 1}, sort: {"profile.birthname": 1}}).fetch();
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
	'click #resetBtn': function () {
		Session.set('poolSortTopic', {name: 1});
		Session.set('poolFilterAuthor');
		Session.set('poolFilterCollege');
		Session.set('poolFilterCourse');
		Session.set('poolFilterModule');
		Session.set('poolFilter', ["free", "edu", "pro"]);
		checkFilters();
	},
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
			button.first().text(TAPi18n.__('set-list.author'));
		} else {
			button.addClass('active');
			button.first().text($(event.target).html());
		}
		Session.set('poolFilterAuthor', $(event.target).data('id'));
	},
	'click .filterCollege': function (event) {
		var button = $(".filterCollegeGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
			button.first().text(TAPi18n.__('set-list.college'));
		} else {
			button.addClass('active');
			button.first().text($(event.target).html());
		}
		Session.set('poolFilterCollege', $(event.target).data('id'));
	},
	'click .filterCourse': function (event) {
		var button = $(".filterCourseGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
			button.first().text(TAPi18n.__('set-list.course'));
		} else {
			button.addClass('active');
			button.first().text($(event.target).html());
		}
		Session.set('poolFilterCourse', $(event.target).data('id'));
	},
	'click .filterModule': function (event) {
		var button = $(".filterModuleGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
			button.first().text(TAPi18n.__('set-list.module'));
		} else {
			button.addClass('active');
			button.first().text($(event.target).html());
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
	if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), [
			'admin',
			'editor'
		])) {
		Bert.alert(TAPi18n.__('notifications.admin'), 'success', 'growl-bottom-right');
	}
	var toLearn = Cardsets.find({webNotification: true, learningActive: true}).fetch();
	for (var i = 0; i < toLearn.length; ++i) {
		if (Learned.find({cardset_id: toLearn[i]._id, user_id: Meteor.userId(), active: true}).count() !== 0) {
			notification(TAPi18n.__('notifications.heading'), TAPi18n.__('notifications.content') + toLearn[i].name + deadline(toLearn[i]));
		}
	}
	checkFilters();
});
