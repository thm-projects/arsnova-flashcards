import {Meteor} from "meteor/meteor";
import {LeitnerUserCardStats} from "../subscriptions/leitner/leitnerUserCardStats";
import {Cardsets} from "../subscriptions/cardsets.js";
import {check} from "meteor/check";

Meteor.methods({
	getEditors: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne({_id: cardset_id});
		let editorsDataArray = [];
		if (Meteor.userId() === cardset.owner || Roles.userIsInRole(Meteor.userId(), ["admin", "editor"])) {
			let editors = Meteor.users.find({
				_id: {$ne: cardset.owner},
				roles: {$nin: ['admin', 'editor'],$in: ['lecturer']}
			}).fetch();
			for (let i = 0; i < editors.length; i++) {
				editorsDataArray.push({
					givenname: editors[i].profile.givenname,
					birthname: editors[i].profile.birthname,
					roles: editors[i].roles,
					id: editors[i]._id
				});
			}
		}
		return editorsDataArray;
	},
	addEditor: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$push: {editors: user_id}
				});
		}
		LeitnerUserCardStats.remove({
			cardset_id: cardset._id,
			user_id: user_id
		});
		Meteor.call("updateLearnerCount", cardset._id);
	},
	removeEditor: function (cardset_id, user_id) {
		check(cardset_id, String);
		check(user_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$pull: {editors: user_id}
				});
		}
	},
	leaveEditors: function (cardset_id) {
		check(cardset_id, String);
		let cardset = Cardsets.findOne({_id: cardset_id});
		if (cardset.editors.includes(Meteor.userId())) {
			Cardsets.update(
				{_id: cardset._id},
				{
					$pull: {editors: Meteor.userId()}
				});
		}
	},
	getWordcloudUserName: function (owner_id) {
		if (Cardsets.findOne({owner: owner_id, wordcloud: true, visible: true})) {
			return Meteor.users.findOne({_id: owner_id}, {
				fields: {
					"profile.title": 1,
					"profile.givenname": 1,
					"profile.birthname": 1
				}
			});
		}
	}
});
