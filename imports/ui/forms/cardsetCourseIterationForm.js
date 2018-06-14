import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardsetCourseIterationForm.html";
import {Cardsets} from "../../api/cardsets.js";
import {CardType} from '../../api/cardTypes.js';
import {TargetAudience} from "../../api/targetAudience";
import {CourseIterations} from "../../api/courseIterations";
import {prepareQuery} from "../filter/filter";
import {CollegesCourses} from "../../api/colleges_courses";

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
		if (!CardType.gotNotesForDifficultyLevel(Session.get('cardType'))) {
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
	$('#setNameLabel').removeClass('text-warning');
	$('#helpSetName').html('');

	if (newCardsetCourseIterationRoute()) {
		$('#setCardType').html(CardType.getCardTypeName(0));
		$('#setCardType').val(0);
	} else {
		$('#setCardType').html(CardType.getCardTypeName(Session.get('previousCardType')));
		$('#setCardType').val(Session.get('previousCardType'));
	}

	if (courseIterationRoute()) {
		$('#setTargetAudience').html(TargetAudience.getTargetAudienceName(1));
		$('#setTargetAudience').val(1);
		Session.set('targetAudience', Number(1));
	}

	if (courseIterationRoute()) {
		$('#setSemester').html(TAPi18n.__('courseIteration.list.semesterList', {count: 1}));
		$('#setSemester').val(1);
		Session.set('semester', Number(1));
	}
	$('#setCardTypeLabel').removeClass('text-warning');

	if (shuffleRoute()) {
		$('#contentEditor').val(Session.get("ShuffleTemplate").description);
	} else if (newCardsetCourseIterationRoute()) {
		$('#contentEditor').val('');
	} else {
		$('#contentEditor').val(Session.get('previousDescription'));
	}
	$('#setDescriptionLabel').removeClass('text-warning');
	$('#helpSetDescription').html('');

	if (courseIterationRoute()) {
		$('#setModule').val('');
	}
	$('#setModuleLabel').removeClass('text-warning');
	$('#helpSetModule').html('');

	if (courseIterationRoute()) {
		$('#setModuleShort').val('');
	}
	$('#setModuleShortLabel').removeClass('text-warning');
	$('#helpSetModuleShort').html('');

	if (courseIterationRoute()) {
		$('#setModuleNum').val('');
	}
	$('#setModuleNumLabel').removeClass('text-warning');
	$('#helpSetModuleNum').html('');

	if (courseIterationRoute()) {
		$('#setModuleLink').val('');
	}

	if (courseIterationRoute()) {
		$('#setCollege').html(TAPi18n.__('modal-dialog.college_required'));

		if (Meteor.settings.public.university.singleUniversity) {
			$('#setCollege').val(Meteor.settings.public.university.default);
			Session.set('college', Meteor.settings.public.university.default);
		} else {
			$('#setCollege').val('');
			$('.setCourseDropdown').attr('disabled', true);
		}
	}
	$('#setCollegeLabel').removeClass('text-warning');
	$('#helpSetCollege').html('');

	if (courseIterationRoute()) {
		$('#setCourse').html(TAPi18n.__('modal-dialog.course_required'));
		$('#setCourse').val('');
	}
	$('#setCourseLabel').removeClass('text-warning');
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
	let bertDelay = 10000;
	let bertDelayMultiplier = 0;
	let error = false;
	let errorMessage = "<ul>";
	if ($('#setName').val() === "") {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.name') + "</li>";
		bertDelayMultiplier++;
		$('#setNameLabel').addClass('text-warning');
		$('#helpSetName').html(TAPi18n.__('modal-dialog.name_required'));
	}
	if ($('#contentEditor').val() === "") {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.description') + "</li>";
		bertDelayMultiplier++;
		$('#setDescriptionLabel').addClass('text-warning');
		$('#helpSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
	}
	if (!Meteor.settings.public.university.singleUniversity && (courseIterationRoute() && TargetAudience.gotModule(Session.get('targetAudience')))) {
		if ($('#setCollege').val() === "") {
			errorMessage += "<li>" + TAPi18n.__('modal-dialog.college') + "</li>";
			bertDelayMultiplier++;
			$('#setCollegeLabel').addClass('text-warning');
			$('#helpSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
		}
	}
	if ($('#setCourse').val() === "" && (courseIterationRoute() && TargetAudience.gotModule(Session.get('targetAudience')))) {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.course') + "</li>";
		$('#setCourseLabel').addClass('text-warning');
		$('#helpSetCourse').html(TAPi18n.__('modal-dialog.course_required'));
	}
	if ($('#setModule').val() === "" && (courseIterationRoute() && TargetAudience.gotModule(Session.get('targetAudience')))) {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.module') + "</li>";
		bertDelayMultiplier++;
		$('#setModuleLabel').addClass('text-warning');
		$('#helpSetModule').html(TAPi18n.__('modal-dialog.module_required'));
	}
	if ($('#setModuleShort').val() === "" && (courseIterationRoute() && TargetAudience.gotModule(Session.get('targetAudience')))) {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.moduleShort') + "</li>";
		bertDelayMultiplier++;
		$('#setModuleShortLabel').addClass('text-warning');
		$('#helpSetModuleShort').html(TAPi18n.__('modal-dialog.moduleShort_required'));
	}
	if ($('#setModuleNum').val() === "" && (courseIterationRoute() && TargetAudience.gotModule(Session.get('targetAudience')))) {
		error = true;
		errorMessage += "<li>" + TAPi18n.__('modal-dialog.moduleNum') + "</li>";
		bertDelayMultiplier++;
		$('#setModuleNumLabel').addClass('text-warning');
		$('#helpSetModuleNum').html(TAPi18n.__('modal-dialog.moduleNum_required'));
	}
	errorMessage += "</ul>";
	Bert.defaults.hideDelay = bertDelay * bertDelayMultiplier;
	Bert.alert(errorMessage, 'warning', 'growl-top-left');
	if (!error) {
		let name, cardType, description, module, moduleShort, moduleNum, moduleLink, college, course, shuffled,
			cardGroups;
		name = $('#setName').val();
		if (shuffleRoute()) {
			cardType = -1;
		} else {
			cardType = $('#setCardType').val();
		}
		description = $('#contentEditor').val();
		if (courseIterationRoute()) {
			if (TargetAudience.gotModule(Session.get('targetAudience'))) {
				college = $('#setCollege').val();
				course = $('#setCourse').val();
				module = $('#setModule').val();
				moduleShort = $('#setModuleShort').val();
				moduleNum = $('#setModuleNum').val();
			} else {
				college = "";
				course = "";
				module = "";
				moduleShort = "";
				moduleNum = "";
			}
			moduleLink = $('#setModuleLink').val();
			if (moduleLink === undefined) {
				moduleLink = "";
			}
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
				if (Cardsets.findOne(Router.current().params._id).shuffled) {
					cardType = -1;
				}
				Meteor.call("updateCardset", Router.current().params._id, name, description, Number(cardType), Session.get('difficultyColor'));
				Session.set('cardType', Number(cardType));
			}
			$('#setCardsetCourseIterationFormModal').modal('hide');
			return true;
		}
		return false;
	} else {
		Bert.alert({
			title: TAPi18n.__('modal-dialog.missingFields') + ':',
			message: errorMessage,
			type: 'danger',
			style: 'growl-top-left'
		});
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
		if (college === "" && college === undefined) {
			return "disabled";
		} else {
			if (Meteor.settings.public.university.singleUniversity) {
				return "";
			} else {
				return "disabled";
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
		return CardType.getCardTypeName(cardType);
	},
	getShuffleName: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").name : "";
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
		return CardType.gotDifficultyLevel(Session.get('cardType'));
	},
	gotNotesForDifficultyLevel: function () {
		return CardType.gotNotesForDifficultyLevel(Session.get('cardType'));
	},
	gotAccessControl: function () {
		return TargetAudience.gotAccessControl(Session.get('targetAudience'));
	},
	gotSemester: function () {
		return TargetAudience.gotSemester(Session.get('targetAudience'));
	},
	courseIterationGotModule: function () {
		return TargetAudience.gotModule(Session.get('targetAudience'));
	},
	getCourses: function () {
		return _.uniq(CollegesCourses.find({college: Session.get('college')}, {sort: {course: 1}}).fetch(), function (item) {
			return item.course;
		});
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
		$('#setCardTypeLabel').removeClass('text-warning');
		$('#helpSetCardType').html('');
	},
	'click .semester': function (evt) {
		let semester = Number($(event.target).data('id'));
		$('#setSemester').html($(evt.currentTarget).text());
		$('#setSemester').val(semester);
		Session.set('semester', Number(semester));
		$('#setSemesterLabel').removeClass('text-warning');
		$('#helpSemesterType').html('');
	},
	'click .college': function (evt) {
		var collegeName = $(evt.currentTarget).attr("data");
		$('#setCollege').html(collegeName);
		$('#setCollege').val(collegeName);
		Session.set('college', collegeName);
		$('#setCourse').html((TAPi18n.__('modal-dialog.course_required')));
		$('#setCourse').val('');
		$('#setCollegeLabel').removeClass('text-warning');
		$('#helpSetCollege').html('');
		$('.setCourseDropdown').attr('disabled', false);
	},
	'click .course': function (evt) {
		var courseName = $(evt.currentTarget).attr("data");
		$('#setCourse').html(courseName);
		$('#setCourse').val(courseName);
		$('#setCourseLabel').removeClass('text-warning');
		$('#helpSetCourse').html('');
	},
	'click .targetAudience': function (evt) {
		let targetAudienceId = Number($(event.target).data('id'));
		$('#setTargetAudience').html($(evt.currentTarget).text());
		$('#setTargetAudience').val(targetAudienceId);
		Session.set('targetAudience', Number(targetAudienceId));
		$('#setTargetAudienceLabel').removeClass('text-warning');
		$('#helpSetTargetAudience').html('');
	},
	'keyup #setName': function () {
		$('#setNameLabel').removeClass('text-warning');
		$('#helpSetName').html('');
	},
	'keyup #contentEditor': function () {
		$('#setDescriptionLabel').removeClass('text-warning');
		$('#helpSetDescription').html('');
	},
	'keyup #setModule': function () {
		$('#setModuleLabel').removeClass('text-warning');
		$('#helpSetModule').html('');
	},
	'keyup #setModuleShort': function () {
		$('#setModuleShortLabel').removeClass('text-warning');
		$('#helpSetModuleShort').html('');
	},
	'keyup #setModuleNum': function () {
		$('#setModuleNumLabel').removeClass('text-warning');
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
		return CardType.gotNotesForDifficultyLevel(Session.get('cardType'));
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
		return Session.get('semester') === this.semester;
	}
});


/*
 * ############################################################################
 * targetAudienceList
 * ############################################################################
 */
Template.targetAudienceList.helpers({
	getTargetAudiences: function () {
		return TargetAudience.getTargetAudienceOrder();
	},
	getTargetAudienceName: function (targetAudience) {
		return TargetAudience.getTargetAudienceName(targetAudience);
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
