//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../../api/subscriptions/cardsets";
import {Ratings} from "../../../../../api/subscriptions/ratings";
import {UserPermissions} from "../../../../../api/permissions";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import "./ratings.html";

/*
* ############################################################################
* cardsetInfoBoxItemRatings
* ############################################################################
*/

Template.cardsetInfoBoxItemRatings.helpers({
	ratingEnabled: function () {
		return this.ratings === true;
	},
	canRateCardset: function () {
		if (Meteor.user()) {
			return !UserPermissions.isOwner(Cardsets.findOne({_id: this._id}).owner);
		} else {
			return false;
		}
	},
	getUserRating: function () {
		var userrating = Ratings.findOne({
			cardset_id: this._id,
			user_id: Meteor.userId()
		});
		if (userrating) {
			return userrating.rating;
		} else {
			return 0 + " " + TAPi18n.__('cardset.info.notRated');
		}
	}
});

Template.cardsetInfoBoxItemRatings.events({
	'click #rating': function () {
		Meteor.call("rateCardset", FlowRouter.getParam('_id'), Number($('#rating').data('userrating')));
	}
});
