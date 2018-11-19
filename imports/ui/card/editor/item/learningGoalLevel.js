import {Session} from "meteor/session";
import {CardEditor} from "../../../../api/cardEditor.js";
import "./learningGoalLevel.html";

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
		CardEditor.setEditorButtonIndex(1);
		Session.set('learningGoalLevel', Number($(event.target).data('lvl')));
	}
});
