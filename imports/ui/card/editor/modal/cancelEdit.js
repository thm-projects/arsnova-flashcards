import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./cancelEdit.html";

/*
 * ############################################################################
 * cancelEditForm
 * ############################################################################
 */

Template.cancelEditForm.events({
	'click #cancelEditConfirm': function () {
		$('#cancelEditModal').on('hidden.bs.modal', function () {
			Session.set('activeCard', Router.current().params.card_id);
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		}).modal('hide');
	}
});