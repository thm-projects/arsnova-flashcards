import "./wordcloudButton.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";

Template.filterIndexItemBottomWordcloudButton.events({
	'click .filterItemShowWordcloudModal': function (event) {
		console.log($(event.currentTarget).data('id'));
		Session.set("wordcloudItem", $(event.currentTarget).data('id'));
		$('#wordcloudModal').modal('show');
	}
});
