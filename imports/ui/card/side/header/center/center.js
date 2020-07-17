import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {CardEditor} from "../../../../../util/cardEditor";
import {Route} from "../../../../../util/route";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {CardType} from "../../../../../util/cardTypes";
import "./center.html";
import {MarkdeepEditor} from "../../../../../util/markdeepEditor";
import {TranscriptBonus} from "../../../../../api/subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../../../../util/transcriptBonus";

/*
 * ############################################################################
 * flashcardHeaderCenter
 * ############################################################################
 */

Template.flashcardHeaderCenter.helpers({
	getLectureDate: function (card_id) {
		let bonusTranscript;
		if ((Route.isEditTranscript() || Route.isNewTranscript()) && !Session.get('isPrivateTranscript')) {
			bonusTranscript = Session.get('transcriptBonus');
		} else {
			bonusTranscript = TranscriptBonus.findOne({card_id: card_id});
		}
		if (bonusTranscript !== undefined) {
			return TranscriptBonusList.getLectureName(bonusTranscript, false);
		}
	},
	isCardset: function () {
		return Route.isCardset();
	},
	isMemo: function () {
		return Route.isMemo();
	},
	isEditModeOrPresentation: function () {
		return Route.isEditModeOrPresentation();
	},
	box: function () {
		return Session.get("selectedBox");
	},
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	gotLearningGoal: function () {
		return CardType.gotLearningGoal(this.cardType);
	},
	getCardsetName: function () {
		if (Route.isTranscript()) {
			if (this.transcript !== undefined && this.transcript.cardset_id !== undefined) {
				let cardset = Cardsets.findOne({_id: this.transcript.cardset_id}, {fields: {name: 1}});
				if (cardset !== undefined) {
					return cardset.name;
				}
			}
		} else {
			if (!CardType.gotCardsetTitleNavigation(this.cardType)) {
				return Cardsets.findOne({_id: this.cardset_id}).name;
			}
		}
	},
	getLearningGoalName: function () {
		return TAPi18n.__('learning-goal.level' + (this.learningGoalLevel + 1));
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	},
	isMobilePreview: function () {
		return MarkdeepEditor.getMobilePreview();
	},
	gotCardsetTitleNavigation: function () {
		return CardType.gotCardsetTitleNavigation(this.cardType);
	},
	displayTranscriptOwner: function () {
		return Route.isPresentationTranscriptBonusCardset() || Route.isPresentationTranscriptReview() || Route.isPresentationTranscriptBonus() || ((Route.isEditTranscript() || Route.isNewTranscript()) && !Session.get('isPrivateTranscript'));
	},
	getOwner: function (owner) {
		if (Route.isNewTranscript() || Route.isEditTranscript()) {
			return Meteor.userId;
		} else {
			return owner;
		}
	}
});
