//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../../api/cardsets";
import {Ratings} from "../../../../../api/ratings";
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
		let result = Cardsets.findOne({_id: this._id}, {fields: {owner: 1}});
		if (result !== undefined) {
			return result.owner !== Meteor.userId();
		} else {
			return false;
		}
	},
	getAverageRating: function () {
		let ratings = Ratings.find({cardset_id: this._id}).fetch();
		let averageRating = 0;
		for (let i = 0; i < ratings.length; i++) {
			averageRating += ratings[i].rating;
		}
		return averageRating / ratings.length;
	},
	getUserRating: function () {
		var userrating = Ratings.findOne({
			cardset_id: this._id,
			user: Meteor.userId()
		});
		if (userrating) {
			return userrating.rating;
		} else {
			return 0 + " " + TAPi18n.__('cardset.info.notRated');
		}
	}
});
