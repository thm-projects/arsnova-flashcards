import {Meteor} from "meteor/meteor";
import {UserPermissions} from "../../util/permissions";
import * as config from "../../config/userData.js";
import * as cardsetConfig from "../../config/cardset.js";
import {Cardsets} from "./cardsets";
import {TranscriptBonus} from "./transcriptBonus";
import {ServerStyle} from "../../util/styles";
import {ErrorReporting} from "./errorReporting";

if (Meteor.isServer) {
	Meteor.publish("landingPageUserData", function () {
		if (ServerStyle.gotLandingPageWordcloud()) {
			let userIDFilter = [];

			//Get wordcloud user data
			let query = {wordcloud: true};

			const publicCardsets = Cardsets.find(query, {fields: {shuffled: 1, owner: 1, lastEditor: 1, cardGroups: 1}}).fetch();
			publicCardsets.forEach(function (cardset) {
				userIDFilter.push(cardset.owner);
				if (userIDFilter.lastEditor !== undefined) {
					userIDFilter.push(cardset.lastEditor);
				}
			});
			return Meteor.users.find({_id: {$in: userIDFilter}},
				{
					fields: config.VISIBLE_FIELDS.frontend
				});
		} else {
			this.ready();
		}
	});

	Meteor.publish("frontendUserData", function () {
		if (UserPermissions.gotFrontendAccess()) {
			let userIDFilter = [];

			//Get users of public card sets
			let query = {
				owner: {$nin: config.SERVER_USERS}
			};
			if (!UserPermissions.isAdmin()) {
				query.kind = {$in: cardsetConfig.kindsVisibleToThePublic};
			}

			const publicCardsets = Cardsets.find(query, {fields: {shuffled: 1, owner: 1, lastEditor: 1, cardGroups: 1}}).fetch();
			publicCardsets.forEach(function (cardset) {
				if (cardset.shuffled) {
					const referencedCardsets = Cardsets.find({
						_id: {$in: cardset.cardGroups}
					}, {fields: {owner: 1, lastEditor: 1}});
					referencedCardsets.forEach(function (item) {
						userIDFilter.push(item.owner);
						if (userIDFilter.lastEditor !== undefined) {
							userIDFilter.push(item.lastEditor);
						}
					});
				}
				userIDFilter.push(cardset.owner);
				if (userIDFilter.lastEditor !== undefined) {
					userIDFilter.push(cardset.lastEditor);
				}
			});

			//Get users of error reports
			ErrorReporting.find({}, {fields: {user_id: 1}}).fetch().map(function (errorReport) {
				return userIDFilter.push(errorReport.user_id);
			});

			return Meteor.users.find({_id: {$in: userIDFilter}},
				{
					fields: config.VISIBLE_FIELDS.frontend
				});
		} else {
			this.ready();
		}
	});

	Meteor.publish("transcriptBonusUserData", function (cardset_id) {
		if (Meteor.userId()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1}});
			if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
				let bonusTranscripts = TranscriptBonus.find({cardset_id: cardset._id}).fetch();
				let userFilter = [];
				for (let i = 0; i < bonusTranscripts.length; i++) {
					userFilter.push(bonusTranscripts[i].user_id);
				}
				return Meteor.users.find({_id: {$in: userFilter}},
					{
						fields: config.VISIBLE_FIELDS.frontend
					});
			} else {
				this.ready();
			}
		} else {
			this.ready();
		}
	});

	Meteor.publish("backendUserData", function () {
		if (UserPermissions.gotBackendAccess()) {
			return Meteor.users.find({
					_id: {$nin: config.SERVER_USERS}
				},
				{
					fields: config.VISIBLE_FIELDS.backend
				});
		} else {
			this.ready();
		}
	});
	Meteor.publish("personalUserData", function () {
		if (Meteor.userId()) {
			return Meteor.users.find({_id: Meteor.userId()});
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
