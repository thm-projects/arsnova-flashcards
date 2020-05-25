import "./join.html";
import "./content/content.js";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";

/*
* ############################################################################
* joinBonusForm
* ############################################################################
*/

Template.joinBonusForm.events({
	"click #joinBonusConfirm": function () {
		Meteor.call("joinBonus", Session.get('activeCardset')._id);
		$('#joinBonusModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});
