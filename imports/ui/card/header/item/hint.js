import {Session} from "meteor/session";
import "./hint.html";
import {CardType} from "../../../../api/cardTypes";

/*
 * ############################################################################
 * cardHeaderItemHint
 * ############################################################################
 */

Template.cardHeaderItemHint.helpers({
	gotHint: function () {
		return (CardType.gotHint(this.cardType) && this.hint !== "" && this.hint !== undefined);
	}
});

Template.cardHeaderItemHint.events({
	"click #showHint": function (evt) {
		Session.set('selectedHint', $(evt.target).data('id'));
		$('#showHint').children().addClass("pressed");
	}
});
