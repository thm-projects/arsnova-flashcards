import './license.html';
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../../../api/subscriptions/cardsets";

Template.filterIndexItemBottomLicense.events({
	'click .editCardsetLicense': function (event) {
		Session.set('activeCardset', Cardsets.findOne($(event.target).data('id')));
	}
});

