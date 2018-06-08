import {Session} from "meteor/session";
import "./headerItemCopy.html";

/*
 * ############################################################################
 * cardHeaderItemCopy
 * ############################################################################
 */

Template.cardHeaderItemCopy.events({
	"click #copyCard": function (evt) {
		Session.set('activeCard', $(evt.target).data('id'));
		$('#copyCard').children().addClass("pressed");
	}
});
