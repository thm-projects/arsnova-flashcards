import {Cardsets} from "../../../../api/subscriptions/cardsets";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../api/transcriptBonus";
import {Route} from "../../../../api/route";
import {Template} from "meteor/templating";
import {CardType} from "../../../../api/cardTypes";
import "./learningUnit.html";

/*
 * ############################################################################
 * selectLearningUnit
 * ############################################################################
 */

Template.selectLearningUnit.helpers({
	getBonusLectures: function () {
		let cardsets = Cardsets.find({},{
			sort: {name: 1},
			fields: {name: 1, transcriptBonus: 1, _id: 1, cardType: 1, quantity: 1, shuffled: 1, difficulty: 1, kind: 1}
		}).fetch();
		let lectures = [];
		for (let c = 0; c < cardsets.length; c++) {
			if (CardType.gotTranscriptBonus(cardsets[c].cardType)) {
				for (let d = 0; d < cardsets[c].transcriptBonus.lectures.length; d++) {
					let transcriptBonus = cardsets[c].transcriptBonus;
					transcriptBonus.cardset_id = cardsets[c]._id;
					transcriptBonus.name = cardsets[c].name;
					transcriptBonus.date = cardsets[c].transcriptBonus.lectures[d].date;
					if (TranscriptBonusList.canBeSubmittedToLecture(transcriptBonus, d)) {
						let lecture = {};
						lecture.name = TranscriptBonusList.getLectureName(transcriptBonus);
						lecture.deadline = TranscriptBonusList.getDeadline(transcriptBonus, cardsets[c].transcriptBonus.lectures[d].date);
						lecture.deadlineEditing = TranscriptBonusList.getDeadlineEditing(transcriptBonus, cardsets[c].transcriptBonus.lectures[d].date);
						lecture.cardset_id = cardsets[c]._id;
						lecture.date_id = d;
						lecture.shuffled = cardsets[c].shuffled;
						lecture.quantity = cardsets[c].quantity;
						lecture.cardType = cardsets[c].cardType;
						lecture.difficulty = cardsets[c].difficulty;
						lecture.kind = cardsets[c].kind;
						lecture.transcriptBonus = cardsets[c].transcriptBonus;
						lectures.push(lecture);
					}
				}
			}
		}
		return lectures;
	},
	isPrivateTranscript: function () {
		return Session.get('isPrivateTranscript');
	},
	getRadioButtonStatus: function (id) {
		if (id === 0 && Session.get('isPrivateTranscript')) {
			return "checked";
		} else if (id === 1 && !Session.get('isPrivateTranscript')) {
			return "checked";
		} else {
			return "";
		}
	},
	getBonusLectureName: function () {
		if (Session.get('transcriptBonus') !== undefined) {
			let cardset = Cardsets.findOne({_id: Session.get('transcriptBonus').cardset_id}, {fields: {_id: 1, name: 1}});
			let transcriptBonus = Session.get('transcriptBonus');
			transcriptBonus.name = cardset.name;
			return TranscriptBonusList.getLectureName(transcriptBonus, true);
		} else {
			return TAPi18n.__('transcriptForm.placeholder');
		}
	}
});

Template.selectLearningUnit.events({
	'click .transcriptBonusLecture': function (evt) {
		let cardset = Cardsets.findOne({_id: $(evt.currentTarget).attr("data-cardset_id")});
		let transcriptBonus = cardset.transcriptBonus;
		transcriptBonus.name = cardset.name;
		transcriptBonus.date = cardset.transcriptBonus.lectures[$(evt.currentTarget).attr("data-date_id")].date;
		transcriptBonus.cardset_id = cardset._id;
		transcriptBonus.date_id = $(evt.currentTarget).attr("data-date_id");
		Session.set('transcriptBonus', transcriptBonus);
		$('#showSelectLearningUnitModal').modal('hide');
	},
	'click #learningUnitCancel': function () {
		$('#showSelectLearningUnitModal').modal('hide');
	},
	'click #privateTranscript': function () {
		Session.set('isPrivateTranscript', true);
	},
	'click #referencesLecture': function () {
		Session.set('isPrivateTranscript', false);
	},
	'click #saveBonusLecture': function () {
		Session.set('transcriptBonus', undefined);
		$('#showSelectLearningUnitModal').modal('hide');
	}
});

Template.selectLearningUnit.onCreated(function () {
	if (Route.isNewTranscript()) {
		Session.set('isPrivateTranscript', true);
		Session.set('transcriptBonus', undefined);
	} else {
		let bonus = TranscriptBonus.findOne({card_id: FlowRouter.getParam('card_id')});
		if (bonus !== undefined) {
			let cardset = Cardsets.findOne({_id: bonus.cardset_id});
			bonus.name = cardset.name;
			Session.set('isPrivateTranscript', false);
			Session.set('transcriptBonus', bonus);
		} else {
			Session.set('isPrivateTranscript', true);
			Session.set('transcriptBonus', undefined);
		}
	}
});

Template.selectLearningUnit.onRendered(function () {
	if (Session.get('transcriptBonus') !== undefined) {
		$('#setTranscriptBonusLecture').html(TranscriptBonusList.getLectureName(Session.get('transcriptBonus'), true));
	}
	if (Route.isNewTranscript()) {
		$('#showSelectLearningUnitModal').modal('show');
	}
	$('#showSelectLearningUnitModal').on('show.bs.modal', function () {
		if (Session.get('transcriptBonus') !== undefined) {
			let cardset = Cardsets.findOne({_id: Session.get('transcriptBonus').cardset_id}, {fields: {_id: 1, name: 1}});
			let transcriptBonus = Session.get('transcriptBonus');
			transcriptBonus.name = cardset.name;
			$('#setTranscriptBonusLecture').html(TranscriptBonusList.getLectureName(transcriptBonus, true));
		} else {
			$('#setTranscriptBonusLecture').html(TAPi18n.__('transcriptForm.placeholder'));
		}
	});
	$('#showSelectLearningUnitModal').on('hidden.bs.modal', function () {
		if (Session.get('transcriptBonus') === undefined) {
			Session.set('isPrivateTranscript', true);
		}
	});
});

Template.selectLearningUnit.onDestroyed(function () {
	Session.set('transcriptBonus', undefined);
});
