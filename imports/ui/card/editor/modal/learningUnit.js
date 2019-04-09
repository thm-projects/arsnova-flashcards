import {Cardsets} from "../../../../api/cardsets";
import {Session} from "meteor/session";
import "./learningUnit.html";

Session.setDefault('isPrivateTranscript', true);
/*
 * ############################################################################
 * selectLearningUnit
 * ############################################################################
 */

Template.selectLearningUnit.helpers({
	getBonusLectures: function () {
		return Cardsets.find({'transcript.bonus': true}, {
			sort: {name: 1},
			fields: {name: 1}
		});
	},
	isPrivateTranscript: function () {
		return Session.get('isPrivateTranscript');
	},
	gotValidSelection: function () {
		if (Session.get('isPrivateTranscript')) {
			return true;
		} else {
			return Session.get('activeBonusLecture') !== undefined;
		}
	}
});

Template.selectLearningUnit.events({
	'click .bonusLecture': function (evt) {
		Session.set('activeBonusLecture', Cardsets.findOne({_id: $(evt.currentTarget).attr("data")}));
		$('#setLearningIndexLabel').css('color', '');
		$('.setLearningIndexDropdown').css('border-color', '');
		$('#helpLearningIndexType').html('');
	},
	'click #learningUnitCancel': function () {
		$('#showSelectLearningUnitModal').modal('hide');
	},
	'click #privateTranscript': function () {
		Session.set('isPrivateTranscript', true);
	},
	'click #referencesLecture': function () {
		Session.set('isPrivateTranscript', false);
	}
});
