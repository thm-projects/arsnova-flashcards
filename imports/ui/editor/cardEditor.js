import "./cardEditor.html";
import "../card/card.js";
import {Session} from "meteor/session";
import {CardType} from "../../api/cardTypes";
import {Template} from "meteor/templating";
import {Cards} from "../../api/cards";
import {Cardsets} from "../../api/cardsets";
import {CardEditor} from "../../api/cardEditor.js";
import {Route} from "../../api/route.js";


/*
 * ############################################################################
 * selectLearningUnit
 * ############################################################################
 */

Template.selectLearningUnit.helpers({
	getCardsetId: function () {
		return Session.get('tempLearningIndex');
	},
	getCardsetName: function () {
		if (Session.get('tempLearningIndex') === "0") {
			return TAPi18n.__('learningUnit.none');
		} else if (Session.get('tempLearningIndex') !== undefined) {
			return Cardsets.findOne({_id: Session.get('tempLearningIndex')}).name;
		}
	},
	gotLearningIndex: function () {
		return Session.get('tempLearningIndex') !== "0";
	},
	learningIndex: function () {
		return Cardsets.find({cardType: 0, visible: true, kind: {$in: ['free', 'edu']}}, {
			sort: {name: 1},
			fields: {name: 1}
		});
	}
});

Template.selectLearningUnit.events({
	'click .learningIndex': function (evt) {
		let learningIndex = $(evt.currentTarget).attr("data");
		Session.set('tempLearningIndex', learningIndex);
		$('#setLearningIndexLabel').css('color', '');
		$('.setLearningIndexDropdown').css('border-color', '');
		$('#helpLearningIndexType').html('');
		if (learningIndex === "0") {
			$('#showSelectLearningUnitModal').modal('hide');
			Session.set('learningIndex', "0");
			Session.set('learningUnit', "0");
		}
	},
	'click #learningUnitCancel': function () {
		$('#showSelectLearningUnitModal').modal('hide');
	}
});

Template.btnCard.helpers({
	isEditMode: function () {
		return Route.isEditMode();
	},
	learningActive: function () {
		return Cardsets.findOne(Router.current().params._id).learningActive;
	}
});

Template.btnCard.events({
	"click #cardSave": function () {
		CardEditor.saveCard(Router.current().params.card_id, false);
	},
	"click #cardSaveReturn": function () {
		CardEditor.saveCard(Router.current().params.card_id, true);
	}
});

/*
 * ############################################################################
 * SubjectEditor
 * ############################################################################
 */
Template.subjectEditor.helpers({
	getSubject: function () {
		if (CardType.gotLearningUnit(Session.get('cardType')) && Session.get('learningUnit') !== "0") {
			let card = Cards.findOne({_id: Session.get('learningUnit')});
			if (card !== undefined && card.subject !== undefined) {
				return card.subject;
			} else {
				return "";
			}
		}
		return Session.get('subject');
	},
	getSubjectPlaceholder: function () {
		return CardType.getSubjectPlaceholderText(Session.get('cardType'));
	},
	gotLearningUnit: function () {
		return CardType.gotLearningUnit(this.cardType);
	}
});

Template.subjectEditor.events({
	'keyup #subjectEditor': function () {
		$('#subjectEditor').css('border', 0);
		Session.set('subject', $('#subjectEditor').val());
	},
	'click .subjectEditorButton': function () {
		Session.set('tempLearningIndex', Session.get('learningIndex'));
		Session.set('tempLearningUnit', Session.get('learningUnit'));
	}
});

Template.subjectEditor.rendered = function () {
	Session.set('subject', $('#subjectEditor').val());
};

/*
 * ############################################################################
 * learningGoalLevel
 * ############################################################################
 */

Template.learningGoalLevel.helpers({
	isLearningGoalLevelChecked: function (learningGoalLevel) {
		return learningGoalLevel <= Session.get('learningGoalLevel');
	},
	isLearningGoalLevel: function (learningGoalLevel) {
		return learningGoalLevel === Session.get('learningGoalLevel');
	}
});

Template.learningGoalLevel.events({
	'click #learningGoalLevelGroup': function (event) {
		Session.set('learningGoalLevel', Number($(event.target).data('lvl')));
	}
});
