import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {CardEditor} from "../../../../api/cardEditor";
import {Route} from "../../../../api/route";
import {Cardsets} from "../../../../api/cardsets";
import {CardType} from "../../../../api/cardTypes";
import "./center.html";

/*
 * ############################################################################
 * flashcardHeaderCenter
 * ############################################################################
 */

Template.flashcardHeaderCenter.helpers({
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
	displaysLearningGoalInformation: function () {
		return CardType.displaysLearningGoalInformation(this.cardType);
	},
	displaysSideInformation: function () {
		return CardType.displaysSideInformation(this.cardType);
	},
	gotSidesSwapped: function () {
		return CardType.gotSidesSwapped(this.cardType);
	},
	getCardsetName: function () {
		return Cardsets.findOne({_id: this.cardset_id}).name;
	},
	getLearningGoalName: function () {
		return TAPi18n.__('learning-goal.level' + (this.learningGoalLevel + 1));
	},
	gotDictionary: function () {
		return CardType.gotDictionary(this.cardType);
	},
	getFrontTitle: function () {
		return CardType.getFrontTitle(this.cardType);
	},
	getBackTitle: function () {
		return CardType.getBackTitle(this.cardType);
	},
	reversedViewOrder: function () {
		return Session.get('reverseViewOrder');
	},
	getPlaceholder: function (mode) {
		CardEditor.getPlaceholder(mode);
	}
});
