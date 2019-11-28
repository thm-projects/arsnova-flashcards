import "./wordcloud.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

Template.cardsetFormAdminItemWordcloud.helpers({
	isInWordcloud: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').wordcloud;
		}
	}
});

Template.cardsetFormAdminItemWordcloud.events({
	'click #cardsetAddToWordcloude': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateWordcloudStatus', Session.get('activeCardset')._id, true, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	},
	'click #cardsetRemoveFromWordcloude': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateWordcloudStatus', Session.get('activeCardset')._id, false, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	}
});
