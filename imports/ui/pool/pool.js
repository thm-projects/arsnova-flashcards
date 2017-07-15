//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Ratings} from "../../api/ratings.js";
import "./pool.html";

Meteor.subscribe("cardsets");
Meteor.subscribe('ratings');

var items_increment = 14;

Session.setDefault('poolSortTopic', {name: 1});
Session.setDefault('poolFilterAuthor');
Session.setDefault('poolFilterCollege');
Session.setDefault('poolFilterCourse');
Session.setDefault('poolFilterModule');
Session.setDefault('poolFilterSkillLevel');
Session.setDefault('poolFilterLearnphase');
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
	if (Session.get('poolFilterSkillLevel')) {
		query.skillLevel = Session.get('poolFilterSkillLevel');
	}
	if (Session.get('poolFilterLearnphase') != null) {
		/*NOTE:
		 * Need to check explicitly agains null, because true and false are valid values for this filter.
		 * Otherwise the boolean value stored in the session might evaluate the above condition to false,
		 * which causes the next line to be skipped.
		 * This is not intended, because the stored value is needed as filter property
		 * for not yet started learning phases.
		 */
		query.learningActive = Session.get('poolFilterLearnphase');
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

function showMoreVisible() {
	var threshold, target = $(".showMoreResults");
	if (target.data("visible")) {
		threshold = $(window).scrollTop() + $(window).height() - target.height();
		if (target.offset().top < threshold) {
			target.data("visible", false);
			Session.set("itemsLimit", Session.get("itemsLimit") + items_increment);
		}
	}
}
$(window).scroll(showMoreVisible);

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
	if (Session.get('poolFilterSkillLevel')) {
		$(".filterSkillLevel").addClass('active');
	} else {
		$(".filterSkillLevel").removeClass('active').first();
	}
	if (Session.get('poolFilterLearnphase') != null) {
		$(".filterLearnphase").addClass('active');
	} else {
		$(".filterLearnphase").removeClass('active').first();
	}
	filterCheckbox();
}

function filterCollege(event) {
	var button = $(".filterCollegeGroup");
	if (!$(event.target).data('id')) {
		button.removeClass("active");
		Session.set('poolFilterCollegeVal', null);
	} else {
		button.addClass('active');
		Session.set('poolFilterCollegeVal', $(event.target).data('id'));
	}
	Session.set('poolFilterCollege', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterCourse(event) {
	var button = $(".filterCourseGroup");
	if (!$(event.target).data('id')) {
		button.removeClass("active");
		Session.set('poolFilterCourseVal', null);
	} else {
		button.addClass('active');
		Session.set('poolFilterCourseVal', $(event.target).data('id'));
	}
	Session.set('poolFilterCourse', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterModule(event) {
	var button = $(".filterModuleGroup");
	if (!$(event.target).data('id')) {
		button.removeClass("active");
		Session.set('poolFilterModuleVal', null);
	} else {
		button.addClass('active');
		Session.set('poolFilterModuleVal', $(event.target).data('id'));
	}
	Session.set('poolFilterModule', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterSkillLevel(event) {
	var button = $(".filterSkillLevelGroup");
	if (!$(event.target).data('id')) {
		button.removeClass("active");
		Session.set('poolFilterSkillLevelVal', null);
	} else {
		button.addClass('active');
		Session.set('poolFilterSkillLevelVal', $(event.target).data('id'));
	}
	Session.set('poolFilterSkillLevel', $(event.target).data('id'));
	resetInfiniteBar();
}

function filterLearnphase(event) {
	if ($(event.target).data('id') === true) {
		Session.set('poolFilterLearnphaseVal', true);
		Session.set('poolFilterLearnphase', true);
	} else if ($(event.target).data('id') === false) {
		Session.set('poolFilterLearnphaseVal', false);
		Session.set('poolFilterLearnphase', false);
	} else {
		Session.set('poolFilterLearnphaseVal');
		Session.set('poolFilterLearnphase');
	}

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
	getSkillLevels: function () {
		prepareQuery();
		return _.uniq(Cardsets.find(query, {sort: {"skillLevel": 1}}).fetch(), function (item) {
			return item.skillLevel;
		});
	},
	getLearnphases: function () {
		prepareQuery();
		return _.uniq(Cardsets.find(query, {sort: {"learningActive": 1}}).fetch(), function (item) {
			return item.learningActive;
		});
	},
	oddRow: function (index) {
		return (index % 2 === 1);
	},
	hasAuthorFilter: function () {
		return Session.get('poolFilterAuthor');
	},
	poolFilterAuthor: function () {
		return Session.get('poolFilterAuthorVal');
	},
	hasCollegeFilter: function () {
		return Session.get('poolFilterCollege');
	},
	poolFilterCollege: function () {
		return Session.get('poolFilterCollegeVal');
	},
	hasCourseFilter: function () {
		return Session.get('poolFilterCourse');
	},
	poolFilterCourse: function () {
		return Session.get('poolFilterCourseVal');
	},
	hasModuleFilter: function () {
		return Session.get('poolFilterModule');
	},
	poolFilterModule: function () {
		return Session.get('poolFilterModuleVal');
	},
	hasSkillLevelFilter: function () {
		return Session.get('poolFilterSkillLevel');
	},
	poolFilterSkillLevel: function () {
		return Session.get('poolFilterSkillLevelVal');
	},
	hasLearnphaseFilter: function () {
		/*NOTE:
		 * The stored value is allowed to be false, so we need to check against null for filter availability.
		 */
		return (Session.get('poolFilterLearnphase') != null);
	},
	poolFilterLearnphase: function () {
		return Session.get('poolFilterLearnphaseVal');
	},
	moreResults: function () {
		return checkRemainingCards();
	}
});

Template.category.greeting = function () {
	return Session.get('authors');
};

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
	getAverageRating: function () {
		var ratings = Ratings.find({
			cardset_id: this._id
		});
		var count = ratings.count();
		if (count !== 0) {
			var amount = 0;
			ratings.forEach(function (rate) {
				amount = amount + rate.rating;
			});
			var result = (amount / count).toFixed(2);
			return result;
		} else {
			return 0;
		}
	},
	getKind: function () {
		switch (this.kind) {
			case "free":
				return '<span class="label label-info panelUnitKind" data-id="free">Free</span>';
			case "edu":
				return '<span class="label label-success panelUnitKind" data-id="edu">Edu</span>';
			case "pro":
				return '<span class="label label-danger panelUnitKind" data-id="pro">Pro</span>';
			default:
				return '<span class="label label-default panelUnitKind">Undefined!</span>';
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
				licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" data-id="' + this._id + '"/>');
			}
			if (this.license.includes('nc')) {
				licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" data-id="' + this._id + '"/>');
			}
			if (this.license.includes('nd')) {
				licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" data-id="' + this._id + '"/>');
			}
			if (this.license.includes('sa')) {
				licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="Weitergabe unter gleichen Bedingungen" data-id="' + this._id + '"/>');
			}

			return new Spacebars.SafeString(licenseString);
		} else {
			return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="Kein Copyright" data-id="' + this._id + '"/>');
		}
	},
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
	'click .filterCollege': function (event) {
		filterCollege(event);
	},
	'click .filterCourse': function (event) {
		filterCourse(event);
	},
	'click .filterModule': function (event) {
		filterModule(event);
	},
	'click .filterSkillLevel': function (event) {
		filterSkillLevel(event);
	},
	'click .filterCheckbox': function (event) {
		Session.set('poolFilter', [$(event.target).data('id')]);
		filterCheckbox();
	},
	'click .showLicense': function (event) {
		Session.set('selectedCardset', $(event.target).data('id'));
	}
});

Template.category.events({
	'click #resetBtn': function () {
		Session.set('poolSortTopic', {name: 1});
		Session.set('poolFilterAuthor');
		Session.set('poolFilterCollege');
		Session.set('poolFilterCourse');
		Session.set('poolFilterModule');
		Session.set('poolFilterSkillLevel');
		Session.set('poolFilter', ["free", "edu", "pro"]);
		Session.set('poolFilterLearnphase');
		checkFilters();
		resetInfiniteBar();
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
		var button = $(".filterAuthorGroup");
		if (!$(event.target).data('id')) {
			button.removeClass("active");
			Session.set('poolFilterAuthorVal', null);
		} else {
			button.addClass('active');
			Session.set('poolFilterAuthorVal', $(event.target).html());
		}
		Session.set('poolFilterAuthor', $(event.target).data('id'));
		resetInfiniteBar();
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
	'click .filterSkillLevel': function (event) {
		filterSkillLevel(event);
	},
	'click .filterLearnphase': function () {
		filterLearnphase(event);
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

Template.pool.onRendered(function () {
	if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), [
			'admin',
			'editor'
		])) {
		Bert.alert(TAPi18n.__('notifications.admin'), 'success', 'growl-bottom-right');
	}
	checkFilters();
});
