import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {LeitnerUserCardStats} from "../subscriptions/leitner/leitnerUserCardStats";
import {Cards} from "../subscriptions/cards";
import {Cardsets} from "../subscriptions/cardsets";
import {AnswerUtilities} from "../../util/answers";
import {LeitnerActivationDay} from "../subscriptions/leitner/leitnerActivationDay";
import {LeitnerPerformanceHistory} from "../subscriptions/leitner/leitnerPerformanceHistory";
import {LeitnerLearningWorkload} from "../subscriptions/leitner/leitnerLearningWorkload";
import {LeitnerUtilities} from "../../util/leitner";
import {LearningStatisticsUtilities} from "../../util/learningStatistics";
import {LeitnerLearningWorkloadUtilities} from "../../util/learningWorkload";
import {LeitnerLearningPhaseUtilities} from "../../util/learningPhase";

Meteor.methods({
	getCardAnswerContent: function (cardIds, cardsetId, disableAnswers) {
		check(cardIds, [String]);
		check(cardsetId, String);
		check(disableAnswers, Boolean);

		return AnswerUtilities.getAnswerContent(cardIds, cardsetId, disableAnswers);
	},
	nextMCCard: function (activeCardId, cardsetId, timestamps) {
		let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardsetId, Meteor.userId());
		if (leitnerLearningWorkload !== undefined) {
			let activeLeitnerCard = LeitnerUserCardStats.findOne({
				learning_phase_id: leitnerLearningWorkload.learning_phase_id,
				workload_id: leitnerLearningWorkload._id,
				card_id: activeCardId,
				user_id: Meteor.userId(),
				cardset_id: cardsetId,
				submittedAnswer: true,
				isActive: true
			});

			let leitnerActivationDay = LeitnerActivationDay.findOne({
				learning_phase_id: leitnerLearningWorkload.learning_phase_id,
				workload_id: leitnerLearningWorkload._id,
				cardset_id: cardsetId,
				user_id: Meteor.userId()
			}, {sort: {createdAt: -1}});

			if (activeLeitnerCard !== undefined && leitnerActivationDay !== undefined) {
				LeitnerUserCardStats.update({
					learning_phase_id: leitnerLearningWorkload.learning_phase_id,
					workload_id: leitnerLearningWorkload._id,
					card_id: activeCardId,
					user_id: Meteor.userId(),
					cardset_id: cardsetId,
					submittedAnswer: true
				}, {$set: {
						isActive: false
					}});

				LeitnerPerformanceHistory.update({
					learning_phase_id: leitnerLearningWorkload.learning_phase_id,
					workload_id: leitnerLearningWorkload._id,
					card_id: activeCardId,
					user_id: Meteor.userId(),
					cardset_id: cardsetId,
					activation_day_id: leitnerActivationDay._id
				}, {$set: {
						timestamps: timestamps
					}});
				LearningStatisticsUtilities.updateAllStats(leitnerActivationDay);
			}
		} else {
			throw new Meteor.Error("Leitner workload not found");
		}
	},
	setMCAnswers: function (cardIds, activeCardId, cardsetId, userAnswers, timestamps) {
		check(cardIds, [String]);
		check(activeCardId, String);
		check(cardsetId, String);
		check(userAnswers, [Number]);

		let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardsetId, Meteor.userId());
		if (leitnerLearningWorkload !== undefined) {
			let leitnerLearningPhase = LeitnerLearningPhaseUtilities.getActiveLearningPhase(undefined, undefined, leitnerLearningWorkload.learning_phase_id);
			if (leitnerLearningPhase !== undefined) {
				let activeLeitnerCard = LeitnerUserCardStats.findOne({
					learning_phase_id: leitnerLearningPhase._id,
					workload_id: leitnerLearningWorkload._id,
					card_id: activeCardId,
					user_id: Meteor.userId(),
					cardset_id: cardsetId,
					submittedAnswer: false
				});

				if (activeLeitnerCard !== undefined) {
					let leitnerActivationDay = LeitnerActivationDay.findOne({
						learning_phase_id: leitnerLearningPhase._id,
						workload_id: leitnerLearningWorkload._id,
						cardset_id: cardsetId,
						user_id: Meteor.userId()
					}, {fields: {_id: 1}, sort: {createdAt: -1}});

					let card = Cards.findOne({_id: activeCardId});
					let cardset = Cardsets.findOne({_id: activeLeitnerCard.cardset_id});
					if (leitnerActivationDay !== undefined && card !== undefined && cardset !== undefined) {
						userAnswers = userAnswers.sort();
						let isAnswerWrong = AnswerUtilities.isAnswerWrong(card.answers.rightAnswers, userAnswers);
						let result = LeitnerUtilities.setNextBoxData(isAnswerWrong, activeLeitnerCard, cardset, leitnerLearningPhase, leitnerLearningWorkload);
						LeitnerUserCardStats.update({
							learning_phase_id: leitnerLearningPhase._id,
							workload_id: leitnerLearningWorkload._id,
							_id: activeLeitnerCard._id
						}, {$set: {
								box: result.box,
								nextPossibleActivationDate: result.nextPossibleActivationDate,
								priority: result.priority,
								submittedAnswer: true
							}});
						LeitnerPerformanceHistory.update({
							learning_phase_id: leitnerLearningPhase._id,
							workload_id: leitnerLearningWorkload._id,
							card_id: activeCardId,
							user_id: Meteor.userId(),
							cardset_id: cardsetId,
							activation_day_id: leitnerActivationDay._id
						}, {$set: {
								timestamps: timestamps,
								answer: isAnswerWrong ? 1 : 0,
								"mcAnswers.user": userAnswers.sort(),
								"mcAnswers.card": card.answers.rightAnswers
							}});

						LeitnerLearningWorkload.update({
							_id: leitnerLearningWorkload._id,
							learning_phase_id: leitnerLearningPhase._id,
							cardset_id: activeLeitnerCard.cardset_id,
							user_id: activeLeitnerCard.user_id}, {
							$set: {
								"nextLowestPriority": result.lowestPriorityList,
								updatedAt: new Date()
							}
						});
						LeitnerUtilities.setEndBonusPoints(cardset, leitnerActivationDay, result);
						return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
					} else {
						throw new Meteor.Error("Leitner activation day not found");
					}
				} else {
					return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
				}
			} else {
				throw new Meteor.Error("Leitner learning phase not found");
			}
		} else {
			throw new Meteor.Error("Leitner workload not found");
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
			let leitnerLearningWorkload = LeitnerLearningWorkloadUtilities.getActiveWorkload(cardset_id, Meteor.userId());
			if (leitnerLearningWorkload !== undefined) {
				let leitnerLearningPhase = LeitnerLearningPhaseUtilities.getActiveLearningPhase(undefined, undefined, leitnerLearningWorkload.learning_phase_id);
				if (leitnerLearningPhase !== undefined) {
					let query = {
						learning_phase_id: leitnerLearningWorkload.learning_phase_id,
						workload_id: leitnerLearningWorkload.workload_id,
						card_id: card_id,
						cardset_id: cardset_id,
						user_id: Meteor.userId(),
						isActive: true,
						submittedAnswer: false
					};

					let activeLeitnerCard = LeitnerUserCardStats.findOne(query);
					if (activeLeitnerCard !== undefined) {
						let result = LeitnerUtilities.setNextBoxData(isAnswerWrong, activeLeitnerCard, cardset, leitnerLearningPhase, leitnerLearningWorkload);

						LeitnerUserCardStats.update(activeLeitnerCard._id, {
							$set: {
								box: result.box,
								isActive: false,
								submittedAnswer: true,
								nextPossibleActivationDate: result.nextPossibleActivationDate,
								activatedSinceDate: new Date(),
								priority: result.priority
							}
						});

						let leitnerActivationDay = LeitnerActivationDay.findOne({
							learning_phase_id: leitnerLearningWorkload.learning_phase_id,
							workload_id: leitnerLearningWorkload.workload_id,
							cardset_id: activeLeitnerCard.cardset_id,
							user_id: activeLeitnerCard.user_id
						}, {sort: {createdAt: -1}});
						if (leitnerActivationDay !== undefined) {
							delete query.isActive;
							delete query.submittedAnswer;
							query.activation_day_id = leitnerActivationDay._id;
							LeitnerPerformanceHistory.update(query, {
								$set: {
									box: result.box,
									answer: isAnswerWrong ? 1 : 0,
									timestamps: timestamps
								}
							});
							LearningStatisticsUtilities.updateAllStats(leitnerActivationDay);
						}

						LeitnerUtilities.setEndBonusPoints(cardset, leitnerActivationDay, result);
						LeitnerLearningWorkload.update({
							learning_phase_id: leitnerLearningWorkload.learning_phase_id,
							workload_id: leitnerLearningWorkload.workload_id,
							cardset_id: activeLeitnerCard.cardset_id,
							user_id: activeLeitnerCard.user_id
						}, {
							$set: {
								"nextLowestPriority": result.lowestPriorityList,
								updatedAt: new Date()
							}
						});
					}
					LeitnerUtilities.updateLeitnerWorkload(cardset_id, Meteor.userId(), leitnerLearningWorkload);
				} else {
					throw new Meteor.Error('Could not find active leitner learning phase');
				}
			} else {
				throw new Meteor.Error('Could not find active leitner learning workload');
			}
		}
	}
});
