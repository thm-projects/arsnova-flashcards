import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {ErrorReporting} from "../subscriptions/errorReporting";
import {Cardsets} from "../subscriptions/cardsets";
import {Cards} from "../subscriptions/cards";

Meteor.methods({
	sendErrorReport: function (user_id, cardset_id, card_id, cardSide, errorTypes, errorContent) {
		check(user_id, String);
		check(cardset_id, String);
		check(card_id, String);
		check(cardSide, Number);
		check(errorTypes, Array);
		check(errorContent, String);

		if (isNaN(cardSide)) {
			cardSide = 0;
		}

		if (Meteor.isServer) {
			ErrorReporting.insert({
				user_id: user_id,
				cardset_id: cardset_id,
				card_id: card_id,
				createdAt: new Date(),
				status: 0,
				cardSide: cardSide,
				error: {
					type: errorTypes,
					content: errorContent
				}
			}
			);
			Meteor.call("updateUnresolvedErrors", cardset_id, card_id);
		}
	},
	updateErrorReport: function (error_id, cardset_id, card_id, cardSide, errorTypes, errorContent) {
		check(error_id, String);
		check(cardset_id, String);
		check(card_id, String);
		check(cardSide, Number);
		check(errorTypes, Array);
		check(errorContent, String);
		if (Meteor.isServer) {
			ErrorReporting.update({_id: error_id},
				{
					$set: {
						updatedAt: new Date(),
						status: 0,
						cardSide: cardSide,
						error: {
							type: errorTypes,
							content: errorContent
						}
					}
				});
			Meteor.call("updateUnresolvedErrors", cardset_id, card_id);
		}
	},
	updateErrorReportStatus: function (error_id, cardset_id, card_id, status) {
		check(error_id, String);
		check(cardset_id, String);
		check(card_id, String);
		check(status, Number);
		if (Meteor.isServer) {
			ErrorReporting.update({_id: error_id},
				{
					$set: {
						updatedAt: new Date(),
						status: status
					}
				});
			Meteor.call("updateUnresolvedErrors", cardset_id, card_id);
		}
	},
	updateUnresolvedErrors: function (cardset_id, card_id, top_cardset) {
		if (Meteor.isServer) {
			const cardset_ids = [cardset_id];
			const cardsets = Cardsets.find({cardGroups: {$all: [cardset_id]}}).fetch();
			for (const set of cardsets) {
				if (set._id !== cardset_id) {
					cardset_ids.push(set._id);
				}
			}
			const countCardsets = (Cardsets.findOne({_id: cardset_id}).cardGroups || []).concat(cardset_ids);
			if (card_id !== "") {
				const realCardset = Cards.findOne({_id: card_id}).cardset_id;
				if (realCardset && realCardset !== cardset_id) {
					cardset_ids.push(realCardset);
				}
			}

			if (top_cardset) {
				cardset_ids.splice(cardset_ids.indexOf(top_cardset), 1);
			}
			const countCardset = ErrorReporting.find({cardset_id: {$in: countCardsets}, status: 0}).count();
			for (const id of cardset_ids) {
				if (id === cardset_id) {
					Cardsets.update({_id: id}, {$set: {unresolvedErrors: countCardset}});
				} else {
					Meteor.call("updateUnresolvedErrors", id, card_id, cardset_id);
				}
			}
			if (card_id !== "") {
				const countCard = ErrorReporting.find({card_id: card_id, status: 0}).count();
				Cards.update({_id: card_id}, {$set: {unresolvedErrors: countCard}});
			}
		}
	},
	getCardErrors: function (card_id) {
		return ErrorReporting.find({card_id: card_id}, {sort: {status: 1}}).fetch();
	},
	getCardErrorsFromUser: function (card_id, user_id) {
		return ErrorReporting.find({card_id: card_id, user_id: user_id, status: 0}).fetch();
	},
	hasErrorReportings: function () {
		if (Meteor.isServer) {
			const reportings = ErrorReporting.find({status: 0});
			for (const reporting of reportings) {
				if (Cards.findOne({_id: reporting.card_id, owner: this.userId}) !== undefined) {
					return true;
				}
			}
		}
		return false;
	},
	getErrorReportingForUser: () => {
		const userReportings = [];
		if (Meteor.isServer) {
			const reportings = ErrorReporting.find({status: 0});
			for (const reporting of reportings) {
				const card = Cards.findOne({_id: reporting.card_id, owner: this.userId});
				if (card !== undefined) {
					reporting.cardName = card.subject;
					userReportings.push(reporting);
				}
			}
		}
		return userReportings;
	},
	getCardCreator: (card_id) => {
		if (Meteor.isServer) {
			const card = Cards.findOne({_id: card_id});
			const user = Meteor.users.findOne({_id: card.owner});
			return user.profile.givenname;
		}
	}
});
