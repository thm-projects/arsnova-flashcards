import "./lecturerAuthorized.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "../../../../api/subscriptions/cardsets";

Template.cardsetFormAdminItemLecturerAuthorized.helpers({
	isLecturerAuthorized: function () {
		if (Session.get('activeCardset') !== undefined) {
			return Session.get('activeCardset').lecturerAuthorized;
		}
	}
});

Template.cardsetFormAdminItemLecturerAuthorized.events({
	'click #cardsetAddLecturerAuthorized': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateLecturerAuthorizedStatus', Session.get('activeCardset')._id, true, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	},
	'click #cardsetRemoveLecturerAuthorized': function () {
		if (Session.get('activeCardset') !== undefined) {
			Meteor.call('updateLecturerAuthorizedStatus', Session.get('activeCardset')._id, false, function (error, result) {
				if (result) {
					Session.set('activeCardset', Cardsets.findOne(result));
				}
			});
		}
	}
});
