import {Meteor} from "meteor/meteor";
import {UserPermissions} from "../permissions";
import {Cardsets} from "./cardsets";
import {TranscriptBonus} from "./transcriptBonus";
import {Workload} from "./workload";
import {ServerStyle} from "../styles";

if (Meteor.isServer) {
	Meteor.publish("userDataLecturers", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Meteor.users.find({roles: {$in: ["lecturer"]}},
				{
					fields: {
						'profile.name': 1,
						'profile.birthname': 1,
						'profile.givenname': 1,
						'profile.title': 1
					}
				});
		} else {
			this.ready();
		}
	});
	Meteor.publish("userDataLandingPage", function () {
		let cardsets = Cardsets.find({wordcloud: true}, {fields: {owner: 1}}).fetch();
		let owners = [];
		for (let i = 0; i < cardsets.length; i++) {
			owners.push(cardsets[i].owner);
		}
		return Meteor.users.find({_id: {$in: owners}},
			{
				fields: {
					'profile.name': 1,
					'profile.birthname': 1,
					'profile.givenname': 1,
					'profile.title': 1
				}
			});
	});
	Meteor.publish("userDataTranscriptBonus", function (cardset_id) {
		if (this.userId) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				let bonusTranscripts = TranscriptBonus.find({cardset_id: cardset._id}).fetch();
				let userFilter = [];
				for (let i = 0; i < bonusTranscripts.length; i++) {
					userFilter.push(bonusTranscripts[i].user_id);
				}
				return Meteor.users.find({_id: {$in: userFilter}},
					{
						fields: {
							'profile.name': 1,
							'profile.birthname': 1,
							'profile.givenname': 1,
							'profile.title': 1
						}
					});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userDataBonus", function (cardset_id, user_id) {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			let workload = Workload.findOne({cardset_id: cardset_id, user_id: user_id}, {fields: {_id: 1, leitner: 1}});
			if (UserPermissions.isAdmin()) {
				return Meteor.users.find({_id: user_id});
			} else if (cardset.owner === this.userId && workload.leitner.bonus) {
				return Meteor.users.find({_id: user_id, visible: true},
					{
						fields: {
							'profile.name': 1,
							'profile.birthname': 1,
							'profile.givenname': 1,
							'profile.title': 1
						}
					});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("userData", function () {
		if ((this.userId || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
			if (UserPermissions.isAdmin()) {
				let hiddenUsers = [this.userId, "NotificationsTestCardset", ".cards"];
				return Meteor.users.find({_id: {$nin: hiddenUsers}});
			} else {
				return Meteor.users.find({_id: {$ne: this.userId}, visible: true},
					{
						fields: {
							'profile.name': 1,
							'profile.birthname': 1,
							'profile.givenname': 1,
							'profile.title': 1
						}
					});
			}
		} else {
			this.ready();
		}
	});
	Meteor.publish("personalUserData", function () {
		if (this.userId) {
			return Meteor.users.find({_id: this.userId});
		} else {
			this.ready();
		}
	});
}

Meteor.users.allow({
	insert: function () {
		return false;
	},
	update: function () {
		return false;
	},
	remove: function () {
		return false;
	}
});

Meteor.users.deny({
	insert: function () {
		return true;
	},
	update: function () {
		return true;
	},
	remove: function () {
		return true;
	}
});
