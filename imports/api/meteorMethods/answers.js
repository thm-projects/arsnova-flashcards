import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {Leitner} from "../subscriptions/leitner";
import {Cards} from "../subscriptions/cards";
import {Cardsets} from "../subscriptions/cardsets";
import {AnswerUtilities} from "../../util/answers";
import {LeitnerTasks} from "../subscriptions/leitnerTasks";
import {LeitnerHistory} from "../subscriptions/leitnerHistory";
import {Workload} from "../subscriptions/workload";
import {LeitnerUtilities} from "../../util/leitner";
import {LearningStatisticsUtilities} from "../../util/learningStatistics";

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
			{cardset_id: cardsetId, user_id: Meteor.userId()}, {sort: {session: -1, createdAt: -1}});

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
			LearningStatisticsUtilities.setGlobalStatistics(task);
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
			cardset_id: cardsetId
		});

		if (activeLeitner !== undefined && activeLeitner.submitted !== true) {
			let task = LeitnerTasks.findOne(
				{cardset_id: cardsetId, user_id: Meteor.userId()}, {fields: {_id: 1}, sort: {session: -1, createdAt: -1}});

			let card = Cards.findOne({_id: activeCardId});
			let cardset = Cardsets.findOne({_id: activeLeitner.cardset_id});
			if (task !== undefined && card !== undefined && cardset !== undefined) {
				userAnswers = userAnswers.sort();

				let isAnswerWrong = false;
				if (_.difference(userAnswers, card.answers.rightAnswers).length > 0 || userAnswers.length !== card.answers.rightAnswers.length) {
					isAnswerWrong = true;
				}


				let result = LeitnerUtilities.setNextBoxData(isAnswerWrong, activeLeitner, cardset);

				Leitner.update({
					_id: activeLeitner._id
				}, {$set: {
						box: result.box,
						nextDate: result.nextDate,
						currentDate: new Date(),
						priority: result.priority,
						submitted: true
					}});
				LeitnerHistory.update({
					card_id: activeCardId,
					user_id: Meteor.userId(),
					cardset_id: cardsetId,
					task_id: task._id
				}, {$set: {
						timestamps: timestamps,
						answer: isAnswerWrong ? 1 : 0,
						"mcAnswers.user": userAnswers,
						"mcAnswers.card": card.answers.rightAnswers
					}});

				Workload.update({cardset_id: activeLeitner.cardset_id, user_id: activeLeitner.user_id}, {
					$set: {
						"leitner.nextLowestPriority": result.lowestPriorityList
					}
				});
				return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
			} else {
				throw new Meteor.Error("Leitner Task not found");
			}
		} else {
			return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
		}
	},
	/** Function marks an active leitner card as learned
	 *  @param {string} cardset_id - The cardset id from the card
	 *  @param {string} card_id - The id from the card
	 *  @param {boolean} isAnswerWrong - false = known, true = not known
	 *  @param {Object} timestamps - Timestamps for viewing the question and viewing the answer
	 * */
	setSimpleAnswer: function (cardset_id, card_id, isAnswerWrong, timestamps) {
		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardset_id, String);
		check(card_id, String);
		check(isAnswerWrong, Boolean);

		let cardset = Cardsets.findOne({_id: cardset_id});

		if (cardset !== undefined) {
			let query = {};

			query.card_id = card_id;
			query.cardset_id = cardset_id;
			query.user_id = Meteor.userId();
			query.active = true;

			let activeLeitner = Leitner.findOne(query);
			if (activeLeitner !== undefined) {
				let result = LeitnerUtilities.setNextBoxData(isAnswerWrong, activeLeitner, cardset);

				Leitner.update(activeLeitner._id, {
					$set: {
						box: result.box,
						active: false,
						nextDate: result.nextDate,
						currentDate: new Date(),
						priority: result.priority
					}
				});

				let leitnerTask = LeitnerTasks.findOne({cardset_id: activeLeitner.cardset_id, user_id: activeLeitner.user_id}, {sort: {session: -1, createdAt: -1}});
				if (leitnerTask !== undefined) {
					delete query.active;
					query.task_id = leitnerTask._id;
					LeitnerHistory.update(query, {
						$set: {
							box: result.box,
							answer: isAnswerWrong ? 1 : 0,
							timestamps: timestamps
						}
					});
					LearningStatisticsUtilities.setGlobalStatistics(leitnerTask);
				}

				Workload.update({cardset_id: activeLeitner.cardset_id, user_id: activeLeitner.user_id}, {
					$set: {
						"leitner.nextLowestPriority": result.lowestPriorityList
					}
				});
			}
			LeitnerUtilities.updateLeitnerWorkload(cardset_id, Meteor.userId());
		}
	}
});
