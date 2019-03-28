import {Session} from "meteor/session";
import {CardType} from "../../../api/cardTypes";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../api/cardsets";
import {CardEditor} from "../../../api/cardEditor.js";
import {CardVisuals} from "../../../api/cardVisuals";
import ResizeSensor from "../../../../client/thirdParty/resizeSensor/ResizeSensor";
import {Cards} from "../../../api/cards";
import {MarkdeepEditor} from "../../../api/markdeepEditor";
import "../card.js";
import "./modal/cancelEdit.js";
import "./modal/learningUnit.js";
import "./item/buttonCancel.js";
import "./item/buttonSave.js";
import "./item/buttonSaveNext.js";
import "./item/buttonSaveReturn.js";
import "./item/learningGoalLevel.js";
import "./item/subject.js";
import "./editor.html";

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
		return CardType.gotLearningGoal(Session.get('cardType'));
	},
	isTextCentered: function () {
		CardVisuals.isTextCentered();
	},
	isEditorView: function () {
		return CardVisuals.isEditorFullscreen() || !CardVisuals.isFullscreen();
	},
	isMobilePreviewActive: function () {
		return Session.get('mobilePreview');
	},
	isMobilePreviewActiveAndFullscreen: function () {
		return CardVisuals.isFullscreen() && Session.get('mobilePreview') && !CardVisuals.isEditorFullscreen();
	},
	isMobilePreviewRotated: function () {
		return Session.get('mobilePreviewRotated');
	}
});

Template.editor.events({
	'click .editorBrush': function () {
		CardEditor.checkBackgroundStyle();
	}
});

Template.editor.onCreated(function () {
	CardEditor.initializeEditorButtons();
	if (CardType.gotDefaultMobilePreview(Session.get('cardType'))) {
		Session.set('mobilePreview', 1);
	} else {
		Session.set('mobilePreview', 0);
	}
	Session.set('mobilePreviewRotated', MarkdeepEditor.getDefaultMobilePreviewOrientation());
});

Template.editor.onRendered(function () {
	new ResizeSensor($('#preview'), function () {
		CardVisuals.resizeFlashcard();
	});
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

/*
 * ############################################################################
 * editCard
 * ############################################################################
 */
Template.editCard.onCreated(function () {
	CardEditor.loadEditModeContent(Cards.findOne({_id: Router.current().params.card_id, cardset_id: Router.current().params._id}));
	Session.set('cardType', Cardsets.findOne({_id: Router.current().params._id}).cardType);
	Session.set('difficultyColor', Cardsets.findOne({_id: Router.current().params._id}).difficulty);
});
