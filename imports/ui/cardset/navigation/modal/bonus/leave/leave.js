import "./leave.html";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";

/*
* ############################################################################
* leaveBonusForm
* ############################################################################
*/

Template.leaveBonusForm.events({
	"click #leaveBonusConfirm": function () {
		Meteor.call("leaveBonus", Session.get('activeCardset')._id);
		$('#leaveBonusModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
	}
});
