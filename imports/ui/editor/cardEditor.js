import "./cardEditor.html";
import "../card/card.js";
import {Session} from "meteor/session";
import {CardType} from "../../api/cardTypes";
import {Template} from "meteor/templating";
import {Cards} from "../../api/cards";
import {Cardsets} from "../../api/cardsets";
import {CardEditor} from "../../api/cardEditor.js";
import {CardVisuals} from "../../api/cardVisuals.js";
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
 * contentNavigation
 * ############################################################################
 */
Template.contentNavigation.events({
	'click #editFront': function () {
		CardEditor.editFront();
	},
	'click #editBack': function () {
		CardEditor.editBack();
	},
	'click #editLecture': function () {
		CardEditor.editLecture();
	},
	'click #editHint': function () {
		CardEditor.editHint();
	},
	'focus #editFront': function () {
		CardEditor.editFront();
	},
	'focus #editBack': function () {
		CardEditor.editBack();
	},
	'focus #editLecture': function () {
		CardEditor.editLecture();
	},
	'focus #editHint': function () {
		CardEditor.editHint();
	}
});

Template.contentNavigation.helpers({
	gotHint: function () {
		return CardType.gotHint(Session.get('cardType'));
	},
	gotLecture: function () {
		return CardType.gotLecture(Session.get('cardType'));
	},
	gotBack: function () {
		return CardType.gotBack(Session.get('cardType'));
	}
});

Template.contentNavigation.onCreated(function () {
	if (Session.get('fullscreen') && !Route.isPresentationOrDemo()) {
		CardVisuals.toggleFullscreen();
	}
	Session.set('reverseViewOrder', false);
});

Template.contentNavigation.onRendered(function () {
	$(window).resize(function () {
		if ($(window).width() <= 1200) {
			$("#button-row").insertBefore($("#preview"));
		} else {
			$("#button-row").insertAfter($("#preview"));
		}
	});
	$('#editFront').click();
});

/*
 * ############################################################################
 * contentNavigationFront
 * ############################################################################
 */
Template.contentNavigationFront.helpers({
	getFrontTitle: function () {
		if (CardType.gotSidesSwapped(Session.get('cardType'))) {
			return CardType.getBackTitle();
		} else {
			return CardType.getFrontTitle();
		}
	},
	gotFourColumns: function () {
		return CardType.gotFourColumns(Session.get('cardType'));
	},
	gotThreeColumns: function () {
		return CardType.gotThreeColumns(Session.get('cardType'));
	},
	gotOneColumn: function () {
		return CardType.gotOneColumn(Session.get('cardType'));
	}
});

/*
 * ############################################################################
 * contentNavigationBack
 * ############################################################################
 */
Template.contentNavigationBack.helpers({
	getBackTitle: function () {
		if (CardType.gotSidesSwapped(Session.get('cardType'))) {
			return TAPi18n.__('card.cardType' + Session.get('cardType') + '.front');
		} else {
			return TAPi18n.__('card.cardType' + Session.get('cardType') + '.back');
		}
	},
	gotFourColumns: function () {
		return CardType.gotFourColumns(Session.get('cardType'));
	},
	gotThreeColumns: function () {
		return CardType.gotThreeColumns(Session.get('cardType'));
	}
});

/*
 * ############################################################################
 * contentNavigationHint
 * ############################################################################
 */
Template.contentNavigationHint.helpers({
	getHintTitle: function () {
		return CardType.getHintTitle();
	},
	gotFourColumns: function () {
		return CardType.gotFourColumns(Session.get('cardType'));
	},
	gotThreeColumns: function () {
		return CardType.gotThreeColumns(Session.get('cardType'));
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
		return Session.get('subjectText');
	},
	getSubjectPlaceholder: function () {
		return CardType.getSubjectPlaceholderText(Session.get('cardType'));
	},
	gotLearningUnit: function () {
		return CardType.gotLearningUnit(this.cardType);
	},
	isDisabled: function () {
		if (Session.get('learningUnit') !== "0") {
			return "disabled";
		}
		return "";
	}
});

Template.subjectEditor.events({
	'keyup #subjectEditor': function () {
		$('#subjectEditor').css('border', 0);
		Session.set('subjectText', $('#subjectEditor').val());
	},
	'click .subjectEditorButton': function () {
		Session.set('tempLearningIndex', Session.get('learningIndex'));
		Session.set('tempLearningUnit', Session.get('learningUnit'));
	}
});

Template.subjectEditor.rendered = function () {
	Session.set('subjectText', $('#subjectEditor').val());
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
