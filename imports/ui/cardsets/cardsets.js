//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Colleges_Courses} from "../../api/colleges_courses.js";
import {Learned} from "../../api/learned.js";
import "../cardset/cardset.js";
import "./cardsets.html";


Meteor.subscribe("cardsets");


Session.setDefault('cardsetSortCreated', {name: 1});
Session.setDefault('cardsetSortLearned', {name: 1});


/**
 * ############################################################################
 * created
 * ############################################################################
 */

Template.created.helpers({
	cardsetList: function () {
		return Cardsets.find({
			owner: Meteor.userId()
		}, {
			sort: Session.get('cardsetSortCreated')
		});
	}
});

Template.created.events({
	'click #set-list-region .namedown': function () {
		Session.set('cardsetSortCreated', {name: 1});
	},
	'click #set-list-region .nameup': function () {
		Session.set('cardsetSortCreated', {name: -1});
	},
	'click #set-list-region .categorydown': function () {
		Session.set('cardsetSortCreated', {category: 1});
	},
	'click #set-list-region .categoryup': function () {
		Session.set('cardsetSortCreated', {category: -1});
	}
});

Template.created.onDestroyed(function () {
	Session.set('cardsetSortCreated', {name: 1});
});

/**
 * ############################################################################
 * learned
 * ############################################################################
 */

Template.learned.helpers({
	learnedList: function () {
		var learnedCards = Learned.find({
			user_id: Meteor.userId()
		});

		var learnedCardsets = [];
		learnedCards.forEach(function (learnedCard) {
			if ($.inArray(learnedCard.cardset_id, learnedCardsets) === -1) {
				learnedCardsets.push(learnedCard.cardset_id);
			}
		});

		return Cardsets.find({
			_id: {
				$in: learnedCardsets
			}
		}, {
			sort: Session.get('cardsetSortLearned')
		});
	}
});

Template.learned.events({
	'click #learned-list-region .namedown': function () {
		Session.set('cardsetSortLearned', {name: 1});
	},
	'click #learned-list-region .nameup': function () {
		Session.set('cardsetSortLearned', {name: -1});
	},
	'click #learned-list-region .categorydown': function () {
		Session.set('cardsetSortLearned', {category: 1});
	},
	'click #learned-list-region .categoryup': function () {
		Session.set('cardsetSortLearned', {category: -1});
	}
});

Template.created.onDestroyed(function () {
	Session.set('cardsetSortLearned', {name: 1});
});

/**
 * ############################################################################
 * cardsets
 * ############################################################################
 */

Template.cardsets.events({
	'click #newCardSet': function () {
		var inputValue = $('#new-set-input').val();
		$('#newSetName').val(inputValue);
		$('#new-set-input').val('');
	},
	'click .college': function (evt, tmpl) {
		var categoryName = $(evt.currentTarget).attr("data");
		var categoryId = $(evt.currentTarget).val();
		$('#newSetCollege').text(categoryName);
		tmpl.find('#newSetCollege').value = categoryId;
	},
	'click .course': function (evt, tmpl) {
		if ($('#newSetCollege').val() !== "") {
			var courseName = $(evt.currentTarget).attr("data");
			var courseId = $(evt.currentTarget).val();
			$('#newSetCourse').text(courseName);
			tmpl.find('#newSetCourse').value = courseId;
		}
	},
	'click #newSetModal .save': function () {
		if ($('#newSetName').val() === "") {
			$('#newSetNameLabel').css('color', '#b94a48');
			$('#newSetName').css('border-color', '#b94a48');
			$('#helpNewSetName').html(TAPi18n.__('modal-dialog.name_required'));
			$('#helpNewSetName').css('color', '#b94a48');
		}
		if ($('#newSetDescription').val() === "") {
			$('#newSetDescriptionLabel').css('color', '#b94a48');
			$('#newSetDescription').css('border-color', '#b94a48');
			$('#helpNewSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
			$('#helpNewSetDescription').css('color', '#b94a48');
		}
		if ($('#newSetModulLong').val() === "") {
			$('#newSetModulLongLabel').css('color', '#b94a48');
			$('#newSetModulLong').css('border-color', '#b94a48');
			$('#helpNewSetModulLong').html(TAPi18n.__('modal-dialog.modulLong_required'));
			$('#helpNewSetModulLong').css('color', '#b94a48');
		}
		if ($('#newSetModulShort').val() === "") {
			$('#newSetModulShortLabel').css('color', '#b94a48');
			$('#newSetModulShort').css('border-color', '#b94a48');
			$('#helpNewSetModulShort').html(TAPi18n.__('modal-dialog.modulShort_required'));
			$('#helpNewSetModulShort').css('color', '#b94a48');
		}
		if ($('#newSetModulNum').val() === "") {
			$('#newSetModulNumLabel').css('color', '#b94a48');
			$('#newSetModulNum').css('border-color', '#b94a48');
			$('#helpNewSetModulNum').html(TAPi18n.__('modal-dialog.modulNum_required'));
			$('#helpNewSetModulNum').css('color', '#b94a48');
		}
		if ($('#newSetCollege').val() === "") {
			$('#newSetCollegeLabel').css('color', '#b94a48');
			$('#newSetCollegeDropdown').css('border-color', '#b94a48');
			$('#helpNewSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
			$('#helpNewSetCollege').css('color', '#b94a48');
		}
		if ($('#newSetCourse').val() === "") {
			$('#newSetCourseLabel').css('color', '#b94a48');
			$('#newSetCourseDropdown').css('border-color', '#b94a48');
			$('#helpNewSetCourse').html(TAPi18n.__('modal-dialog.studyType_required'));
			$('#helpNewSetCourse').css('color', '#b94a48');
		}
		if ($('#newSetName').val() !== "" &&
			$('#newSetDescription').val() !== "" &&
			$('#newSetModulLong').val() !== "" &&
			$('#newSetModulShort').val() !== "" &&
			$('#newSetModulNum').val() !== "" &&
			$('#newSetCollege').val() !== "") {
			var name = $('#newSetName').val();
			var description = $('#newSetDescription').val();
			var modulLong = $('#newSetModulLong').val();
			var modulShort = $('#newSetModulShort').val();
			var modulNum = $('#newSetModulNum').val();
			var college = $('#newSetCollege').text();
			var course = $('#newSetCourse').text();

			Meteor.call("addCardset", name, description, false, true, 'personal', modulLong, modulShort, modulNum, college, course);
			$('#newSetModal').modal('hide');
		}
	}
});

/**
 * ############################################################################
 * cardsetsForm
 * ############################################################################
 */

Template.cardsetsForm.onRendered(function () {
	$('#newSetModal').on('hidden.bs.modal', function () {
		$('#newSetName').val('');
		$('#helpNewSetName').html('');
		$('#newSetName').css('border-color', '');
		$('#newSetNameLabel').css('color', '');

		$('#newSetDescription').val('');
		$('#helpNewSetDescription').html('');
		$('#newSetDescription').css('border-color', '');
		$('#newSetDescriptionLabel').css('color', '');

		if ($('#newSetCategory').val() !== "") {
			$('#newSetCategory').val('');
			$('#newSetCategory').html(TAPi18n.__('modal-dialog.categoryplaceholder'));
		}
		$('#helpNewSetCategory').html('');
		$('#newSetCategoryDropdown').css('border-color', '');
		$('#newSetCategoryLabel').css('color', '');
	});
});

Template.cardsetsForm.events({
	'keyup #newSetName': function () {
		$('#newSetNameLabel').css('color', '');
		$('#newSetName').css('border-color', '');
		$('#helpNewSetName').html('');
	},
	'keyup #newSetDescription': function () {
		$('#newSetDescriptionLabel').css('color', '');
		$('#newSetDescription').css('border-color', '');
		$('#helpNewSetDescription').html('');
	},
	'click .dropdown .category': function () {
		$('#newSetCategoryLabel').css('color', '');
		$('#newSetCategoryDropdown').css('border-color', '');
		$('#helpNewSetCategory').html('');
	}
});
