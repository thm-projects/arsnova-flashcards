import {Template} from "meteor/templating";
import {Cardsets} from "../../../api/cardsets";
import {Meteor} from "meteor/meteor";
import "./copyCard.html";

/*
 * ############################################################################
 * copyCard
 * ############################################################################
 */

Template.copyCard.helpers({
	cardsetList: function () {
		return Cardsets.find({
			owner: Meteor.userId(),
			shuffled: false,
			_id: {$nin: [Router.current().params._id]}
		}, {
			fields: {name: 1},
			sort: {name: 1}
		});
	}
});
