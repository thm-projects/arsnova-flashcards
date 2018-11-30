//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../../api/cardsets";
import {Ratings} from "../../../../../api/ratings";
import {UserPermissions} from "../../../../../api/permissions";
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
		Meteor.call("rateCardset", Router.current().params._id, Number($('#rating').data('userrating')));
	}
});
