//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import "./deleteAllCards.html";

/*
 * ############################################################################
 * deleteCardsForm
 * ############################################################################
 */

Template.deleteCardsForm.events({
	'click #deleteCardsConfirm': function () {
		var id = this._id;
		$('#deleteCardsModal').on('hidden.bs.modal', function () {
			Meteor.call("deleteCards", id);
		}).modal('hide');
	}
});
