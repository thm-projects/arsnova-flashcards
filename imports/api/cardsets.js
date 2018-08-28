import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cards} from "./cards.js";
import {Leitner, Wozniak} from "./learned.js";
import {Notifications} from "./notifications.js";
import {Ratings} from "./ratings.js";
import {check} from "meteor/check";
import {CardType} from "./cardTypes";

export const Cardsets = new Mongo.Collection("cardsets");

export function getShuffledCardsetReferences(kind) {
	let shuffleddCardsetReferences = [];
	let shuffledCardsets = Cardsets.find({
		shuffled: true,
		visible: true,
		kind: {$in: kind}
	}, {fields: {cardGroups: 1}}).fetch();
	for (let i = 0; i < shuffledCardsets.length; i++) {
		for (let k = 0; k < shuffledCardsets[i].cardGroups.length; k++) {
			shuffleddCardsetReferences.push(shuffledCardsets[i].cardGroups[k]);
		}
	}
	return shuffleddCardsetReferences;
}

if (Meteor.isServer) {
	Meteor.publish("cardsets", function () {
		if (this.userId) {
			if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
				return Cardsets.find({kind: {$nin: ['server']}});
			} else if (Roles.userIsInRole(this.userId, 'lecturer')) {
				return Cardsets.find(
					{
						$or: [
							{visible: true},
							{request: true},
							{owner: this.userId},
							{_id: {$in: getShuffledCardsetReferences(['free', 'edu', 'pro'])}}
						]
					});
			} else if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				return Cardsets.find(
					{
						$or: [
							{visible: true},
							{owner: this.userId},
							{_id: {$in: getShuffledCardsetReferences(['free', 'edu', 'pro'])}}
						]
					});
			}
		} else {
			return Cardsets.find(
				{
					$or: [
						{kind: {$in: ['demo']}},
						{wordcloud: true}
					]
				},
				{
					fields:
						{
							_id: 1,
							owner: 1,
							name: 1,
							quantity: 1,
							kind: 1,
							description: 1,
							cardType: 1,
							difficulty: 1,
							date: 1,
							dateUpdated: 1,
							wordcloud: 1,
							cardGroups: 1,
							license: 1,
							shuffled: 1,
							learningActive: 1,
							originalAuthorName: 1
						}
				});
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
	learners: {
		type: Number
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
	}
});

Cardsets.attachSchema(CardsetsSchema);

CardsetsIndex = new EasySearch.Index({
	collection: Cardsets,
	fields: [
		'name',
		'description',
		'owner'
	],
	engine: new EasySearch.Minimongo({
		selector: function (searchObject, options, aggregation) {
			// Default selector
			const defSelector = this.defaultConfiguration().selector(searchObject, options, aggregation);

			// Filter selector
			const selector = {};
			selector.$and = [
				defSelector,
				{
					$or: [
						{
							owner: Meteor.userId()
						},
						{
							visible: true
						}
					]
				}
			];
			return selector;
		}
	})
});

Meteor.methods({
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
		return Cardsets.insert({
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
			relevance: 0,
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
			learners: 0,
			mailNotification: true,
			webNotification: true,
			wordcloud: false,
			shuffled: shuffled,
			cardGroups: cardGroups,
			cardType: cardType,
			difficulty: difficulty,
			noDifficulty: !CardType.gotDifficultyLevel(cardType)
		}, {trimStrings: false});
	},
	/**
	 * Delete selected Cardset from database if user is auhorized.
	 * @param {String} id - Database id of the cardset to be deleted
	 */
	deleteCardset: function (id) {
		check(id, String);
		// Make sure only the task owner can make a task private
		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}

		Cardsets.remove(id);
		Cards.remove({
			cardset_id: id
		});
		Meteor.call('updateShuffledCardsetQuantity', id);
		Leitner.remove({
			cardset_id: id
		}, {multi: true});
		Wozniak.remove({
			cardset_id: id
		}, {multi: true});
		Notifications.remove({
			link_id: id
		}, {multi: true});
		Ratings.remove({
			cardset_id: id
		}, {multi: true});
	},
	deleteCards: function (id) {
		check(id, String);
		// Make sure only the task owner can make a task private
		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}
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
		}, {multi: true});
		Wozniak.remove({
			cardset_id: id
		}, {multi: true});
	},
	/**
	 * Deactivate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be deactivated.
	 */
	deactivateBonus: function (id) {
		check(id, String);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && cardset.learningActive && (Roles.userIsInRole(Meteor.userId(), ["admin", "editor"]) || cardset.owner === Meteor.userId())) {
			Cardsets.update(id, {
				$set: {
					learningActive: false
				}
			});
			Meteor.call("clearLeitnerProgress", id);
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
	 */
	activateBonus: function (id, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod) {
		check(id, String);
		check(maxWorkload, Number);
		check(daysBeforeReset, Number);
		check(dateStart, Date);
		check(dateEnd, Date);
		check(intervals, [Number]);
		check(registrationPeriod, Date);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && !cardset.learningActive && (Roles.userIsInRole(Meteor.userId(), ["admin", "editor"]) || cardset.owner === Meteor.userId())) {
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
					registrationPeriod: registrationPeriod
				}
			});
			Meteor.call("clearLeitnerProgress", id);
			Meteor.call("activateLearningPeriodSetEdu", id);
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
	 */
	updateBonus: function (id, maxWorkload, daysBeforeReset, dateStart, dateEnd, intervals, registrationPeriod) {
		check(id, String);
		check(maxWorkload, Number);
		check(daysBeforeReset, Number);
		check(dateStart, Date);
		check(dateEnd, Date);
		check(intervals, [Number]);
		check(registrationPeriod, Date);

		let cardset = Cardsets.findOne(id);
		if (cardset !== undefined && cardset.learningActive && (Roles.userIsInRole(Meteor.userId(), ["admin", "editor"]) || cardset.owner === Meteor.userId())) {
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
					registrationPeriod: registrationPeriod
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

		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}

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
		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}
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
	activateLearningPeriodSetEdu: function (cardset_id) {
		check(cardset_id, String);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor", "lecturer"])) {
			throw new Meteor.Error("not-authorized");
		}
		Cardsets.update({
			_id: cardset_id
		}, {
			$set: {
				kind: "edu"
			}
		}, {
			multi: true
		});
	},
	updateRelevance: function (cardset_id) {
		check(cardset_id, String);

		var relevance = 0;

		var ratings = Ratings.find({cardset_id: cardset_id});
		var count = ratings.count();
		if (count !== 0) {
			var amount = 0;
			ratings.forEach(function (rate) {
				amount = amount + rate.rating;
			});
			var result = (amount / count).toFixed(2);
			relevance = Number(result);
		}

		var kind = Cardsets.findOne(cardset_id).kind;

		switch (kind) {
			case 'free':
				break;
			case 'edu':
				relevance += 0.1;
				break;
			case 'pro':
				relevance += 0.2;
				break;
			default:
				break;
		}

		return relevance;
	},
	publishCardset: function (id, kind, price, visible) {
		check(id, String);
		check(kind, String);
		check(visible, Boolean);

		// Make sure only the task owner can make a task private
		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}

		Meteor.call("updateRelevance", id, function (error, relevance) {
			if (!error) {
				Cardsets.update(id, {
					$set: {
						kind: kind,
						price: price.toString().replace(",", "."),
						visible: visible,
						relevance: relevance,
						raterCount: Number(Ratings.find({cardset_id: id}).count())
					}
				});
			}
		});
		if (kind !== "personal") {
			Meteor.users.update(Meteor.user()._id, {
				$set: {
					visible: true
				}
			});
		}
	},
	makeProRequest: function (cardset_id) {
		check(cardset_id, String);

		var cardset = Cardsets.findOne(cardset_id);

		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}

		Cardsets.update(cardset_id, {
			$set: {
				reviewed: false,
				request: true,
				visible: false
			}
		});
	},
	acceptProRequest: function (cardset_id) {
		check(cardset_id, String);

		var cardset = Cardsets.findOne(cardset_id);

		if (!Roles.userIsInRole(this.userId, 'lecturer')) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}

		Cardsets.update(cardset_id, {
			$set: {
				reviewed: true,
				reviewer: this.userId,
				request: false,
				visible: true
			}
		});
	},
	declineProRequest: function (cardset_id) {
		check(cardset_id, String);

		var cardset = Cardsets.findOne(cardset_id);
		if ((!Roles.userIsInRole(this.userId, 'lecturer')) && (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"]))) {
			throw new Meteor.Error("not-authorized");
		}

		Cardsets.update(cardset_id, {
			$set: {
				reviewed: false,
				reviewer: this.userId,
				request: false,
				visible: false
			}
		});
	},
	updateLicense: function (id, license) {
		check(id, String);
		check(license, [String]);

		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
			'admin',
			'editor'
		])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
				throw new Meteor.Error("not-authorized");
			}
		}

		Cardsets.update(id, {
			$set: {
				license: license,
				dateUpdated: new Date()
			}
		});
	},
	/**
	 * Changes the owner of the selected cardset. Only the super admin got access to this feature.
	 * @param {String} id - ID of the cardset to be updated
	 * @param {String} owner - The new owner for the cardset
	 */
	changeOwner: function (id, owner) {
		check(id, String);
		check(owner, String);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}

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
	},
	/**
	 * Whitelist the cardset for the wordcloud
	 *     * @param {String} id - ID of the cardset to be updated
	 * @param {Boolean} status - Wordcloud status for the cardset: true = Add to wordcloud, false = remove from Wordcloud
	 */
	updateWordcloudStatus: function (id, status) {
		check(id, String);
		check(status, Boolean);

		if (!Roles.userIsInRole(this.userId, ["admin", "editor"])) {
			throw new Meteor.Error("not-authorized");
		}

		Cardsets.update(id, {
			$set: {
				wordcloud: status
			}
		});
		return id;
	}
});
