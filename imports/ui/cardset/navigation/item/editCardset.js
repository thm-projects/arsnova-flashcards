//------------------------ IMPORTS
import "./editCardset.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Template.cardsetNavigationEditCardset.events({
	"click #editCardset": function () {
		if (this.shuffled) {
			Session.set('useRepForm', true);
		} else {
			Session.set('useRepForm', false);
		}
		$('#setCardsetFormModal').modal('show');
	}
});
