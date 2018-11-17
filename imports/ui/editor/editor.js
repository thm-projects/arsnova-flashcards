import "./editor.html";
import "../card/card.js";
import {Session} from "meteor/session";
import {CardType} from "../../api/cardTypes";
import {Template} from "meteor/templating";
import {Cardsets} from "../../api/cardsets";
import {CardEditor} from "../../api/cardEditor.js";
import {CardVisuals} from "../../api/cardVisuals";
import ResizeSensor from "../../../client/resize_sensor/ResizeSensor";


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

Template.editor.onRendered(function () {
	new ResizeSensor($('#preview'), function () {
		CardVisuals.resizeFlashcard();
	});
	CardEditor.initializeEditorButtons();
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
	Session.set('mobilePreview', 1);
	Session.set('mobilePreviewRotated', 0);
});

/*
 * ############################################################################
 * editCard
 * ############################################################################
 */
Template.editCard.onCreated(function () {
	Session.set('cardType', Cardsets.findOne({_id: Router.current().params._id}).cardType);
	Session.set('difficultyColor', Cardsets.findOne({_id: Router.current().params._id}).difficulty);
	Session.set('mobilePreview', 1);
	Session.set('mobilePreviewRotated', 0);
});
