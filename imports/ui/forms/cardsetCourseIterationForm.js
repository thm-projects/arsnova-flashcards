import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardsetCourseIterationForm.html";
import {Cardsets} from "../../api/cardsets.js";
import {image, tex} from '/imports/ui/card/card.js';
import {getCardTypeName, gotDifficultyLevel, gotNotesForDifficultyLevel} from '../../api/cardTypes';
import {adjustMarkdownToolbar} from "../card/card";
import {getTargetAudienceName, gotAccessControl, gotSemester, targetAudienceOrder} from "../../api/targetAudience";
import {CourseIterations} from "../../api/courseIterations";
import {prepareQuery} from "../filter/filter";

function newCardsetCourseIterationRoute() {
	return Router.current().route.getName() === 'create' || Router.current().route.getName() === 'shuffle' || Router.current().route.getName() === 'courseIterations';
}

function courseIterationRoute() {
	return Router.current().route.getName() === 'courseIterations';
}

function shuffleRoute() {
	return Router.current().route.getName() === 'shuffle';
}

function createRoute() {
	return Router.current().route.getName() === 'create';
}

function cardsetRoute() {
	return Router.current().route.getName() === 'cardsetlistid' || Router.current().route.getName() === 'cardsetdetailsid' || Router.current().route.getName() === 'admin_cardset';
}

function activateModule() {
	$('.moduleRadioButton')[0].checked = true;
	$('.moduleRadioButton')[1].checked = false;
	$('.moduleBody').css('display', '');
	Session.set('moduleActive', true);
}

function deactivateModule() {
	$('.moduleRadioButton')[0].checked = false;
	$('.moduleRadioButton')[1].checked = true;
	$('.moduleBody').css('display', 'none');
	Session.set('moduleActive', false);
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
	let previousCollegeName, previousCourseName;
	if (!newCardsetCourseIterationRoute()) {
		previousCollegeName = Session.get('previousCollegeName');
		previousCourseName = Session.get('previousCourseName');
	}

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute()) {
			$('#setName').val(Session.get("ShuffleTemplate").name);
		} else {
			$('#setName').val('');
		}
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

	if (newCardsetCourseIterationRoute()) {
		$('#setTargetAudience').html(getTargetAudienceName(1));
		$('#setTargetAudience').val(1);
		Session.set('targetAudience', Number(1));
	}

	if (newCardsetCourseIterationRoute()) {
		$('#setSemester').html(TAPi18n.__('courseIteration.list.semesterList', {count: 1}));
		$('#setSemester').val(1);
		Session.set('semester', Number(1));
	}

	$('#setCardTypeLabel').css('color', '');
	$('#setCardType').css('border-color', '');
	$('#helpSetCardType').html('');

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute()) {
			$('#setDescription').val(Session.get("ShuffleTemplate").description);
		} else {
			$('#setDescription').val('');
		}
	} else {
		$('#setDescription').val(Session.get('previousDescription'));
	}
	$('#setDescriptionLabel').css('color', '');
	$('#setDescription').css('border-color', '');
	$('#helpSetDescription').html('');
	$('.md-footer').html(' ');

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute()) {
			$('#setModule').val(Session.get("ShuffleTemplate").module);
		} else {
			$('#setModule').val('');
		}
	} else {
		$('#setModule').val(Session.get('previousModule'));
	}
	$('#setModuleLabel').css('color', '');
	$('#setModule').css('border-color', '');
	$('#helpSetModule').html('');

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute()) {
			$('#setModuleShort').val(Session.get("ShuffleTemplate").moduleToken);
		} else {
			$('#setModuleShort').val('');
		}
	} else {
		$('#setModuleShort').val(Session.get('previousModuleShort'));
	}
	$('#setModuleShortLabel').css('color', '');
	$('#setModuleShort').css('border-color', '');
	$('#helpSetModuleShort').html('');

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute()) {
			$('#setModuleNum').val(Session.get("ShuffleTemplate").moduleNum);
		} else {
			$('#setModuleNum').val('');
		}
	} else {
		$('#setModuleNum').val(Session.get('previousModuleNum'));
	}
	$('#setModuleNumLabel').css('color', '');
	$('#setModuleNum').css('border-color', '');
	$('#helpSetModuleNum').html('');

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute()) {
			$('#setModuleLink').val(Session.get("ShuffleTemplate").moduleLink);
		} else {
			$('#setModuleLink').val('');
		}
	} else {
		$('#setModuleLink').val(Session.get('previousModuleLink'));
	}
	$('#setModuleLinkLabel').css('color', '');
	$('#setModuleLink').css('border-color', '');
	$('#helpSetModuleLink').html('');

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute() && Session.get("ShuffleTemplate").college !== "" && Session.get("ShuffleTemplate").college !== undefined) {
			$('#setCollege').html(Session.get("ShuffleTemplate").college);
			$('#setCollege').val(Session.get("ShuffleTemplate").college);
			$('.setCourseDropdown').attr('disabled', false);
		} else {
			$('#setCollege').html(TAPi18n.__('modal-dialog.college_required'));
			$('#setCollege').val('');
			if (!Meteor.settings.public.university.singleUniversity) {
				$('.setCourseDropdown').attr('disabled', true);
			}
		}
	} else {
		if (previousCollegeName === "" || previousCollegeName === undefined) {
			$('#setCollege').html(TAPi18n.__('modal-dialog.college_required'));
			$('#setCollege').val();
			Session.set('poolFilterCollege', undefined);
			if (!Meteor.settings.public.university.singleUniversity) {
				$('.setCourseDropdown').attr('disabled', true);
			}
		} else {
			$('#setCollege').html(previousCollegeName);
			$('#setCollege').val(previousCollegeName);
			Session.set('poolFilterCollege', previousCollegeName);
		}
	}
	$('#setCollegeLabel').css('color', '');
	$('.setCollegeDropdown').css('border-color', '');
	$('#helpSetCollege').html('');

	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute() && Session.get("ShuffleTemplate").course !== "" && Session.get("ShuffleTemplate").course !== undefined) {
			$('#setCourse').html(Session.get("ShuffleTemplate").course);
			$('#setCourse').val(Session.get("ShuffleTemplate").course);
		} else {
			$('#setCourse').html(TAPi18n.__('modal-dialog.course_required'));
			$('#setCourse').val('');
		}
	} else {
		if (previousCourseName === "" || previousCourseName === undefined) {
			$('#setCourse').html(TAPi18n.__('modal-dialog.course_required'));
			$('#setCourse').val();
		} else {
			$('#setCourse').html(previousCourseName);
			$('#setCourse').val(previousCourseName);
		}
	}
	$('#setCourseLabel').css('color', '');
	$('.setCourseDropdown').css('border-color', '');
	$('#helpSetCourse').html('');


	if (newCardsetCourseIterationRoute()) {
		if (shuffleRoute()) {
			$('#setDescription').val(Session.get("ShuffleTemplate").description);
		} else {
			$('#setDescription').val('');
		}
	} else {
		$('#setDescription').val(Session.get('previousDescription'));
	}

	if (createRoute() || courseIterationRoute()) {
		deactivateModule();
		Session.set('cardType', Number(0));
	} else if (shuffleRoute()) {
		if (Session.get("ShuffleTemplate").moduleActive) {
			activateModule();
		} else {
			deactivateModule();
		}
	} else if (cardsetRoute()) {
		if (Session.get('previousModuleActive')) {
			activateModule();
		} else {
			deactivateModule();
		}
	}
	adjustDifficultyColor();
	if (courseIterationRoute()) {
		$('#publishKind > label').removeClass('active');
		$('#kindoption0').addClass('active');
		Session.set('kindWithPrice', undefined);
	}
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
	if ($('#setDescription').val() === "" && Session.get('moduleActive')) {
		$('#setDescriptionLabel').css('color', '#b94a48');
		$('#setDescription').css('border-color', '#b94a48');
		$('#helpSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
		$('#helpSetDescription').css('color', '#b94a48');
	}
	if ($('#setModule').val() === "" && Session.get('moduleActive')) {
		$('#setModuleLabel').css('color', '#b94a48');
		$('#setModule').css('border-color', '#b94a48');
		$('#helpSetModule').html(TAPi18n.__('modal-dialog.module_required'));
		$('#helpSetModule').css('color', '#b94a48');
	}
	if ($('#setModuleShort').val() === "" && Session.get('moduleActive')) {
		$('#setModuleShortLabel').css('color', '#b94a48');
		$('#setModuleShort').css('border-color', '#b94a48');
		$('#helpSetModuleShort').html(TAPi18n.__('modal-dialog.moduleShort_required'));
		$('#helpSetModuleShort').css('color', '#b94a48');
	}
	if ($('#setModuleNum').val() === "" && Session.get('moduleActive')) {
		$('#setModuleNumLabel').css('color', '#b94a48');
		$('#setModuleNum').css('border-color', '#b94a48');
		$('#helpSetModuleNum').html(TAPi18n.__('modal-dialog.moduleNum_required'));
		$('#helpSetModuleNum').css('color', '#b94a48');
	}
	if (!Meteor.settings.public.university.singleUniversity) {
		if ($('#setCollege').val() === "" && Session.get('moduleActive')) {
			$('#setCollegeLabel').css('color', '#b94a48');
			$('.setCollegeDropdown').css('border-color', '#b94a48');
			$('#helpSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
			$('#helpSetCollege').css('color', '#b94a48');
		}
	}
	if ($('#setCourse').val() === "" && Session.get('moduleActive')) {
		$('#setCourseLabel').css('color', '#b94a48');
		$('.setCourseDropdown').css('border-color', '#b94a48');
		$('#helpSetCourse').html(TAPi18n.__('modal-dialog.course_required'));
		$('#helpSetCourse').css('color', '#b94a48');
	}
	if ($('#setName').val() !== "" &&
		($('#setDescription').val() !== "" || !Session.get('moduleActive')) &&
		($('#setModule').val() !== "" || !Session.get('moduleActive')) &&
		($('#setModuleShort').val() !== "" || !Session.get('moduleActive')) &&
		($('#setModuleNum').val() !== "" || !Session.get('moduleActive')) &&
		($('#setCollege').val() !== "" || !Session.get('moduleActive') || Meteor.settings.public.university.singleUniversity) &&
		($('#setCourse').val() !== "" || !Session.get('moduleActive'))) {
		let name, cardType, description, module, moduleShort, moduleNum, moduleLink, college, course, shuffled,
			cardGroups;
		name = $('#setName').val();
		cardType = $('#setCardType').val();
		description = $('#setDescription').val();
		module = $('#setModule').val();
		moduleShort = $('#setModuleShort').val();
		moduleNum = $('#setModuleNum').val();
		moduleLink = $('#setModuleLink').val();
		if (moduleLink === undefined) {
			moduleLink = "";
		}
		college = $('#setCollege').val();
		course = $('#setCourse').val();
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
				Meteor.call("addCourseIteration", name, description, false, true, kind, Session.get('moduleActive'), module, moduleShort, moduleNum, moduleLink, college, course, Session.get('semester'), price, Session.get('targetAudience'));
				$('#setCardsetCourseIterationFormModal').modal('hide');
			} else {
				Meteor.call("addCardset", name, description, false, true, 'personal', Session.get('moduleActive'), module, moduleShort, moduleNum, moduleLink, college, course, shuffled, cardGroups, Number(cardType), Session.get('difficultyColor'), function (error, result) {
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
				Meteor.call("updateCourseIteration", name, description, Session.get('moduleActive'), module, moduleShort, moduleNum, moduleLink, college, course);
			} else {
				Meteor.call("updateCardset", Router.current().params._id, name, description, Session.get('moduleActive'), module, moduleShort, moduleNum, moduleLink, college, course, Number(cardType), Session.get('difficultyColor'));
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

let additionalButtons = [
	[{
		name: "groupCustom",
		data: [{
			name: 'cmdPics',
			title: 'Image',
			icon: 'fa fa-file-image-o',
			callback: image
		}, {
			name: "cmdTex",
			title: "Tex",
			icon: "fa fa-superscript",
			callback: tex
		}, {
			name: 'cmdYouTube',
			title: 'YouTube',
			icon: 'fa fa-youtube',
			callback: function () {
				$("#underDevelopmentModal").modal("show");
			}
		}, {
			name: 'cmdVimeo',
			title: 'Vimeo',
			icon: 'fa fa-vimeo',
			callback: function () {
				$("#underDevelopmentModal").modal("show");
			}
		}, {
			name: 'cmdTask',
			title: 'Task',
			icon: 'fa fa-check-square',
			callback: function (e) {
				// Prepend/Give - surround the selection
				let chunk, cursor, selected = e.getSelection();

				// transform selection and set the cursor into chunked text
				if (selected.length === 0) {
					// Give extra word
					chunk = e.__localize('list task here');

					e.replaceSelection('* [ ]  ' + chunk);
					// Set the cursor
					cursor = selected.start + 7;
				} else {
					if (selected.text.indexOf('\n') < 0) {
						chunk = selected.text;

						e.replaceSelection('* [ ]  ' + chunk);

						// Set the cursor
						cursor = selected.start + 7;
					} else {
						let list = [];

						list = selected.text.split('\n');
						chunk = list[0];

						$.each(list, function (k, v) {
							list[k] = '* [ ]  ' + v;
						});

						e.replaceSelection('\n\n' + list.join('\n'));

						// Set the cursor
						cursor = selected.start + 4;
					}
				}

				// Set the cursor
				e.setSelection(cursor, cursor + chunk.length);
			}
		}
		]
	}]
];

Template.cardsetCourseIterationFormContent.onRendered(function () {
	$("#setDescription").markdown({
		autofocus: false,
		hiddenButtons: ["cmdPreview", "cmdImage", "cmdItalic"],
		fullscreen: false,
		iconlibrary: "fa",
		footer: "<p></p>",
		onChange: function (e) {
			var content = e.getContent();
			if (content !== "") {
				Meteor.promise("convertMarkdown", content)
					.then(function (rendered) {
						$(".md-footer").html(rendered);
					});
			}
		},
		additionalButtons: additionalButtons
	});
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
	adjustMarkdownToolbar();
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
	isModuleActive: function () {
		return Session.get('moduleActive');
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
	getShuffleDescription: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").description : "";
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
	'keyup #setDescription': function () {
		$('#setDescriptionLabel').css('color', '');
		$('#setDescription').css('border-color', '');
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
	},
	'click .moduleRadioButton': function (event) {
		if ($(event.currentTarget).val() === "true") {
			Session.set('moduleActive', true);
			$('.moduleBody').css('display', '');
		} else {
			Session.set('moduleActive', false);
			$('.moduleBody').css('display', 'none');
		}
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
