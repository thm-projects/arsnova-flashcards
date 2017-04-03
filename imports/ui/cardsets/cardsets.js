//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Learned} from "../../api/learned.js";
import "../cardset/cardset.js";
import "./cardsets.html";


Meteor.subscribe("cardsets");


Session.setDefault('cardsetSortCreated', {name: 1});
Session.setDefault('cardsetSortLearned', {name: 1});


/*
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
	'click .sortName': function () {
		var sort = Session.get('cardsetSortCreated');
		if (sort.name === 1) {
			Session.set('cardsetSortCreated', {name: -1});
		} else {
			Session.set('cardsetSortCreated', {name: 1});
		}
	},
	'click .sortCategory': function () {
		var sort = Session.get('cardsetSortCreated');
		if (sort.category === 1) {
			Session.set('cardsetSortCreated', {category: -1});
		} else {
			Session.set('cardsetSortCreated', {category: 1});
		}
	}
});

Template.created.onDestroyed(function () {
	Session.set('cardsetSortCreated', {name: 1});
});

/*
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
	'click .sortNameLearned': function () {
		var sort = Session.get('cardsetSortLearned');
		if (sort.name === 1) {
			Session.set('cardsetSortLearned', {name: -1});
		} else {
			Session.set('cardsetSortLearned', {name: 1});
		}
	},
	'click .sortCategoryLearned': function () {
		var sort = Session.get('cardsetSortLearned');
		if (sort.category === 1) {
			Session.set('cardsetSortLearned', {category: -1});
		} else {
			Session.set('cardsetSortLearned', {category: 1});
		}
	},
	'click .deleteLearned': function () {
		Session.set('cardsetId', this._id);
	}
});

Template.created.onDestroyed(function () {
	Session.set('cardsetSortLearned', {name: 1});
});

/*
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
	'click .skillLevel': function (evt) {
		$('#newSetSkillLevel').text($(evt.currentTarget).attr("data"));
		$('#newSetSkillLevel').val($(evt.currentTarget).val());
		$('#newSetSkillLevelLabel').css('color', '');
		$('.newSetSkillLevel').css('border-color', '');
	},
	'click .college': function (evt) {
		var collegeName = $(evt.currentTarget).attr("data");
		$('#newSetCollege').val(collegeName);
		$('#newSetCollege').html(collegeName);
		$('#newSetCourse').html((TAPi18n.__('modal-dialog.course_required')));
		$('#newSetCourse').val('');
		Session.set('poolFilterCollege', collegeName);
		$('#newSetCollegeLabel').css('color', '');
		$('.newSetCollege').css('border-color', '');
		$('#helpNewSetCollege').html('');
	},
	'click .course': function (evt) {
		if ($('#newSetCollege').val() !== "") {
			var courseName = $(evt.currentTarget).attr("data");
			$('#newSetCourse').text(courseName);
			$('#newSetCourse').val(courseName);
			$('#newSetCourseLabel').css('color', '');
			$('.newSetCourse').css('border-color', '');
			$('#helpNewSetCourse').html('');
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
		if ($('#newSetModule').val() === "") {
			$('#newSetModuleLabel').css('color', '#b94a48');
			$('#newSetModule').css('border-color', '#b94a48');
			$('#helpNewSetModule').html(TAPi18n.__('modal-dialog.module_required'));
			$('#helpNewSetModule').css('color', '#b94a48');
		}
		if ($('#newSetModuleShort').val() === "") {
			$('#newSetModuleShortLabel').css('color', '#b94a48');
			$('#newSetModuleShort').css('border-color', '#b94a48');
			$('#helpNewSetModuleShort').html(TAPi18n.__('modal-dialog.moduleShort_required'));
			$('#helpNewSetModuleShort').css('color', '#b94a48');
		}
		if ($('#newSetModuleNum').val() === "") {
			$('#newSetModuleNumLabel').css('color', '#b94a48');
			$('#newSetModuleNum').css('border-color', '#b94a48');
			$('#helpNewSetModuleNum').html(TAPi18n.__('modal-dialog.moduleNum_required'));
			$('#helpNewSetModuleNum').css('color', '#b94a48');
		}
		if ($('#newSetCollege').val() === "") {
			$('#newSetCollegeLabel').css('color', '#b94a48');
			$('.newSetCollegeDropdown').css('border-color', '#b94a48');
			$('#helpNewSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
			$('#helpNewSetCollege').css('color', '#b94a48');
		}
		if ($('#newSetCourse').val() === "") {
			$('#newSetCourseLabel').css('color', '#b94a48');
			$('.newSetCourseDropdown').css('border-color', '#b94a48');
			$('#helpNewSetCourse').html(TAPi18n.__('modal-dialog.course_required'));
			$('#helpNewSetCourse').css('color', '#b94a48');
		}
		if ($('#newSetName').val() !== "" &&
			$('#newSetDescription').val() !== "" &&
			$('#newSetModule').val() !== "" &&
			$('#newSetModuleShort').val() !== "" &&
			$('#newSetModuleNum').val() !== "" &&
			$('#newSetSkillLevel').val() !== "" &&
			$('#newSetCollege').val() !== "" &&
			$('#newSetCourse').val() !== "") {
			var name = $('#newSetName').val();
			var description = $('#newSetDescription').val();
			var module = $('#newSetModule').val();
			var moduleShort = $('#newSetModuleShort').val();
			var moduleNum = $('#newSetModuleNum').val();
			var skillLevel = $('#newSetSkillLevel').val();
			var college = $('#newSetCollege').text();
			var course = $('#newSetCourse').text();

			Meteor.call("addCardset", name, description, false, true, 'personal', module, moduleShort, moduleNum, Number(skillLevel), college, course);
			$('#newSetModal').modal('hide');
		}
	}
});

/*
 * ############################################################################
 * descriptionEditorNew
 * ############################################################################
 */

Template.descriptionEditorNew.rendered = function () {
	$("#newSetDescription").markdown({
		autofocus: true,
		hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
		fullscreen: false,
		footer: "<p></p>",
		onChange: function (e) {
			var content = e.getContent();
			if (content !== "") {
				Meteor.promise("convertMarkdown", content)
					.then(function (rendered) {
						$(".md-footer").html(rendered);
					});
			}
		}
	});
};

/*
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

		$('#newSetModule').val('');
		$('#helpNewSetModule').html('');
		$('#newSetModule').css('border-color', '');
		$('#newSetModuleLabel').css('color', '');

		$('#newSetModuleShort').val('');
		$('#helpNewSetModuleShort').html('');
		$('#newSetModuleShort').css('border-color', '');
		$('#newSetModuleShortLabel').css('color', '');

		$('#newSetModuleNum').val('');
		$('#helpNewSetModuleNum').html('');
		$('#newSetModuleNum').css('border-color', '');
		$('#newSetModuleNumLabel').css('color', '');

		if ($('#newSetCollege').val() !== "") {
			$('#newSetCollege').val('');
			$('#newSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
		}

		$('#helpNewSetCollege').html('');
		$('.newSetCollegeDropdown').css('border-color', '');
		$('#newSetCollegeLabel').css('color', '');

		if ($('#newSetCourse').val() !== "") {
			$('#newSetCourse').val('');
			$('#newSetCourse').html(TAPi18n.__('modal-dialog.course_required'));
		}

		$('#helpNewSetCourse').html('');
		$('.newSetCourseDropdown').css('border-color', '');
		$('#newSetCourseLabel').css('color', '');
		$('.newSetCourseDropdown').attr('disabled', true);

		Session.set('poolFilterCollege', undefined);
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
	'keyup #newSetModule': function () {
		$('#newSetModuleLabel').css('color', '');
		$('#newSetModule').css('border-color', '');
		$('#helpNewSetModule').html('');
	},
	'keyup #newSetModuleShort': function () {
		$('#newSetModuleShortLabel').css('color', '');
		$('#newSetModuleShort').css('border-color', '');
		$('#helpNewSetModuleShort').html('');
	},
	'keyup #newSetModuleNum': function () {
		$('#newSetModuleNumLabel').css('color', '');
		$('#newSetModuleNum').css('border-color', '');
		$('#helpNewSetModuleNum').html('');
	},
	'click .dropup .college': function () {
		$('.newSetCourseDropdown').attr('disabled', false);
		$('#newSetCollegeLabel').css('color', '');
		$('.newSetCollegeDropdown').css('border-color', '');
		$('#helpNewSetCollege').html('');
	},
	'click .dropup .course': function () {
		$('#newSetCourseLabel').css('color', '');
		$('.newSetCourseDropdown').css('border-color', '');
		$('#helpNewSetCourse').html('');
	}
});

/*
 * ############################################################################
 * cardsetsConfirmLearnedForm
 * ############################################################################
 */

Template.cardsetsConfirmLearnedForm.events({
	'click #learnedDelete': function () {
		var id = Session.get('cardsetId');

		$('#confirmLearnedModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLearned", id);
		}).modal('hide');
	}
});
