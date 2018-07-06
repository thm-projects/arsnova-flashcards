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
	isTextCentered: function () {
		CardVisuals.isTextCentered();
	},
	isEditorView: function () {
		return CardVisuals.isEditorFullscreen() || !CardVisuals.isFullscreen();
	}
});

Template.editor.events({
	'click .editorBrush': function () {
		CardEditor.checkBackgroundStyle();
	}
});

/*
 * ############################################################################
 * newCard
 * ############################################################################
 */
Template.newCard.onCreated(function () {
	Session.set('cardType', Cardsets.findOne({_id: Router.current().params._id}).cardType);
	Session.set('difficultyColor', Cardsets.findOne({_id: Router.current().params._id}).difficulty);
	CardEditor.resetSessionData(true);
});
