import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/cardsets";
import "./cardList.html";

Template.cardsetNavigationCardList.helpers({
	gotMultipleCards: function () {
		return Cardsets.findOne({_id: Router.current().params._id}).quantity > 1;
	}
});
