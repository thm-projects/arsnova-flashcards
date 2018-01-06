//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../api/cardsets.js";
import {Leitner, Wozniak} from "../../api/learned.js";
import "../cardset/cardset.js";
import "./cardsets.html";
import {image, tex} from '/imports/ui/card/card.js';

Session.setDefault('cardsetId', undefined);

Meteor.subscribe("cardsets");

function cleanModal() {
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
}

/*
 * ############################################################################
 * create
 * ############################################################################
 */

Template.create.helpers({
	cardsetList: function () {
		return Cardsets.find({
			owner: Meteor.userId()
		}, {
			sort: {name: 1}
		});
	}
});

/*
 * ############################################################################
 * learn
 * ############################################################################
 */

Template.learn.helpers({
	learnList: function () {
		var leitnerCards = Leitner.find({
			user_id: Meteor.userId()
		});

		let wozniakCards = Wozniak.find({
			user_id: Meteor.userId()
		});
		var learnCardsets = [];
		leitnerCards.forEach(function (leitnerCard) {
			if ($.inArray(leitnerCard.cardset_id, learnCardsets) === -1) {
				learnCardsets.push(leitnerCard.cardset_id);
			}
		});

		wozniakCards.forEach(function (wozniakCard) {
			if ($.inArray(wozniakCard.cardset_id, learnCardsets) === -1) {
				learnCardsets.push(wozniakCard.cardset_id);
			}
		});
		return Cardsets.find({
			_id: {
				$in: learnCardsets
			}
		}, {
			sort: {name: 1}
		});
	}
});

Template.learn.events({
	'click .deleteLearned': function (event) {
		Session.set('cardsetId', $(event.target).data('id'));
	},
	'click #browseCardset': function () {
		Session.set("selectingCardsetToLearn", true);
		Router.go('pool');
	}
});

/*
 * ############################################################################
 * cardsetRow
 * ############################################################################
 */

Template.cardsetRow.events({
	"click .addShuffleCardset": function (event) {
		let array = Session.get("ShuffledCardsets");
		let arrayExclude = Session.get("ShuffledCardsetsExclude");
		let cardset = Cardsets.findOne({_id: $(event.target).data('id')}, {shuffled: 1, cardGroups: 1});
		if (cardset.shuffled) {
			for (let i = 0; i < cardset.cardGroups.length; i++) {
				if (!array.includes(cardset.cardGroups[i])) {
					array.push(cardset.cardGroups[i]);
				}
			}
			arrayExclude.push($(event.target).data('id'));
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		} else {
			array.push($(event.target).data('id'));
		}
		Session.set("ShuffledCardsets", array);
	},
	"click .removeShuffleCardset": function (event) {
		let array = Session.get("ShuffledCardsets");
		let arrayExclude = Session.get("ShuffledCardsetsExclude");
		let cardset = Cardsets.findOne({_id: $(event.target).data('id')}, {shuffled: 1, cardGroups: 1});
		if (cardset.shuffled) {
			array = jQuery.grep(array, function (value) {
				for (let i = 0; i < cardset.cardGroups.length; i++) {
					if (value === cardset.cardGroups[i]) {
						return false;
					}
				}
				return true;
			});
			arrayExclude = jQuery.grep(arrayExclude, function (value) {
				return value !== $(event.target).data('id');
			});
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		} else {
			array = jQuery.grep(array, function (value) {
				return value !== $(event.target).data('id');
			});
			for (let i = 0; i < Session.get("ShuffledCardsetsExclude").length; i++) {
				cardset = Cardsets.findOne({_id: Session.get("ShuffledCardsetsExclude")[i]}, {cardGroups: 1});
				let brokenHeart = true;
				for (let k = 0; k < cardset.cardGroups.length; k++) {
					if (array.includes(cardset.cardGroups[k])) {
						brokenHeart = false;
					}
				}
				if (brokenHeart) {
					arrayExclude.splice(i, 1);
				}
			}
			Session.set("ShuffledCardsetsExclude", arrayExclude);
		}
		Session.set("ShuffledCardsets", array);
	}
});

Template.cardsetRow.helpers({
	inShuffleSelection: function (cardset_id) {
		if (Session.get("ShuffledCardsets").includes(cardset_id) || Session.get("ShuffledCardsetsExclude").includes(cardset_id)) {
			return true;
		}
	},
	getLink: function (cardset_id) {
		return ActiveRoute.name('shuffle') ? "#" : ("/cardset/" + cardset_id);
	},
	getLearnphaseStatus: function () {
		if (this.learningActive) {
			return TAPi18n.__('set-list.activeLearnphase');
		} else {
			return TAPi18n.__('set-list.inactiveLearnphase');
		}
	},
	getWorkload: function () {
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);
		let count = Leitner.find({
			cardset_id: this._id,
			user_id: Meteor.userId(),
			active: true
		}).count() + Wozniak.find({
			cardset_id: this._id, user_id: Meteor.userId(), nextDate: {
				$lte: actualDate
			}
		}).count();
		switch (count) {
			case 0:
				return TAPi18n.__('set-list.noCardsToLearn');
			case 1:
				return TAPi18n.__('set-list.cardsToLearn');
			default:
				return count + TAPi18n.__('set-list.cardsToLearnPlural');
		}
	},
	getLearningMode: function () {
		let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		actualDate.setHours(0, 0, 0, 0);
		let count = 0;
		if (Leitner.find({cardset_id: this._id, user_id: Meteor.userId(), active: true}).count()) {
			count += 1;
		}
		if (Wozniak.find({
				cardset_id: this._id, user_id: Meteor.userId(), nextDate: {
					$lte: actualDate
				}
			}).count()) {
			count += 2;
		}
		switch (count) {
			case 0:
				return TAPi18n.__('set-list.none');
			case 1:
				return TAPi18n.__('set-list.leitner');
			case 2:
				return TAPi18n.__('set-list.wozniak');
			case 3:
				return TAPi18n.__('set-list.both');
		}
	}
});

/*
 * ############################################################################
 * shuffle
 * ############################################################################
 */

Template.shuffle.events({
	'click #createShuffledCardset': function () {
		Session.set("ShuffleTemplate", Cardsets.findOne({_id: Session.get("ShuffledCardsets")[0]}));
	},
	'click #updateShuffledCardset': function () {
		let removedCardsets = $(Cardsets.findOne({_id: Router.current().params._id}).cardGroups).not(Session.get("ShuffledCardsets")).get();
		Meteor.call("updateShuffleGroups", Router.current().params._id, Session.get("ShuffledCardsets"), removedCardsets, function (error, result) {
			if (error) {
				Bert.alert(TAPi18n.__('set-list.shuffleUpdateFailure'), 'danger', 'growl-top-left');
			}
			if (result) {
				Bert.alert(TAPi18n.__('set-list.shuffleUpdateSuccess'), 'success', 'growl-top-left');
				Router.go('cardsetdetailsid', {_id: Router.current().params._id});
			}
		});
	},
	'click #cancelUpdateShuffle': function () {
		Router.go('cardsetdetailsid', {_id: Router.current().params._id});
	},
	'click #removeShuffledCards': function () {
		Session.set("ShuffledCardsets", []);
	}
});

Template.shuffle.helpers({
	shuffleInfoText: function () {
		return TAPi18n.__('set-list.shuffleInfoText');
	},
	shuffleList: function () {
		if (Router.current().route.getName() === "editshuffle") {
			Session.set("ShuffledCardsets", Cardsets.findOne({_id: Router.current().params._id}).cardGroups);
		}
		return Cardsets.find({
			$or: [
				{owner: Meteor.userId()},
				{kind: {$in: ["free", "edu"]}}
			]
		}, {
			fields: {
				name: 1,
				description: 1,
				quantity: 1
			},
			sort: {name: 1}
		});
	},
	gotShuffledCards: function () {
		if (ActiveRoute.name('shuffle')) {
			return Session.get("ShuffledCardsets").length > 0;
		} else {
			return true;
		}
	},
	displayRemoveButton: function () {
		return Session.get("ShuffledCardsets").length > 0;
	},
	isActiveCardset: function () {
		return this._id === Router.current().params._id;
	}
});

Template.shuffle.created = function () {
	Session.set("ShuffledCardsets", []);
	Session.set("ShuffledCardsetsExclude", []);
};

/*
 * ############################################################################
 * cardsetForm
 * ############################################################################
 */

Template.cardsetsForm.helpers({
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
	getShuffleCollege: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return Session.get("ShuffleTemplate").college;
		}
	},
	getShuffleCourse: function (mode) {
		if (mode) {
			if (Session.get("ShuffleTemplate") !== undefined) {
				return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").course : "";
			} else {
				return "";
			}
		} else {
			if (Session.get("ShuffleTemplate") !== undefined) {
				return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").course : (TAPi18n.__('modal-dialog.course_required'));
			} else {
				return TAPi18n.__('modal-dialog.course_required');
			}
		}
	}
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
		if (!Meteor.settings.public.university.singleUniversity) {
			if ($('#newSetCollege').val() === "") {
				$('#newSetCollegeLabel').css('color', '#b94a48');
				$('.newSetCollegeDropdown').css('border-color', '#b94a48');
				$('#helpNewSetCollege').html(TAPi18n.__('modal-dialog.college_required'));
				$('#helpNewSetCollege').css('color', '#b94a48');
			}
		}
		if ($('#newSetCourse').val() === "") {
			$('#newSetCourseLabel').css('color', '#b94a48');
			$('.newSetCourseDropdown').css('border-color', '#b94a48');
			$('#helpNewSetCourse').html(TAPi18n.__('modal-dialog.course_required'));
			$('#helpNewSetCourse').css('color', '#b94a48');
		}
		let name;
		let description;
		let module;
		let moduleShort;
		let moduleNum;
		let college;
		let course;
		let shuffled;
		let cardGroups;
		let moduleLink = $('#newSetModuleLink').val();
		if (moduleLink === undefined) {
			moduleLink = "";
		}
		if (ActiveRoute.name('shuffle')) {
			shuffled = true;
			cardGroups = Session.get("ShuffledCardsets");
		} else {
			shuffled = false;
			cardGroups = [];
		}
		if (Meteor.settings.public.university.singleUniversity) {
			college = Meteor.settings.public.university.default;
		} else {
			college = $('#newSetCollege').text();
		}
		if ($('#newSetName').val() !== "" &&
			$('#newSetDescription').val() !== "" &&
			$('#newSetModule').val() !== "" &&
			$('#newSetModuleShort').val() !== "" &&
			$('#newSetModuleNum').val() !== "" &&
			college !== "" &&
			$('#newSetCourse').val() !== "") {
			name = $('#newSetName').val();
			description = $('#newSetDescription').val();
			module = $('#newSetModule').val();
			moduleShort = $('#newSetModuleShort').val();
			moduleNum = $('#newSetModuleNum').val();
			course = $('#newSetCourse').text();
			Meteor.call("addCardset", name, description, false, true, 'personal', module, moduleShort, moduleNum, moduleLink, college, course, shuffled, cardGroups);
			$('#newSetModal').modal('hide');
		}
		cleanModal();
	}
});

Template.cardsets.onCreated(function () {
	Session.set("selectingCardsetToLearn", false);
});

/*
 * ############################################################################
 * descriptionEditorNew
 * ############################################################################
 */

Template.descriptionEditorNew.rendered = function () {
	$("#newSetDescription").markdown({
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
		additionalButtons: [
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
				}]
			}]
		]
	});
};

Template.descriptionEditorNew.helpers({
	getShuffleDescription: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").description : "";
		}
	}
});

/*
 * ############################################################################
 * cardsetsForm
 * ############################################################################
 */

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
	},
	'click .cancel': function () {
		if (!ActiveRoute.name('shuffle')) {
			cleanModal();
		}
	}
});

/*
 * ############################################################################
 * cardsetsConfirmLearnForm
 * ############################################################################
 */

Template.cardsetsConfirmLearnForm.events({
	'click #learnDelete': function () {
		$('#confirmLearnModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteLeitner", Session.get('cardsetId'));
			Meteor.call("deleteWozniak", Session.get('cardsetId'));
		}).modal('hide');
	}
});
