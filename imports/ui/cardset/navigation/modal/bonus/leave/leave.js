import "./leave.html";
import "./content/content.js";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {Route} from "../../../../../../util/route";

/*
* ############################################################################
* leaveBonusForm
* ############################################################################
*/

Template.leaveBonusForm.events({
	"click #leaveBonusConfirm": function () {
		let cardset_id = Session.get('cardsetId');
		if (Route.isCardset()) {
			cardset_id = Session.get('activeCardset')._id;
		}
		Meteor.call("leaveBonus", cardset_id);
		$('#leaveBonusModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});
