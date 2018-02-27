import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cardsetCourseIterationForm.html";
import {image, tex} from '/imports/ui/card/card.js';

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
}

export function saveCardset() {
	if ($('#setName').val() === "") {
		$('#setNameLabel').css('color', '#b94a48');
		$('#setName').css('border-color', '#b94a48');
		$('#helpSetName').html(TAPi18n.__('modal-dialog.name_required'));
		$('#helpSetName').css('color', '#b94a48');
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
		let name, description, module, moduleShort, moduleNum, moduleLink, college, course, shuffled, cardGroups;
		name = $('#setName').val();
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
				Meteor.call("addCourseIteration", name, description, false, true, 'personal', Session.get('moduleActive'), module, moduleShort, moduleNum, moduleLink, college, course);
				$('#setCardsetCourseIterationFormModal').modal('hide');
			} else {
				Meteor.call("addCardset", name, description, false, true, 'personal', Session.get('moduleActive'), module, moduleShort, moduleNum, moduleLink, college, course, shuffled, cardGroups, function (error, result) {
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
				Meteor.call("updateCardset", Router.current().params._id, name, description, Session.get('moduleActive'), module, moduleShort, moduleNum, moduleLink, college, course);
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
	$('#setCardsetCourseIterationFormModal').on('hidden.bs.modal', function () {
		if (!shuffleRoute()) {
			cleanModal();
		}
	});
	$('.fa-quote-left').addClass('fa-quote-right').removeClass('fa-quote-left');
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
	}
});

Template.cardsetCourseIterationFormContent.events({
	'click #cardSetSave': function () {
		saveCardset();
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
