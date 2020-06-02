import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./cardList.html";

Template.cardsetNavigationCardList.helpers({
	gotMultipleCards: function () {
		return Cardsets.findOne({_id: FlowRouter.getParam('_id')}).quantity > 1;
	}
});
