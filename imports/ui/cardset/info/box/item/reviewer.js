//------------------------ IMPORTS
import {Template} from "meteor/templating";
import {Ratings} from "../../../../../api/ratings";
import "./reviewer.html";

/*
* ############################################################################
* cardsetInfoBoxItemReviewer
* ############################################################################
*/

Template.cardsetInfoBoxItemReviewer.helpers({
	getReviewer: function () {
		var reviewer = Meteor.users.findOne(this.reviewer);
		return (reviewer !== undefined) ? reviewer.profile.name : undefined;
	}
});

Template.cardsetInfoBoxItemReviewer.events({
	'click #rating': function () {
		var cardset_id = Template.parentData(1)._id;
		var rating = $('#rating').data('userrating');
		var count = Ratings.find({
			cardset_id: cardset_id,
			user: Meteor.userId()
		}).count();
		if (count === 0) {
			Meteor.call("addRating", cardset_id, rating);
		} else {
			Meteor.call("updateRating", cardset_id, rating);
		}
	}
});
