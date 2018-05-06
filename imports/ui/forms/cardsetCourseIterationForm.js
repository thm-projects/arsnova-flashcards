import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardsetCourseIterationForm.html";
import {Cardsets} from "../../api/cardsets.js";
import {getCardTypeName, gotDifficultyLevel, gotNotesForDifficultyLevel} from '../../api/cardTypes';
import {getTargetAudienceName, gotAccessControl, gotSemester, targetAudienceOrder} from "../../api/targetAudience";
import {CourseIterations} from "../../api/courseIterations";
import {prepareQuery} from "../filter/filter";

export function newCardsetCourseIterationRoute() {
	return Router.current().route.getName() === 'courseIterations' || Router.current().route.getName() === 'create' || Router.current().route.getName() === 'shuffle';
}

export function courseIterationRoute() {
	return Router.current().route.getName() === 'courseIterations';
}

function shuffleRoute() {
	return Router.current().route.getName() === 'shuffle';
}

function cardsetRoute() {
	return Router.current().route.getName() === 'cardsetlistid' || Router.current().route.getName() === 'cardsetdetailsid' || Router.current().route.getName() === 'admin_cardset';
}

function adjustDifficultyColor() {
	if (cardsetRoute()) {
		Session.set('difficultyColor', Cardsets.findOne({_id: Router.current().params._id}).difficulty);
	} else {
		let difficulty = 0;
		if (!gotNotesForDifficultyLevel(Session.get('cardType'))) {
			difficulty = 1;
		}
		Session.set('difficultyColor', difficulty);
	}
}

export function cleanModal() {
	if (shuffleRoute()) {
		$('#setName').val(Session.get("ShuffleTemplate").name);
	} else if (newCardsetCourseIterationRoute()) {
		$('#setName').val('');
	} else {
		$('#setName').val(Session.get('previousName'));
	}
	$('#setNameLabel').css('color', '');
	$('#setName').css('border-color', '');
	$('#helpSetName').html('');

	if (newCardsetCourseIterationRoute()) {
		$('#setCardType').html(getCardTypeName(0));
		$('#setCardType').val(0);
	} else {
		$('#setCardType').html(getCardTypeName(Session.get('previousCardType')));
		$('#setCardType').val(Session.get('previousCardType'));
	}

	if (courseIterationRoute()) {
		$('#setTargetAudience').html(getTargetAudienceName(1));
		$('#setTargetAudience').val(1);
		Session.set('targetAudience', Number(1));
	}

	if (courseIterationRoute()) {
		$('#setSemester').html(TAPi18n.__('courseIteration.list.semesterList', {count: 1}));
		$('#setSemester').val(1);
		Session.set('semester', Number(1));
	}

	$('#setCardTypeLabel').css('color', '');
	$('#setCardType').css('border-color', '');
	$('#helpSetCardType').html('');

	if (shuffleRoute()) {
		$('#contentEditor').val(Session.get("ShuffleTemplate").description);
	} else if (newCardsetCourseIterationRoute()) {
		$('#contentEditor').val('');
	} else {
		$('#contentEditor').val(Session.get('previousDescription'));
	}
	$('#setDescriptionLabel').css('color', '');
	$('#contentEditor').css('border-color', '');
	$('#helpSetDescription').html('');

	if (courseIterationRoute()) {
		$('#setModule').val('');
	}
	$('#setModuleLabel').css('color', '');
	$('#setModule').css('border-color', '');
	$('#helpSetModule').html('');

	if (courseIterationRoute()) {
		$('#setModuleShort').val('');
	}
	$('#setModuleShortLabel').css('color', '');
	$('#setModuleShort').css('border-color', '');
	$('#helpSetModuleShort').html('');

	if (courseIterationRoute()) {
		$('#setModuleNum').val('');
	}
	$('#setModuleNumLabel').css('color', '');
	$('#setModuleNum').css('border-color', '');
	$('#helpSetModuleNum').html('');

	if (courseIterationRoute()) {
		$('#setModuleLink').val('');
	}
	$('#setModuleLinkLabel').css('color', '');
	$('#setModuleLink').css('border-color', '');
	$('#helpSetModuleLink').html('');

	if (courseIterationRoute()) {
		$('#setCollege').html(TAPi18n.__('modal-dialog.college_required'));
		$('#setCollege').val('');
		if (!Meteor.settings.public.university.singleUniversity) {
			$('.setCourseDropdown').attr('disabled', true);
		}
	}
	$('#setCollegeLabel').css('color', '');
	$('.setCollegeDropdown').css('border-color', '');
	$('#helpSetCollege').html('');

	if (courseIterationRoute()) {
		$('#setCourse').html(TAPi18n.__('modal-dialog.course_required'));
		$('#setCourse').val('');
	}
	$('#setCourseLabel').css('color', '');
	$('.setCourseDropdown').css('border-color', '');
	$('#helpSetCourse').html('');


	if (courseIterationRoute()) {
		$('#contentEditor').val('');
	}

	if (newCardsetCourseIterationRoute()) {
		Session.set('cardType', Number(0));
	}

	adjustDifficultyColor();
	if (courseIterationRoute()) {
		$('#publishKind > label').removeClass('active');
		$('#kindoption0').addClass('active');
		Session.set('kindWithPrice', undefined);
	}
	$('#contentEditor').css('height', 'unset');
}

export function saveCardset() {
	if ($('#setName').val() === "") {
		$('#setNameLabel').css('color', '#b94a48');
		$('#setName').css('border-color', '#b94a48');
		$('#helpSetName').html(TAPi18n.__('modal-dialog.name_required'));
		$('#helpSetName').css('color', '#b94a48');
	}
	if ($('#setCardType').val() === "") {
		$('#setCardTypeLabel').css('color', '#b94a48');
		$('#setCardType').css('border-color', '#b94a48');
		$('#helpSetCardType').html(TAPi18n.__('modal-dialog.name_required'));
		$('#helpSetCardType').css('color', '#b94a48');
	}
	if ($('#contentEditor').val() === "") {
		$('#setDescriptionLabel').css('color', '#b94a48');
		$('#contentEditor').css('border-color', '#b94a48');
		$('#helpSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
		$('#helpSetDescription').css('color', '#b94a48');
	}
	if ($('#setModule').val() === "" && courseIterationRoute()) {
		$('#setModuleLabel').css('color', '#b94a48');
		$('#setModule').css('border-color', '#b94a48');
		$('#helpSetModule').html(TAPi18n.__('modal-dialog.module_required'));
		$('#helpSetModule').css('color', '#b94a48');
	}
	if ($('#setModuleShort').val() === "" && courseIterationRoute()) {
		$('#setModuleShortLabel').css('color', '#b94a48');
		$('#setModuleShort').css('border-color', '#b94a48');
		$('#helpSetModuleShort').html(TAPi18n.__('modal-dialog.moduleShort_required'));
		$('#helpSetModuleShort').css('color', '#b94a48');
	}
	if ($('#setModuleNum').val() === "" && courseIterationRoute()) {
		$('#setModuleNumLabel').css('color', '#b94a48');
		$('#setModuleNum').css('border-color', '#b94a48');
		$('#helpSetModuleNum').html(TAPi18n.__('modal-dialog.moduleNum_required'));
		$('#helpSetModuleNum').css('color', '#b94a48');
	}
	if (!Meteor.settings.public.university.singleUniversity && courseIterationRoute()) {
		if ($('#setCollege').val() === "") {
			$('#setCollegeLabel').css('color', '#b94a48');
			$('.setCollegeDropdown').css('border-color', '#b94a48');
			$('#helpSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
			$('#helpSetCollege').css('color', '#b94a48');
		}
	}
	if ($('#setCourse').val() === "" && courseIterationRoute()) {
		$('#setCourseLabel').css('color', '#b94a48');
		$('.setCourseDropdown').css('border-color', '#b94a48');
		$('#helpSetCourse').html(TAPi18n.__('modal-dialog.course_required'));
		$('#helpSetCourse').css('color', '#b94a48');
	}
	if ($('#setName').val() !== "" &&
		($('#contentEditor').val() !== "") &&
		($('#setModule').val() !== "" || !courseIterationRoute()) &&
		($('#setModuleShort').val() !== "" || !courseIterationRoute()) &&
		($('#setModuleNum').val() !== "" || !courseIterationRoute()) &&
		($('#setCollege').val() !== "" || (Meteor.settings.public.university.singleUniversity && !courseIterationRoute())) &&
		($('#setCourse').val() !== "" || !courseIterationRoute())) {
		let name, cardType, description, module, moduleShort, moduleNum, moduleLink, college, course, shuffled,
			cardGroups;
		name = $('#setName').val();
		cardType = $('#setCardType').val();
		description = $('#contentEditor').val();
		module = $('#setModule').val();
		moduleShort = $('#setModuleShort').val();
		moduleNum = $('#setModuleNum').val();
		moduleLink = $('#setModuleLink').val();
		if (moduleLink === undefined) {
			moduleLink = "";
		}
		if (courseIterationRoute()) {
			college = $('#setCollege').val();
			course = $('#setCourse').val();
		} else {
			college = Meteor.settings.public.university.default;
			course = "";
		}
		if (newCardsetCourseIterationRoute()) {
			if (shuffleRoute()) {
				shuffled = true;
				cardGroups = Session.get("ShuffledCardsets");
			} else {
				shuffled = false;
				cardGroups = [];
			}
			if (courseIterationRoute()) {
				let kind = $('#publishKind > .active > input').val();
				let price = 0;
				if (kind === undefined || kind === "") {
					kind = "personal";
				}
				if (kind === 'edu' || kind === 'pro') {
					price = $('#publishPrice').val();
				}
				Meteor.call("addCourseIteration", name, description, false, true, kind, module, moduleShort, moduleNum, moduleLink, college, course, Session.get('semester'), price, Session.get('targetAudience'));
				$('#setCardsetCourseIterationFormModal').modal('hide');
			} else {
				Meteor.call("addCardset", name, description, false, true, 'personal', shuffled, cardGroups, Number(cardType), Session.get('difficultyColor'), function (error, result) {
					$('#setCardsetCourseIterationFormModal').modal('hide');
					if (result) {
						$('#setCardsetCourseIterationFormModal').on('hidden.bs.modal', function () {
							Router.go('cardsetdetailsid', {
								_id: result
							});
						});
					}
				});
			}
			return true;
		} else if (cardsetRoute() || courseIterationRoute()) {
			if (courseIterationRoute()) {
				Meteor.call("updateCourseIteration", name, description, module, moduleShort, moduleNum, moduleLink, college, course);
			} else {
				Meteor.call("updateCardset", Router.current().params._id, name, description, Number(cardType), Session.get('difficultyColor'));
				Session.set('cardType', Number(cardType));
			}
			$('#setCardsetCourseIterationFormModal').modal('hide');
			return true;
		}
		return false;
	}
}

/*
 * ############################################################################
 * cardsetCourseIterationForm
 * ############################################################################
 */

Template.cardsetCourseIterationForm.helpers({
	isCourseIteration: function () {
		return courseIterationRoute();
	},
	isNew: function () {
		return newCardsetCourseIterationRoute();
	}
});

/*
 * ############################################################################
 * cardsetCourseIterationFormContent
 * ############################################################################
 */

Template.cardsetCourseIterationFormContent.onRendered(function () {
	$('#setCardsetCourseIterationFormModal').on('show.bs.modal', function () {
		if (!shuffleRoute()) {
			cleanModal();
		}
	});
	$('#setCardsetCourseIterationFormModal').on('hidden.bs.modal', function () {
		if (!shuffleRoute()) {
			cleanModal();
		}
	});
});

Template.cardsetCourseIterationFormContent.helpers({
	isDisabled: function (college) {
		if (college !== "" && college !== undefined) {
			return "";
		} else {
			if (!Meteor.settings.public.university.singleUniversity) {
				return "disabled";
			} else {
				return "";
			}
		}
	},
	getCollege: function (college, mode) {
		if (college === undefined || college === "") {
			if (mode) {
				return TAPi18n.__('modal-dialog.college_required');
			} else {
				return "";
			}
		} else {
			return college;
		}
	},
	getCourse: function (course, mode) {
		if (course === undefined || course === "") {
			if (mode) {
				return TAPi18n.__('modal-dialog.course_required');
			} else {
				return "";
			}
		} else {
			return course;
		}
	},
	isCourseIteration: function () {
		return courseIterationRoute();
	},
	isNew: function () {
		return newCardsetCourseIterationRoute();
	},
	isSingleUniversity: function () {
		if (ActiveRoute.name('shuffle')) {
			return "";
		} else {
			return Meteor.settings.public.university.singleUniversity ? "" : "disabled";
		}
	},
	getCardTypeName: function (cardType) {
		return getCardTypeName(cardType);
	},
	getShuffleName: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? "Shuffle: " + Session.get("ShuffleTemplate").name : "";
		}
	},
	getShuffleModule: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").module : "";
		}
	},
	getShuffleModuleShort: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").moduleToken : "";
		}
	},
	getShuffleModuleNum: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").moduleNum : "";
		}
	},
	getShuffleModuleLink: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").moduleLink : "";
		}
	},
	learningActive: function () {
		if (cardsetRoute()) {
			return Cardsets.findOne({_id: Router.current().params._id}).learningActive;
		} else {
			return false;
		}
	},
	gotDifficultyLevel: function () {
		return gotDifficultyLevel(Session.get('cardType'));
	},
	gotNotesForDifficultyLevel: function () {
		return gotNotesForDifficultyLevel(Session.get('cardType'));
	},
	gotAccessControl: function () {
		return gotAccessControl(Session.get('targetAudience'));
	},
	gotSemester: function () {
		return gotSemester(Session.get('targetAudience'));
	}

});

Template.cardsetCourseIterationFormContent.events({
	'click #cardSetSave': function () {
		saveCardset();
	},
	'click .cardType': function (evt) {
		let cardType = $(evt.currentTarget).attr("data");
		$('#setCardType').html($(evt.currentTarget).text());
		$('#setCardType').val(cardType);
		Session.set('cardType', Number(cardType));
		adjustDifficultyColor();
		$('#setCardTypeLabel').css('color', '');
		$('.setCardTypeDropdown').css('border-color', '');
		$('#helpSetCardType').html('');
	},
	'click .semester': function (evt) {
		let semester = Number($(event.target).data('id'));
		$('#setSemester').html($(evt.currentTarget).text());
		$('#setSemester').val(semester);
		Session.set('semester', Number(semester));
		$('#setSemesterLabel').css('color', '');
		$('.setSemesterDropdown').css('border-color', '');
		$('#helpSemesterType').html('');
	},
	'click .college': function (evt) {
		var collegeName = $(evt.currentTarget).attr("data");
		$('#setCollege').html(collegeName);
		$('#setCollege').val(collegeName);
		Session.set('poolFilterCollege', collegeName);
		$('#setCourse').html((TAPi18n.__('modal-dialog.course_required')));
		$('#setCourse').val('');
		$('#setCollegeLabel').css('color', '');
		$('.setCollegeDropdown').css('border-color', '');
		$('#helpSetCollege').html('');
		$('.setCourseDropdown').attr('disabled', false);
	},
	'click .course': function (evt) {
		var courseName = $(evt.currentTarget).attr("data");
		$('#setCourse').html(courseName);
		$('#setCourse').val(courseName);
		$('#setCourseLabel').css('color', '');
		$('.setCourseDropdown').css('border-color', '');
		$('#helpSetCourse').html('');
	},
	'click .targetAudience': function (evt) {
		let targetAudience = Number($(event.target).data('id'));
		$('#setTargetAudience').html($(evt.currentTarget).text());
		$('#setTargetAudience').val(targetAudience);
		Session.set('targetAudience', Number(targetAudience));
		$('#setTargetAudienceLabel').css('color', '');
		$('.setTargetAudienceDropdown').css('border-color', '');
		$('#helpSetTargetAudience').html('');
	},
	'keyup #setName': function () {
		$('#setNameLabel').css('color', '');
		$('#setName').css('border-color', '');
		$('#helpSetName').html('');
	},
	'keyup #contentEditor': function () {
		$('#setDescriptionLabel').css('color', '');
		$('#contentEditor').css('border-color', '');
		$('#helpSetDescription').html('');
	},
	'keyup #setModule': function () {
		$('#setModuleLabel').css('color', '');
		$('#setModule').css('border-color', '');
		$('#helpSetModule').html('');
	},
	'keyup #setModuleShort': function () {
		$('#setModuleShortLabel').css('color', '');
		$('#setModuleShort').css('border-color', '');
		$('#helpSetModuleShort').html('');
	},
	'keyup #setModuleNum': function () {
		$('#setModuleNumLabel').css('color', '');
		$('#setModuleNum').css('border-color', '');
		$('#helpSetModuleNum').html('');
	}
});

/*
 * ############################################################################
 * difficultyEditor
 * ############################################################################
 */

Template.difficultyEditor.helpers({
	isDifficultyChecked: function (difficulty) {
		return difficulty === Session.get('difficultyColor');
	},
	gotNotesForDifficultyLevel: function () {
		return gotNotesForDifficultyLevel(Session.get('cardType'));
	}
});

Template.difficultyEditor.events({
	'click #difficultyGroup': function (event) {
		Session.set('difficultyColor', Number($(event.target).data('color')));
	}
});


/*
 * ############################################################################
 * targetAudienceList
 * ############################################################################
 */
Template.semesterList.helpers({
	getSemesters: function () {
		return [
			{semester: 1},
			{semester: 2},
			{semester: 3},
			{semester: 4},
			{semester: 5},
			{semester: 6},
			{semester: 7},
			{semester: 8}
		];
	},
	displaySemester: function () {
		prepareQuery();
		let query = Session.get('filterQuery');
		query.semester = this.semester;
		return CourseIterations.findOne(query);
	},
	activeFilter: function () {
		return Session.get('poolFilterSemester') === this.semester;
	}
});


/*
 * ############################################################################
 * targetAudienceList
 * ############################################################################
 */
Template.targetAudienceList.helpers({
	getTargetAudiences: function () {
		return targetAudienceOrder;
	},
	getTargetAudienceName: function (targetAudience) {
		return getTargetAudienceName(targetAudience);
	},
	displayTargetAudience: function () {
		prepareQuery();
		let query = Session.get('filterQuery');
		query.targetAudience = this.targetAudience;
		return CourseIterations.findOne(query);
	},
	activeFilter: function () {
		return Session.get('poolFilterTargetAudience') === this.targetAudience;
	}
});
