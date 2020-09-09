import {Session} from "meteor/session";
import {CardType} from "../../../util/cardTypes";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import {CardEditor} from "../../../util/cardEditor.js";
import {CardVisuals} from "../../../util/cardVisuals";
import ResizeSensor from "../../../../client/thirdParty/resizeSensor/ResizeSensor";
import {Cards} from "../../../api/subscriptions/cards";
import {MarkdeepEditor} from "../../../util/markdeepEditor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "../card.js";
import "../../markdeep/editor/content/content.js";
import "../../markdeep/editor/navigation/navigation.js";
import "./modal/cancelEdit.js";
import "./modal/learningUnit.js";
import "./item/buttonCancel.js";
import "./item/buttonSave.js";
import "./item/buttonSaveNext.js";
import "./item/buttonSaveReturn.js";
import "./item/learningGoalLevel.js";
import "./item/subject.js";
import "./editor.html";
import {Route} from "../../../util/route";
import {Fullscreen} from "../../../util/fullscreen";

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
		return Fullscreen.isEditorFullscreenActive() || !Fullscreen.isActive();
	},
	isMobilePreviewActive: function () {
		return Session.get('mobilePreview');
	},
	isMobilePreviewActiveAndFullscreen: function () {
		return Fullscreen.isActive() && Session.get('mobilePreview') && !Fullscreen.isEditorFullscreenActive();
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
	if (!Session.get('is3DActive')) {
		$('.carousel-inner').removeClass('card-3d-overflow');
	}
});

Template.editor.onDestroyed(function () {
	Session.set('isAnswerEditorEnabled', false);
	Session.set('isExplanationEditorEnabled', false);
	Session.set('activeAnswerID', -1);
	Session.set('cardAnswersQuestion', '');
});

/*
 * ############################################################################
 * newCard
 * ############################################################################
 */
Template.newCard.onCreated(function () {
	if (!Route.isTranscript()) {
		Session.set('cardType', Cardsets.findOne({_id: FlowRouter.getParam('_id')}).cardType);
		Session.set('difficultyColor', Cardsets.findOne({_id: FlowRouter.getParam('_id')}).difficulty);
	} else {
		Session.set('cardType', 2);
		Session.set('difficultyColor', 0);
	}
	CardEditor.resetSessionData(true);
});

/*
 * ############################################################################
 * editCard
 * ############################################################################
 */
Template.editCard.onCreated(function () {
	if (!Route.isTranscript()) {
		CardEditor.loadEditModeContent(Cards.findOne({_id: FlowRouter.getParam('card_id'), cardset_id: FlowRouter.getParam('_id')}));
		Session.set('cardType', Cardsets.findOne({_id: FlowRouter.getParam('_id')}).cardType);
		Session.set('difficultyColor', Cardsets.findOne({_id: FlowRouter.getParam('_id')}).difficulty);
	} else {
		CardEditor.loadEditModeContent(Cards.findOne({_id: FlowRouter.getParam('card_id'), cardset_id: "-1"}));
		Session.set('cardType', Cards.findOne({_id: FlowRouter.getParam('card_id')}).cardType);
		Session.set('difficultyColor', Cards.findOne({_id: FlowRouter.getParam('card_id')}).difficulty);
	}
});
