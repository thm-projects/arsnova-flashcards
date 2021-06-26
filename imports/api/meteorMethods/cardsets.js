import {Meteor} from "meteor/meteor";
import {Cards} from "../subscriptions/cards.js";
import {TranscriptBonus} from "../subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../util/transcriptBonus.js";
import {LeitnerUserCardStats} from "../subscriptions/leitner/leitnerUserCardStats";
import {LeitnerLearningWorkload} from "../subscriptions/leitner/leitnerLearningWorkload";
import {Wozniak} from "../subscriptions/wozniak";
import {Notifications} from "../subscriptions/notifications";
import {Ratings} from "../subscriptions/ratings";
import {check} from "meteor/check";
import {CardType} from "../../util/cardTypes";
import {UserPermissions} from "../../util/permissions";
import {ServerStyle} from "../../util/styles";
import {Utilities} from "../../util/utilities";
import {Cardsets} from "../subscriptions/cardsets.js";
import {LeitnerLearningPhase} from "../subscriptions/leitner/leitnerLearningPhase";
import {LeitnerActivationDay} from "../subscriptions/leitner/leitnerActivationDay";
import {LeitnerPerformanceHistory} from "../subscriptions/leitner/leitnerPerformanceHistory";

Meteor.methods({
	getSearchCategoriesResult: function (searchValue, filterType) {
		if ((this.userId || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin() && searchValue !== undefined && searchValue !== null && searchValue.length > 2) {
			let query = {};
			query.name = {$regex: searchValue, $options: "i"};
			switch (filterType) {
				case 0:
					if (UserPermissions.isAdmin()) {
						query.kind = {$nin: ['demo', 'server']};
					} else {
						if (this.userId) {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
							}
						} else {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
							}
						}
					}
					if (!ServerStyle.gotSimplifiedNav()) {
						query.shuffled = false;
					}
					break;
				case 1:
					if (this.userId) {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
						}
					} else {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
						}
					}
					if (!ServerStyle.gotSimplifiedNav()) {
						query.shuffled = false;
					}
					break;
				case 2:
					if (this.userId) {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
						}
					} else {
						if (ServerStyle.isLoginEnabled("pro")) {
							query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
						} else {
							query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
						}
					}
					query.shuffled = true;
					break;
				case 3:
					query.owner = Meteor.userId();
					if (!ServerStyle.gotSimplifiedNav()) {
						query.shuffled = false;
					}
					break;
				case 4:
					if (UserPermissions.isAdmin()) {
						query.kind = {$nin: ['demo', 'server']};
					} else {
						if (this.userId) {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'server', 'personal']};
							}
						} else {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.kind = {$nin: ['demo', 'edu', 'server', 'personal']};
							} else {
								query.kind = {$nin: ['demo', 'pro', 'edu', 'server', 'personal']};
							}
						}
					}
					query.shuffled = true;
					break;
				case 5:
					query.owner = Meteor.userId();
					query.shuffled = true;
					break;
				case 6:
					if (UserPermissions.isAdmin()) {
						query.kind = {$nin: ['demo', 'server']};
					} else {
						if (this.userId) {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.$or = [{kind: {$nin: ['demo', 'server', 'personal']}}, {owner: Meteor.userId()}];
							} else {
								query.$or = [{kind: {$nin: ['demo', 'pro', 'server', 'personal']}}, {owner: Meteor.userId()}];
							}
						} else {
							if (ServerStyle.isLoginEnabled("pro")) {
								query.$or = [{kind: {$nin: ['demo', 'edu', 'server', 'personal']}}, {owner: Meteor.userId()}];
							} else {
								query.$or = [{kind: {$nin: ['demo', 'pro', 'edu', 'server', 'personal']}}, {owner: Meteor.userId()}];
							}
						}
					}
					query.shuffled = false;
					break;
			}
			let results = Cardsets.find(query, {fields: {_id: 1}}).fetch();
			let filter = [];
			if (results !== undefined) {
				for (let i = 0; i < results.length; i++) {
					filter.push(results[i]._id);
				}
				return Cardsets.find({_id: {$in: filter}}, {
					fields: {
						_id: 1,
						name: 1,
						owner: 1,
						description: 1,
						kind: 1,
						shuffled: 1,
						quantity: 1,
						cardType: 1,
						difficulty: 1,
						learningActive: 1,
						transcriptBonus: 1,
						wordcloud: 1,
						lecturerAuthorized: 1
					}
				}).fetch();
			}
		} else {
			return [];
		}
	},
	/**
	 * Adds a cardset to the personal deck of cards.
	 * @param {String} name - Title of the cardset
	 * @param {String} description - Description for the content of the cardset
	 * @param {Boolean} visible - Visibility of the cardset
	 * @param {Boolean} ratings - Rating of the cardset
	 * @param {String} kind - Type of cards
	 * @param {Boolean} shuffled - Is the cardset made out of shuffled cards
	 * @param {String} cardGroups - The group names of the shuffled cards
	 * @param {Number} cardType - The type that this cardset allows
	 * @param {Number} difficulty - The difficulty level of the cardset
	 * @param {Number} sortType - Sort the topic content by card content or date created, 0 = content, 1 = date created
	 * @param {Object} fragJetzt - Information of frag.jetzt sessions
	 * @param {Object} arsnovaClick - Information of arsnova.click sessions
	 */
	addCardset: function (name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType, fragJetzt, arsnovaClick) {
		check(name, String);
		check(description, String);
		check(visible, Boolean);
		check(ratings, Boolean);
		check(kind, String);
		check(shuffled, Boolean);
		check(cardType, Number);
		check(difficulty, Number);
		check(sortType, Number);
		check(fragJetzt, Object);
		check(fragJetzt.session, String);
		check(fragJetzt.overrideOnlyEmptySessions, Boolean);
		check(arsnovaClick, Object);
		check(arsnovaClick.session, String);
		check(arsnovaClick.overrideOnlyEmptySessions, Boolean);
		let quantity;
		let gotWorkload;
		if (shuffled) {
			if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'lecturer', 'university', 'pro'])) {
				throw new Meteor.Error("not-authorized");
			}
			check(cardGroups, [String]);
			quantity = Cards.find({cardset_id: {$in: cardGroups}}).count();
			gotWorkload = false;
		} else {
			quantity = 0;
			cardGroups = [];
			gotWorkload = CardType.getCardTypesWithLearningModes().includes(cardType);
		}
		// Make sure the user is logged in before inserting a cardset
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		if (cardType < 0) {
			cardType = 0;
		}
		if (CardType.gotTranscriptBonus(cardType)) {
			if (UserPermissions.isLecturer() || UserPermissions.isAdmin()) {
				kind = "edu";
				visible = true;
			} else {
				throw new Meteor.Error("not-authorized");
			}
		}
		let cardset = Cardsets.insert({
			name: name.trim(),
			description: description,
			date: new Date(),
			dateUpdated: new Date(),
			editors: [],
			owner: Meteor.userId(),
			visible: visible,
			ratings: ratings,
			kind: kind,
			price: 0,
			reviewed: false,
			reviewer: 'undefined',
			request: false,
			rating: 0,
			raterCount: 0,
			quantity: quantity,
			license: [],
			userDeleted: false,
			learningActive: false,
			maxCards: 0,
			daysBeforeReset: 0,
			learningStart: 0,
			learningEnd: 0,
			registrationPeriod: 0,
			learningInterval: [],
			mailNotification: true,
			webNotification: true,
			wordcloud: false,
			shuffled: shuffled,
			cardGroups: cardGroups,
			cardType: cardType,
			difficulty: difficulty,
			noDifficulty: !CardType.gotDifficultyLevel(cardType),
			sortType: sortType,
			gotWorkload: gotWorkload,
			lastEditor: Meteor.userId(),
			useCase: {
				enabled: false,
				priority: 0
			},
			fragJetzt: fragJetzt,
			arsnovaClick: arsnovaClick
		}, {trimStrings: false});
		Meteor.call('updateCardsetCount', Meteor.userId());
		return cardset;
	},
	/**
	 * Delete selected Cardset from database if user is auhorized.
	 * @param {String} id - Database id of the cardset to be deleted
	 */
	deleteCardset: function (id) {
		check(id, String);
		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.remove(id);
			Cards.remove({
				cardset_id: id
			});
			Meteor.call('updateShuffledCardsetQuantity', id);
			Wozniak.remove({
				cardset_id: id
			});
			Notifications.remove({
				link_id: id
			});
			Ratings.remove({
				cardset_id: id
			});
			LeitnerLearningPhase.remove({
				cardset_id: id
			});
			LeitnerLearningWorkload.remove({
				cardset_id: id
			});
			LeitnerUserCardStats.remove({
				cardset_id: id
			});
			LeitnerActivationDay.remove({
				cardset_id: id
			});
			LeitnerPerformanceHistory.remove({
				cardset_id: id
			});
			TranscriptBonus.remove({
				cardset_id: id
			});
			if (CardType.getCardTypesWithLearningModes().findIndex(elem => elem === cardset.cardType) >= 0) {
				Cardsets.find({
					learningActive: true,
					cardGroups: cardset._id
				}).forEach(cardsetElem => Meteor.call("updateCurrentBonusPoints", cardsetElem._id));
			}
			Meteor.call('updateCardsetCount', Meteor.userId());
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	deleteCards: function (id) {
		check(id, String);
		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cards.remove({
				cardset_id: id
			});
			if (CardType.gotTranscriptBonus(cardset.cardType)) {
				Cardsets.update({
						_id: id
					},
					{
						$set: {
							quantity: 0
						}
					}
				);
			} else {
				Cardsets.update({
						_id: id
					},
					{
						$set: {
							quantity: 0,
							kind: 'personal',
							reviewed: false,
							request: false,
							visible: false,
							dateUpdated: new Date(),
							lastEditor: Meteor.userId()
						}
					}
				);
			}

			Meteor.call('updateShuffledCardsetQuantity', cardset._id);
			LeitnerUserCardStats.remove({
				cardset_id: id
			});
			Wozniak.remove({
				cardset_id: id
			});
			if (CardType.getCardTypesWithLearningModes().findIndex(elem => elem === cardset.cardType) >= 0) {
				Meteor.call("updateCurrentBonusPoints", cardset._id);
				Cardsets.find({
					learningActive: true,
					cardGroups: cardset._id
				}).forEach(cardsetElem => Meteor.call("updateCurrentBonusPoints", cardsetElem._id));
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the settings of a transcript bonus for the selected cardset.
	 * @param {String} id - ID of the cardset for which the transcript bonus is to be activated.
	 * @param {Number} isEnabled - Is the transcript bonus enabled?
	 * @param {Number} percentage - Percentage for maximum achievable bonus points
	 * @param {String} lectureEnd - Time at which the lectures end
	 * @param {Number} deadlineSubmission - Amount of hours that the student got time to submit their transcript
	 * @param {Number} deadlineEditing - Amount of hours that the student got time to edit their transcript
	 * @param {Object} newLectures - Dates at which the individual lectures take place
	 * @param {Number} minimumSubmissions - The minimum amount of submissions that are required to reach max points
	 * @param {Number} minimumStars - The minimum amount of stars that are required to reach max points
	 */
	updateCardsetTranscriptBonus: function (id, isEnabled, percentage, lectureEnd, deadlineSubmission, deadlineEditing, newLectures, minimumSubmissions, minimumStars) {
		check(id, String);
		check(isEnabled, Boolean);
		check(percentage, Number);
		check(lectureEnd, String);
		check(deadlineSubmission, Number);
		check(deadlineEditing, Number);
		check(newLectures, [Object]);
		check(minimumSubmissions, Number);
		check(minimumStars, Number);
		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			Cardsets.update(id, {
				$set: {
					'transcriptBonus.enabled': isEnabled,
					'transcriptBonus.percentage': percentage,
					'transcriptBonus.lectureEnd': lectureEnd,
					'transcriptBonus.lectures': newLectures,
					'transcriptBonus.deadline': deadlineSubmission,
					'transcriptBonus.deadlineEditing': deadlineEditing,
					'transcriptBonus.minimumSubmissions': minimumSubmissions,
					'transcriptBonus.minimumStars': minimumStars,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			TranscriptBonus.update({"cardset_id": id}, {
				$set: {
					"deadline": deadlineSubmission,
					"deadlineEditing": deadlineEditing
				}
			}, {multi: true});
			return cardset._id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the settings of a transcript bonus for the selected cardset.
	 * @param {String} id - ID of the cardset for which the transcript bonus is to be activated.
	 * @param {Object} newLectures - Dates at which the individual lectures take place
	 */
	updateCardsetTranscriptBonusLectures: function (id, newLectures) {
		check(id, String);
		check(newLectures, [Object]);
		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner))) {
			for (let i = 0; i < newLectures.length; i++) {
				if (newLectures.title !== undefined && newLectures[i].title.length > TranscriptBonusList.getTranscriptLectureNameMaxLength) {
					throw new Meteor.Error("not-authorized");
				}
			}
			Cardsets.update(id, {
				$set: {
					'transcriptBonus.lectures': newLectures,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return cardset._id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the selected cardset if user is authorized.
	 * @param {String} id - ID of the cardset to be updated
	 * @param {String} name - Title of the cardset
	 * @param {String} description - Description for the content of the cardset
	 * @param {Number} cardType - The type that this cardset allows
	 * @param {Number} difficulty - The difficulty level of the cardset
	 * @param {Number} sortType - Sort the topic content by card content or date created, 0 = content, 1 = date created
	 * @param {Object} fragJetzt - Information of frag.jetzt sessions
	 * @param {Object} arsnovaClick - Information of arsnova.click sessions
	 */
	updateCardset: function (id, name, description, cardType, difficulty, sortType, fragJetzt, arsnovaClick) {
		check(id, String);
		check(name, String);
		check(description, String);
		check(cardType, Number);
		check(difficulty, Number);
		check(sortType, Number);
		check(fragJetzt, Object);
		check(fragJetzt.session, String);
		check(fragJetzt.overrideOnlyEmptySessions, Boolean);
		check(arsnovaClick, Object);
		check(arsnovaClick.session, String);
		check(arsnovaClick.overrideOnlyEmptySessions, Boolean);
		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			if (cardset.learningActive) {
				cardType = cardset.cardType;
			}
			let kind = cardset.kind;
			let visible = cardset.visible;
			if (CardType.gotTranscriptBonus(cardType)) {
				if (UserPermissions.isLecturer() || UserPermissions.isAdmin()) {
					kind = "edu";
					visible = true;
				} else {
					throw new Meteor.Error("not-authorized");
				}
			}
			let gotWorkload;
			if (cardset.shuffled) {
				gotWorkload = cardset.gotWorkload;
			} else {
				gotWorkload = CardType.getCardTypesWithLearningModes().includes(cardType);
			}
			Cardsets.update(id, {
				$set: {
					name: name.trim(),
					description: description,
					dateUpdated: new Date(),
					cardType: cardType,
					difficulty: difficulty,
					kind: kind,
					visible: visible,
					noDifficulty: !CardType.gotDifficultyLevel(cardType),
					sortType: sortType,
					gotWorkload: gotWorkload,
					lastEditor: Meteor.userId(),
					fragJetzt: fragJetzt,
					arsnovaClick: arsnovaClick
				}
			}, {trimStrings: false});
			Cards.update({cardset_id: id}, {
				$set: {
					cardType: cardType
				}
			}, {trimStrings: false});
			Meteor.call('updateShuffledCardsetQuantity', cardset._id);
			if (CardType.getCardTypesWithLearningModes().findIndex(elem => elem === cardType) > -1) {
				Meteor.call("updateCurrentBonusPoints", cardset._id);
				Cardsets.find({
					learningActive: true,
					cardGroups: cardset._id
				}).forEach(cardsetElem => Meteor.call("updateCurrentBonusPoints", cardsetElem._id));
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Update the cardGroups of the shuffled cardset
	 * @param {String} id - Database id of the cardset to receive the updated cardGroups
	 * @param {String} cardGroups - The cardset references
	 * @param {String} removedCardsets - The previous cardset references that got removed
	 */
	updateShuffleGroups: function (id, cardGroups, removedCardsets) {
		check(id, String);
		check(cardGroups, [String]);
		check(removedCardsets, [String]);
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			let quantity = Cards.find({cardset_id: {$in: cardGroups}}).count();
			let kind = cardset.kind;
			let visible = cardset.visible;
			if (cardGroups.length === 0) {
				kind = "personal";
				visible = false;
			}
			Cardsets.update({
				_id: cardset._id
			}, {
				$set: {
					visible: visible,
					kind: kind,
					quantity: quantity,
					cardGroups: cardGroups,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			let removedCards = Cards.find({cardset_id: {$in: removedCardsets}}).fetch();
			for (let i = 0; i < removedCards.length; i++) {
				LeitnerUserCardStats.remove({
					cardset_id: cardset._id,
					card_id: removedCards[i]._id
				});
				LeitnerPerformanceHistory.remove({
					cardset_id: cardset._id,
					card_id: removedCards[i]._id
				});
				Wozniak.remove({
					cardset_id: cardset._id,
					card_id: removedCards[i]._id
				});
			}
			Meteor.call("updateLeitnerCardIndex", cardset._id);
			Meteor.call("updateCurrentBonusPoints", cardset._id);
			return true;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	updateShuffledCardsetQuantity: function (cardset_id) {
		check(cardset_id, String);
		if (Meteor.isServer) {
			let cardsets = Cardsets.find({shuffled: true, cardGroups: {$in: [cardset_id]}}, {
				fields: {
					_id: 1,
					quantity: 1,
					cardGroups: 1,
					dateUpdated: 1
				}
			}).fetch();
			let totalQuantity;
			let cardGroupsCardset;
			for (let i = 0; i < cardsets.length; i++) {
				totalQuantity = 0;
				for (let k = 0; k < cardsets[i].cardGroups.length; k++) {
					cardGroupsCardset = Cardsets.find(cardsets[i].cardGroups[k]).fetch();
					if (cardGroupsCardset.length > 0) {
						if (!CardType.gotTranscriptBonus(cardGroupsCardset[0].cardType)) {
							totalQuantity += cardGroupsCardset[0].quantity;
						}
					}
				}
				let gotWorkload = false;
				if (Utilities.checkIfRepGotWorkloadCardset(cardsets[i])) {
					gotWorkload = true;
				}
				Cardsets.update(cardsets[i]._id, {
					$set: {
						quantity: totalQuantity,
						dateUpdated: new Date(),
						gotWorkload: gotWorkload
					}
				});
			}
		}
	},
	publishCardset: function (id, kind, price, visible) {
		check(id, String);
		check(kind, String);
		check(visible, Boolean);

		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(id, {
				$set: {
					kind: kind,
					price: price.toString().replace(",", "."),
					visible: visible,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			if (kind !== "personal") {
				Meteor.users.update(Meteor.user()._id, {
					$set: {
						visible: true
					}
				});
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
		return true;
	},
	makeProRequest: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne(cardset_id);
		if (UserPermissions.isOwner(cardset.owner) || UserPermissions.gotBackendAccess()) {
			Cardsets.update(cardset._id, {
				$set: {
					reviewed: false,
					request: true,
					visible: false,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	acceptProRequest: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne(cardset_id);
		if (UserPermissions.isLecturer()) {
			Cardsets.update(cardset._id, {
				$set: {
					reviewed: true,
					reviewer: this.userId,
					request: false,
					visible: true,
					dateUpdated: new Date()
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	declineProRequest: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne(cardset_id);
		if (UserPermissions.isLecturer()) {
			Cardsets.update(cardset._id, {
				$set: {
					reviewed: false,
					reviewer: this.userId,
					request: false,
					visible: false
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	updateLicense: function (id, license) {
		check(id, String);
		check(license, [String]);

		let cardset = Cardsets.findOne(id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(cardset._id, {
				$set: {
					license: license,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Changes the owner of the selected cardset. Only the super admin got access to this feature.
	 * @param {String} id - ID of the cardset to be updated
	 * @param {String} owner - The new owner for the cardset
	 */
	changeOwner: function (id, owner) {
		check(id, String);
		check(owner, String);
		if (UserPermissions.gotBackendAccess()) {
			if (Cardsets.findOne(id) && Meteor.users.findOne(owner)) {
				let cardset = Cardsets.findOne({_id: id});
				if (cardset.editors.includes(owner)) {
					Cardsets.update(
						{_id: id},
						{
							$pull: {editors: owner}
						});
					Cardsets.update(
						{_id: id},
						{
							$push: {editors: cardset.owner}
						});
				}
				Cardsets.update(id, {
					$set: {
						owner: owner,
						dateUpdated: new Date(),
						lastEditor: Meteor.userId()
					}
				});
				Cards.update({cardset_id: id}, {
					$set: {
						owner: owner,
						dateUpdated: new Date(),
						lastEditor: Meteor.userId()
					}
				});
				return true;
			} else {
				return false;
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Whitelist the cardset for the wordcloud
	 * @param {String} id - ID of the cardset to be updated
	 * @param {Boolean} status - Wordcloud status for the cardset: true = Add to wordcloud, false = remove from Wordcloud
	 */
	updateWordcloudStatus: function (id, status) {
		check(id, String);
		check(status, Boolean);
		if (UserPermissions.gotBackendAccess()) {
			Cardsets.update(id, {
				$set: {
					wordcloud: status,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Whitelist the cardset for the wordcloud
	 * @param {String} id - ID of the cardset to be updated
	 * @param {Boolean} status - Lecturer authorized status for the cardset: true = authorized, false = not authorized
	 */
	updateLecturerAuthorizedStatus: function (id, status) {
		check(id, String);
		check(status, Boolean);
		if (UserPermissions.gotBackendAccess()) {
			Cardsets.update(id, {
				$set: {
					lecturerAuthorized: status,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	getTempCardsetData: function (cardset_id, type) {
		check(cardset_id, String);
		check(type, String);

		let options = {};
		options.fields = {
			description: 0,
			date: 0,
			dateUpdated: 0,
			editors: 0,
			visible: 0,
			ratings: 0,
			price: 0,
			reviewed: 0,
			reviewer: 0,
			request: 0,
			raterCount: 0,
			userDeleted: 0,
			originalAuthorName: 0,
			rating: 0,
			lastEditor: 0
		};
		if (type === 'cardset') {
			if ((Meteor.userId() || ServerStyle.isLoginEnabled("guest")) && UserPermissions.isNotBlockedOrFirstLogin()) {
				let cardset = Cardsets.findOne({_id: cardset_id}, options);
				if (cardset.kind === "personal") {
					if (!UserPermissions.isOwner(cardset.owner) && !UserPermissions.isAdmin()) {
						return [];
					}
				}
				if (!Meteor.userId() && cardset.kind === "edu") {
					return [];
				}
				return Cardsets.find({
					$or: [
						{_id: cardset._id},
						{_id: {$in: cardset.cardGroups}}
					]
				}, options).fetch();
			} else {
				return [];
			}
		} else {
			let query = {};
			if (!UserPermissions.gotBackendAccess() && type !== 'admin') {
				query.user_id = Meteor.userId();
			} else if (type === 'user') {
				query.user_id = Meteor.userId();
			}
			let cardsetIDFilter = _.uniq(LeitnerUserCardStats.find(query, {
				fields: {cardset_id: 1}
			}).fetch().map(function (x) {
				return x.cardset_id;
			}), true);
			if (UserPermissions.gotBackendAccess() && type === 'admin') {
				return Cardsets.find({_id: {$in: cardsetIDFilter}}, options).fetch();
			} else {
				let shuffledCardsets = Cardsets.find({_id: {$in: cardsetIDFilter}, shuffled: true}, options).fetch();
				for (let i = 0; i < shuffledCardsets.length; i++) {
					cardsetIDFilter = cardsetIDFilter.concat(shuffledCardsets[i].cardGroups);
				}
				return Cardsets.find({_id: {$in: cardsetIDFilter}}, options).fetch();
			}
		}
	}
});
