//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Leitner} from "../../api/learned.js";
import "./pool.html";

Meteor.subscribe("cardsets");
Meteor.subscribe('ratings');

var items_increment = 14;

Session.setDefault('poolSortTopic', {name: 1});
Session.setDefault('poolFilterAuthor');
Session.setDefault('poolFilterCollege');
Session.setDefault('poolFilterCourse');
Session.setDefault('poolFilterModule');
Session.setDefault('poolFilterLearnphase');
Session.setDefault('poolFilterRating');
Session.setDefault('poolFilter', ["free", "edu", "pro"]);
Session.setDefault('selectedCardset');
Session.setDefault("itemsLimit", items_increment);

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
	if (Session.get('poolFilterLearnphase')) {
		query.learningActive = Session.get('poolFilterLearnphase');
	}
	if (Session.get('poolFilterRating')) {
		query.relevance = {$gt: Session.get('poolFilterRating')};
	}
}

function checkRemainingCards() {
	prepareQuery();
	if (Cardsets.find(query).count() > Session.get("itemsLimit")) {
		$(".showMoreResults").data("visible", true);
		return true;
	} else {
		$(".showMoreResults").data("visible", false);
		return false;
	}
}

function resetInfiniteBar() {
	Session.set("itemsLimit", items_increment);
	checkRemainingCards();
}

function filterCheckbox() {
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

function checkFilters() {
	if (Session.get('poolFilterAuthor')) {
		$(".filterAuthorGroup").addClass('active');
	} else {
		$(".filterAuthorGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterCollege')) {
		$(".filterCollegeGroup").addClass('active');
	} else {
		$(".filterCollegeGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterCourse')) {
		$(".filterCourseGroup").addClass('active');
	} else {
		$(".filterCourseGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterModule')) {
		$(".filterModuleGroup").addClass('active');
	} else {
		$(".filterModuleGroup").removeClass('active').first();
	}
	if (Session.get('poolFilterLearnphase') != null) {
		$(".filterLearnphase").addClass('active');
	} else {
		$(".filterLearnphase").removeClass('active').first();
	}
	if (Session.get('poolFilterRating')) {
		$(".filterRatingGroup").addClass('active');
	} else {
		$(".filterRatingGroup").removeClass('active').first();
	}
	filterCheckbox();
}

function resetFilters() {
	Session.set('poolSortTopic', {name: 1});
	Session.set('poolFilterAuthor');
	Session.set('poolFilterCollege');
	Session.set('poolFilterCourse');
	Session.set('poolFilterModule');
	Session.set('poolFilterRating');
	Session.set('poolFilter', ["free", "edu", "pro"]);
	Session.set('poolFilterLearnphase');
	checkFilters();
	resetInfiniteBar();
}

function filterAuthor(event) {
	Session.set('poolFilterAuthor', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterCollege(event) {
	Session.set('poolFilterCollege', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterCourse(event) {
	Session.set('poolFilterCourse', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterModule(event) {
	Session.set('poolFilterModule', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterLearnphase(event) {
	Session.set('poolFilterLearnphase', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterRating(event) {
	Session.set('poolFilterRating', $(event.target).data('id'));
	resetInfiniteBar();
}

/*
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
		return Cardsets.find(query, {sort: Session.get('poolSortTopic'), limit: Session.get('itemsLimit')});
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
	hasAuthorFilter: function () {
		return Session.get('poolFilterAuthor');
	},
	poolFilterAuthor: function (id) {
		return Session.get('poolFilterAuthor') === id;
	},
	hasCollegeFilter: function () {
		return Session.get('poolFilterCollege');
	},
	poolFilterCollege: function (college) {
		return Session.get('poolFilterCollege') === college;
	},
	hasCourseFilter: function () {
		return Session.get('poolFilterCourse');
	},
	poolFilterCourse: function (course) {
		return Session.get('poolFilterCourse') === course;
	},
	hasModuleFilter: function () {
		return Session.get('poolFilterModule');
	},
	poolFilterModule: function (module) {
		return Session.get('poolFilterModule') === module;
	},
	hasLearnphaseFilter: function () {
		return Session.get('poolFilterLearnphase');
	},
	poolFilterLearnphase: function (learningPhase) {
		return Session.get('poolFilterLearnphase') === learningPhase;
	},
	hasRatingFilter: function () {
		return Session.get('poolFilterRating');
	},
	poolFilterRating: function (rating) {
		return Session.get('poolFilterRating') === rating;
	},
	moreResults: function () {
		return checkRemainingCards();
	},
	selectingCardsetToLearn: function () {
		return Session.get('selectingCardsetToLearn');
	}
});

Template.category.greeting = function () {
	return Session.get('authors');
};

Template.category.events({
	'click #cancelSelection': function () {
		Session.set('selectingCardsetToLearn', false);
		Router.go('learn');
	}
});

Template.enterActiveLearnphaseModal.events({
	'click #enterActiveLearnphaseConfirm': function () {
		if (Session.get('selectedCardset')) {
			$('#enterActiveLearnphaseModal').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
			$('#enterActiveLearnphaseModal').on('hidden.bs.modal', function () {
				Router.go('cardsetdetailsid', {
					_id: Session.get('selectedCardset')
				});
			});
		}
	}
});

Template.showLicense.helpers({
	getTopic: function () {
		if (Session.get('selectedCardset')) {
			var item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return item.name;
		}
	},
	getLicenseCount: function () {
		if (Session.get('selectedCardset')) {
			var item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return (item.license.length > 0);
		}
	},
	getLicenseType: function (type) {
		if (Session.get('selectedCardset')) {
			var item = Cardsets.findOne({_id: Session.get('selectedCardset')});
			return (item.license.includes(type));
		}
	}
});

Template.poolCardsetRow.helpers({
	isAlreadyLearning: function () {
		if (this.owner === Meteor.userId() || this.editors.includes(Meteor.userId())) {
			return true;
		}
		let learnedCards = Leitner.find({
			user_id: Meteor.userId()
		});
		let learnedCardsets = [];
		learnedCards.forEach(function (learnedCard) {
			if ($.inArray(learnedCard.cardset_id, learnedCardsets) === -1) {
				learnedCardsets.push(learnedCard.cardset_id);
			}
		});
		if (learnedCardsets.indexOf(this._id) != -1) {
			return true;
		} else {
			return false;
		}
	},
	getRelevance: function () {
		return Math.floor(this.relevance - 1);
	},
	getStarsRating: function () {
		return ((Math.round(this.relevance * 2) / 2).toFixed(1) * 10);
	},
	displayPrice: function () {
		return this.price !== 0 && !(this.kind === "edu" && (Roles.userIsInRole(Meteor.userId(), ['university', 'lecturer'])));
	}
});

Template.poolTitleContent.helpers({
	getMaximumText: function (text) {
		const maxLength = 15;
		const textSplitted = text.split(" ");
		if (textSplitted.length > maxLength) {
			return textSplitted.slice(0, maxLength).toString().replace(/,/g, ' ') + "...";
		}
		return text;
	}
});

Template.poolCardsetRow.events({
	'click .filterAuthor': function (event) {
		filterAuthor(event);
	},
	'click .filterCollege': function (event) {
		filterCollege(event);
	},
	'click .filterCourse': function (event) {
		filterCourse(event);
	},
	'click .filterModule': function (event) {
		filterModule(event);
	},
	'click .filterRating': function (event) {
		filterRating(event);
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

Template.category.events({
	'click #resetBtn': function () {
		resetFilters();
	},
	'click #topicBtn': function () {
		var sort = Session.get('poolSortTopic');
		if (sort.name === 1) {
			Session.set('poolSortTopic', {name: -1});
		} else {
			Session.set('poolSortTopic', {name: 1});
		}
	},
	'click .filterAuthor': function (event) {
		filterAuthor(event);
	},
	'click .filterCollege': function (event) {
		filterCollege(event);
	},
	'click .filterCourse': function (event) {
		filterCourse(event);
	},
	'click .filterModule': function (event) {
		filterModule(event);
	},
	'click .filterLearnphase': function () {
		filterLearnphase(event);
	},
	'click .filterRating': function (event) {
		filterRating(event);
	},
	'click .showMoreResults': function () {
		Session.set("itemsLimit", Session.get("itemsLimit") + items_increment);
		checkRemainingCards();
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

Template.pool.onCreated(function () {
	resetFilters();
});
