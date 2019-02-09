import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cards} from "./cards.js";
import {Leitner, Workload, Wozniak} from "./learned.js";
import {Notifications} from "./notifications.js";
import {Ratings} from "./ratings.js";
import {check} from "meteor/check";
import {CardType} from "./cardTypes";
import {UserPermissions} from "./permissions";

export const Cardsets = new Mongo.Collection("cardsets");

if (Meteor.isServer) {
	Meteor.publish("demoCardsets", function () {
		return Cardsets.find({kind: {$in: ['demo']}});
	});
	Meteor.publish("makingOfCardsets", function () {
		return Cardsets.find({kind: {$in: ['demo']}});
	});
	Meteor.publish("wordcloudCardsets", function () {
		return Cardsets.find({wordcloud: true});
	});
	Meteor.publish("cardset", function (cardset_id) {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, kind: 1, owner: 1, cardGroups: 1}});
			if (cardset.kind === 'personal') {
				if (!UserPermissions.isOwner(cardset.owner) && !UserPermissions.isAdmin()) {
					return 0;
				}
			}
			return Cardsets.find({
				$or: [
					{_id: cardset._id},
					{_id: {$in: cardset.cardGroups}}
				]
			});
		}
	});
	Meteor.publish("allCardsets", function () {
		if (this.userId && UserPermissions.isAdmin()) {
			return Cardsets.find({shuffled: false});
		}
	});
	Meteor.publish("workloadCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			let workload = Workload.find({user_id: this.userId}, {fields: {cardset_id: 1}}).fetch();
			let filter = [];
			for (let i = 0, workloadLength = workload.length; i < workloadLength; i++) {
				if ((Leitner.find({cardset_id: workload[i].cardset_id}).count() !== 0) || (Wozniak.find({cardset_id: workload[i].cardset_id}).count() !== 0)) {
					filter.push(workload[i].cardset_id);
				}
			}
			let cardsets = [];
			let cardset;
			for (let i = 0, filterLength = filter.length; i < filterLength; i++) {
				cardset = Cardsets.findOne({_id: filter[i]}, {
					fields: {
						_id: 1,
						shuffled: 1,
						cardGroups: 1
					}
				});
				if (cardset !== undefined) {
					cardsets.push(filter[i]);
					if (cardset.shuffled) {
						for (let k = 0, cardGroupsLength = cardset.cardGroups.length; k < cardGroupsLength; k++) {
							cardsets.push(cardset.cardGroups[k]);
						}
					}
				}
			}
			return Cardsets.find({_id: {$in: cardsets}});
		}
	});
	Meteor.publish("myCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Cardsets.find({owner: this.userId, shuffled: false});
		}
	});
	Meteor.publish("poolCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			return Cardsets.find({kind: {$in: ['free', 'edu', 'pro']}, shuffled: false});
		}
	});
	Meteor.publish("repetitoriumCardsets", function () {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			if (UserPermissions.isAdmin()) {
				return Cardsets.find({shuffled: true});
			} else {
				return Cardsets.find({
					$or: [
						{owner: this.userId, shuffled: true},
						{kind: {$in: ['free', 'edu', 'pro']}, shuffled: true}
					]
				});
			}
		}
	});
	Meteor.publish("editShuffleCardsets", function (cardset_id) {
		if (this.userId && UserPermissions.isNotBlockedOrFirstLogin()) {
			if (UserPermissions.isAdmin()) {
				return Cardsets.find({
					$or: [
						{_id: cardset_id},
						{shuffled: false}
					]
				});
			} else {
				return Cardsets.find(
					{
						$or: [
							{_id: cardset_id},
							{owner: this.userId, shuffled: false},
							{kind: {$in: ['free', 'edu', 'pro']}, shuffled: false}
						]
					});
			}
		}
	});
	Meteor.publish("tags", function () {
		let universityFilter = null;
		if (Meteor.settings.public.university.singleUniversity) {
			universityFilter = Meteor.settings.public.university.default;
		}
		return Cardsets.find({college: {$ifNull: [universityFilter, {$exists: true}]}}, {
			fields: {
				_id: 1,
				name: 1,
				quantity: 1,
				kind: 1
			}
		});
	});
}

const CardsetsSchema = new SimpleSchema({
	name: {
		type: String
	},
	description: {
		type: String,
		optional: true
	},
	date: {
		type: Date
	},
	dateUpdated: {
		type: Date
	},
	editors: {
		type: [String]
	},
	owner: {
		type: String
	},
	visible: {
		type: Boolean
	},
	ratings: {
		type: Boolean
	},
	kind: {
		type: String
	},
	price: {
		type: Number,
		decimal: true
	},
	reviewed: {
		type: Boolean
	},
	reviewer: {
		type: String
	},
	request: {
		type: Boolean
	},
	relevance: {
		type: Number,
		decimal: true,
		optional: true
	},
	rating: {
		type: Number,
		decimal: true
	},
	raterCount: {
		type: Number,
		decimal: true
	},
	quantity: {
		type: Number
	},
	license: {
		type: [String],
		maxCount: 4
	},
	userDeleted: {
		type: Boolean
	},
	learningActive: {
		type: Boolean
	},
	maxCards: {
		type: Number
	},
	daysBeforeReset: {
		type: Number
	},
	learningStart: {
		type: Date
	},
	learningEnd: {
		type: Date
	},
	learningInterval: {
		type: [Number]
	},
	registrationPeriod: {
		type: Date
	},
	wordcloud: {
		type: Boolean
	},
	shuffled: {
		type: Boolean
	},
	cardGroups: {
		type: [String]
	},
	cardType: {
		type: Number
	},
	difficulty: {
		type: Number
	},
	originalAuthor: {
		type: String,
		optional: true
	},
	originalAuthorName: {
		type: Object,
		optional: true,
		blackbox: true
	},
	noDifficulty: {
		type: Boolean
	},
	pomodoroTimer: {
		type: Object,
		optional: true,
		blackbox: true
	},
	workload: {
		type: Object,
		optional: true,
		blackbox: true
	},
	learners: {
		type: Number,
		optional: true
	}
});

Cardsets.attachSchema(CardsetsSchema);

Meteor.methods({
	getSearchCategoriesResult: function (searchValue) {
		if (!Meteor.userId() || !UserPermissions.isNotBlockedOrFirstLogin()) {
			throw new Meteor.Error("not-authorized");
		} else if (searchValue !== undefined && searchValue !== null && searchValue.length > 2) {
			let query = {};

			if (UserPermissions.isAdmin()) {
				query.name = {$regex: searchValue, $options: "i"};
				query.kind = {$nin: ['demo', 'server']};
			} else {
				query = {
					name: {$regex: searchValue, $options: "i"},
					$or: [
						{owner: Meteor.userId()},
						{kind: {$nin: ['demo', 'server', 'personal']}}
					]
				};
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
						shuffled: 1
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
	 */
	addCardset: function (name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty) {
		check(name, String);
		check(description, String);
		check(visible, Boolean);
		check(ratings, Boolean);
		check(kind, String);
		check(shuffled, Boolean);
		check(cardType, Number);
		check(difficulty, Number);
		let quantity;
		if (shuffled) {
			if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'lecturer', 'university', 'pro'])) {
				throw new Meteor.Error("not-authorized");
			}
			check(cardGroups, [String]);
			quantity = Cards.find({cardset_id: {$in: cardGroups}}).count();
		} else {
			quantity = 0;
			cardGroups = [];
		}
		// Make sure the user is logged in before inserting a cardset
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		if (cardType < 0) {
			cardType = 0;
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
			noDifficulty: !CardType.gotDifficultyLevel(cardType)
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
		if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.remove(id);
			Cards.remove({
				cardset_id: id
			});
			Meteor.call('updateShuffledCardsetQuantity', id);
			Leitner.remove({
				cardset_id: id
			});
			Wozniak.remove({
				cardset_id: id
			});
			Notifications.remove({
				link_id: id
			});
			Ratings.remove({
				cardset_id: id
			});
			Workload.remove({
				cardset_id: id
			});
			Meteor.call('updateCardsetCount', Meteor.userId());
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	deleteCards: function (id) {
		check(id, String);
		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
			Cards.remove({
				cardset_id: id
			});
			Cardsets.update({
					_id: id
				},
				{
					$set: {
						quantity: 0,
						kind: 'personal',
						reviewed: false,
						request: false,
						visible: false
					}
				}
			);
			Meteor.call('updateShuffledCardsetQuantity', cardset._id);
			Leitner.remove({
				cardset_id: id
			});
			Wozniak.remove({
				cardset_id: id
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Deactivate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be deactivated.
	 */
	deactivateBonus: function (id) {
		check(id, String);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && cardset.learningActive && (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner))) {
			Cardsets.update(id, {
				$set: {
					learningActive: false
				}
			});
			let users = Workload.find({
				cardset_id: cardset._id,
				'leitner.bonus': true
			}, {fields: {user_id: 1}}).fetch();
			for (let i = 0; i < users.length; i++) {
				Workload.update({
						cardset_id: cardset._id,
						user_id: users[i].user_id
					},
					{
						$set: {
							'leitner.bonus': false
						}
					}
				);
				Leitner.remove({
					cardset_id: cardset._id,
					user_id: users[i].user_id
				});
				Wozniak.remove({
					cardset_id: cardset._id,
					user_id: users[i].user_id
				});
			}
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Activate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {Number} maxWorkload - Maximum number of daily learnable cards
	 * @param {Number} daysBeforeReset - Maximum overrun in days
	 * @param {Date} dateStart - Start date of the learnin gphase
	 * @param {Date} dateEnd - End date of the learning phase
	 * @param {Number} intervals - Learning interval in days
	 * @param {Date} registrationPeriod - Period in which new users can join the bonus phase
	 * @param {Number} maxBonusPoints - The maximum achieveable bonus points
	 */
	activateBonus: function (id, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod, maxBonusPoints) {
		check(id, String);
		check(maxWorkload, Number);
		check(daysBeforeReset, Number);
		check(dateStart, Date);
		check(dateEnd, Date);
		check(intervals, [Number]);
		check(registrationPeriod, Date);
		check(maxBonusPoints, Number);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && !cardset.learningActive && (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner))) {
			intervals = intervals.sort(
				function (a, b) {
					return a - b;
				}
			);
			Cardsets.update(id, {
				$set: {
					learningActive: true,
					maxCards: maxWorkload,
					daysBeforeReset: daysBeforeReset,
					learningStart: dateStart,
					learningEnd: dateEnd,
					learningInterval: intervals,
					registrationPeriod: registrationPeriod,
					"workload.bonus.maxPoints": Math.floor(maxBonusPoints)
				}
			});
			return cardset._id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the settings of a learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {Number} maxWorkload - Maximum number of daily learnable cards
	 * @param {Number} daysBeforeReset - Maximum overrun in days
	 * @param {Date} dateStart - Start date of the learnin gphase
	 * @param {Date} dateEnd - End date of the learning phase
	 * @param {Number} intervals - Learning interval in days
	 * @param {Date} registrationPeriod - Period in which new users can join the bonus phase
	 * @param {Number} maxBonusPoints - The maximum achieveable bonus points
	 */
	updateBonus: function (id, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod, maxBonusPoints) {
		check(id, String);
		check(maxWorkload, Number);
		check(daysBeforeReset, Number);
		check(dateStart, Date);
		check(dateEnd, Date);
		check(intervals, [Number]);
		check(registrationPeriod, Date);
		check(maxBonusPoints, Number);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && cardset.learningActive && (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner))) {
			intervals = intervals.sort(
				function (a, b) {
					return a - b;
				}
			);
			Cardsets.update(id, {
				$set: {
					maxCards: maxWorkload,
					daysBeforeReset: daysBeforeReset,
					learningStart: dateStart,
					learningEnd: dateEnd,
					learningInterval: intervals,
					registrationPeriod: registrationPeriod,
					"workload.bonus.maxPoints": Math.floor(maxBonusPoints)
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
	 */
	updateCardset: function (id, name, description, cardType, difficulty) {
		check(id, String);
		check(name, String);
		check(description, String);
		check(cardType, Number);
		check(difficulty, Number);

		// Make sure only the task owner can make a task private
		let cardset = Cardsets.findOne(id);
		if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
			if (cardset.learningActive) {
				cardType = cardset.cardType;
			}

			Cardsets.update(id, {
				$set: {
					name: name.trim(),
					description: description,
					dateUpdated: new Date(),
					cardType: cardType,
					difficulty: difficulty,
					noDifficulty: !CardType.gotDifficultyLevel(cardType)
				}
			}, {trimStrings: false});
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
		if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
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
					cardGroups: cardGroups
				}
			});
			let removedCards = Cards.find({cardset_id: {$in: removedCardsets}}).fetch();
			for (let i = 0; i < removedCards.length; i++) {
				Leitner.remove({
					cardset_id: cardset._id,
					card_id: removedCards[i]._id
				});
				Wozniak.remove({
					cardset_id: cardset._id,
					card_id: removedCards[i]._id
				});
			}
			Meteor.call("updateLeitnerCardIndex", cardset._id);
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
						totalQuantity += cardGroupsCardset[0].quantity;
					}
				}
				Cardsets.update(cardsets[i]._id, {
					$set: {
						quantity: totalQuantity,
						dateUpdated: new Date()
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
		if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(id, {
				$set: {
					kind: kind,
					price: price.toString().replace(",", "."),
					visible: visible
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
	},
	makeProRequest: function (cardset_id) {
		check(cardset_id, String);

		let cardset = Cardsets.findOne(cardset_id);
		if (UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(cardset._id, {
				$set: {
					reviewed: false,
					request: true,
					visible: false
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
					visible: true
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
		if (UserPermissions.isAdmin() || UserPermissions.isOwner(cardset.owner)) {
			Cardsets.update(cardset._id, {
				$set: {
					license: license,
					dateUpdated: new Date()
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
		if (UserPermissions.isAdmin()) {
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
						owner: owner
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
	 *     * @param {String} id - ID of the cardset to be updated
	 * @param {Boolean} status - Wordcloud status for the cardset: true = Add to wordcloud, false = remove from Wordcloud
	 */
	updateWordcloudStatus: function (id, status) {
		check(id, String);
		check(status, Boolean);
		if (UserPermissions.isAdmin()) {
			Cardsets.update(id, {
				$set: {
					wordcloud: status
				}
			});
			return id;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	}
});
