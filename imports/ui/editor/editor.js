import "./editor.html";
import "../card/card.js";
import {Session} from "meteor/session";
import {CardType} from "../../api/cardTypes";
import {Template} from "meteor/templating";
import {Cardsets} from "../../api/cardsets";
import {CardEditor} from "../../api/cardEditor.js";
import {CardVisuals} from "../../api/cardVisuals";


/*
 * ############################################################################
 * editor
 * ############################################################################
 */

Template.editor.helpers({
	getSubjectLabel: function () {
		return TAPi18n.__('card.cardType' + Session.get('cardType') + '.editorLabels.subject');
	},
	gotLearningGoal: function () {
		return CardType.gotLearningGoal(this.cardType);
	},
	getContent: function () {
		if (Router.current().route.getName() === "newCard") {
			Session.set('cardType', Cardsets.findOne({_id: Router.current().params._id}).cardType);
			Session.set('difficultyColor', Cardsets.findOne({_id: Router.current().params._id}).difficulty);
			CardEditor.resetSessionData(true);
		} else if (Router.current().route.getName() === "editCard") {
			Session.set('subject', this.subject);
			Session.set('content1', this.front);
			Session.set('content2', this.back);
			Session.set('content3', this.hint);
			Session.set('content4', this.lecture);
			Session.set('content5', this.top);
			Session.set('content6', this.bottom);
			Session.set('cardType', this.cardType);
			Session.set('centerTextElement', this.centerTextElement);
			Session.set('difficultyColor', this.difficulty);
			Session.set('learningGoalLevel', this.learningGoalLevel);
			Session.set('backgroundStyle', this.backgroundStyle);
			Session.set('learningUnit', this.learningUnit);
			Session.set('learningIndex', this.learningIndex);
		}
	},
	isTextCentered: function () {
		CardVisuals.isTextCentered();
	}
});

Template.editor.events({
	'click .editorBrush': function () {
		CardEditor.checkBackgroundStyle();
	}
});

