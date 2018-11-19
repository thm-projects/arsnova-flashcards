import {Cardsets} from "../../../../api/cardsets";
import {Session} from "meteor/session";
import "./learningUnit.html";

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
