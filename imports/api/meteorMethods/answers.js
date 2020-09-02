import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Leitner} from "../subscriptions/leitner";
import {Cards} from "../subscriptions/cards";
import {AnswerUtilities} from "../../util/answers";
import {LeitnerTasks} from "../subscriptions/leitnerTasks";
import {LeitnerHistory} from "../subscriptions/leitnerHistory";

Meteor.methods({
	getCardAnswerContent: function (cardIds, cardsetId, disableAnswers) {
		check(cardIds, [String]);
		check(cardsetId, String);
		check(disableAnswers, Boolean);

		return AnswerUtilities.getAnswerContent(cardIds, cardsetId, disableAnswers);
	},
	nextMCCard: function (activeCardId, cardsetId, timestamps) {
		let leitner = Leitner.findOne({
			card_id: activeCardId,
			user_id: Meteor.userId(),
			cardset_id: cardsetId,
			submitted: true,
			active: true
		});

		let task = LeitnerTasks.findOne(
			{cardset_id: cardsetId, user_id: Meteor.userId()}, {fields: {_id: 1}, sort: {session: -1, createdAt: -1}});

		if (leitner !== undefined && task !== undefined) {
			Leitner.update({
				card_id: activeCardId,
				user_id: Meteor.userId(),
				cardset_id: cardsetId,
				submitted: true
			}, {$set: {
					active: false
				}});

			LeitnerHistory.update({
				card_id: activeCardId,
				user_id: Meteor.userId(),
				cardset_id: cardsetId,
				task_id: task._id
			}, {$set: {
					timestamps: timestamps
				}});
		}
	},
	setMCAnswers: function (cardIds, activeCardId, cardsetId, userAnswers, timestamps) {
		check(cardIds, [String]);
		check(activeCardId, String);
		check(cardsetId, String);
		check(userAnswers, [Number]);

		let activeLeitner = Leitner.findOne({
			card_id: activeCardId,
			user_id: Meteor.userId(),
			cardset_id: cardsetId});

		if (activeLeitner !== undefined && activeLeitner.submitted !== true) {
			let task = LeitnerTasks.findOne(
				{cardset_id: cardsetId, user_id: Meteor.userId()}, {fields: {_id: 1}, sort: {session: -1, createdAt: -1}});

			let card = Cards.findOne({_id: activeCardId});
			if (task !== undefined && card !== undefined) {
				Leitner.update({
					card_id: activeCardId,
					user_id: Meteor.userId(),
					cardset_id: cardsetId
				}, {$set: {
						submitted: true
					}});
				userAnswers = userAnswers.sort();
				// answer - 0 = known, 1 = not known
				let answer = 0;
				if (_.difference(userAnswers, card.answers.rightAnswers).length > 0 || userAnswers.length !== card.answers.rightAnswers.length) {
					answer = 1;
				}
				LeitnerHistory.update({
					card_id: activeCardId,
					user_id: Meteor.userId(),
					cardset_id: cardsetId,
					task_id: task._id
				}, {$set: {
						timestamps: timestamps,
						answer: answer,
						"mcAnswers.user": userAnswers,
						"mcAnswers.card": card.answers.rightAnswers
					}});
				return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
			} else {
				throw new Meteor.Error("Leitner Task not found");
			}
		} else {
			return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
		}
	}
});
