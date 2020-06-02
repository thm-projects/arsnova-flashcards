import {Template} from "meteor/templating";
import {Cardsets} from "../../../api/subscriptions/cardsets";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
			_id: {$nin: [FlowRouter.getParam('_id')]}
		}, {
			fields: {name: 1},
			sort: {name: 1}
		});
	}
});
