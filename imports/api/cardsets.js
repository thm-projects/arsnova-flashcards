import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cards} from "./cards.js";
import {Experience} from "./experience.js";
import {Learned} from "./learned.js";
import {Notifications} from "./notifications.js";
import {Ratings} from "./ratings.js";
import {check} from "meteor/check";

export const Cardsets = new Mongo.Collection("cardsets");

if (Meteor.isServer) {
	Meteor.publish("cardsets", function () {
		if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Cardsets.find({"college": Meteor.settings.public.university.default});
			} else {
				return Cardsets.find();
			}
		} else if (Roles.userIsInRole(this.userId, 'lecturer')) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Cardsets.find({
					"college": Meteor.settings.public.university.default,
					$or: [
						{visible: true},
						{request: true},
						{owner: this.userId}
					]
				});
			} else {
				return Cardsets.find({
					$or: [
						{visible: true},
						{request: true},
						{owner: this.userId}
					]
				});
			}
		} else if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			if (Meteor.settings.public.university.singleUniversity) {
				return Cardsets.find({
					"college": Meteor.settings.public.university.default,
					$or: [
						{visible: true},
						{owner: this.userId}
					]
				});
			} else {
				return Cardsets.find({
					$or: [
						{visible: true},
						{owner: this.userId}
					]
				});
			}
		}
	});
	Meteor.publish("tags", function () {
		return Cardsets.find({}, {fields: {_id: 1, name: 1, quantity: 1, kind: 1}});
	});
}

const CardsetsSchema = new SimpleSchema({
	name: {
		type: String
	},
	description: {
		type: String
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
	module: {
		type: String
	},
	moduleToken: {
		type: String
	},
	moduleNum: {
		type: String
	},
	skillLevel: {
		type: Number
	},
	college: {
		type: String
	},
	course: {
		type: String
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
	 * @param {String} module - Modulename
	 * @param {String} moduleShort - Abbreviation for the module
	 * @param {String} moduleNum - Number of the module
	 * @param {Number} skillLevel - Skill level of the cardset
	 * @param {String} college - Assigned university
	 * @param {String} course - Assigned university course
	 * @param {Boolean} shuffled - Is the cardset made out of shuffled cards
	 * @param {String} cardGroups - The group names of the shuffled cards
	 */
	addCardset: function (name, description, visible, ratings, kind, module, moduleShort, moduleNum, skillLevel, college, course, shuffled, cardGroups) {
		if (Meteor.settings.public.university.singleUniversity) {
			college = Meteor.settings.public.university.default;
		}
		check(name, String);
		check(description, String);
		check(visible, Boolean);
		check(ratings, Boolean);
		check(kind, String);
		check(module, String);
		check(moduleShort, String);
		check(moduleNum, String);
		check(skillLevel, Number);
		check(college, String);
		check(course, String);
		check(shuffled, Boolean);
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
		Cardsets.insert({
			name: name,
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
			quantity: quantity,
			license: [],
			userDeleted: false,
			module: module,
			moduleToken: moduleShort,
			moduleNum: moduleNum,
			skillLevel: skillLevel,
			college: college,
			course: course,
			learningActive: false,
			maxCards: 0,
			daysBeforeReset: 0,
			learningStart: 0,
			learningEnd: 0,
			learningInterval: [],
			learners: 0,
			mailNotification: true,
			webNotification: true,
			wordcloud: false,
			shuffled: shuffled,
			cardGroups: cardGroups
		});
		Experience.insert({
			type: 2,
			value: 3,
			date: new Date(),
			owner: Meteor.userId()
		});
		Meteor.call('checkLvl');
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
		Learned.remove({
			cardset_id: id
		});
		Notifications.remove({
			link_id: id
		});
		Ratings.remove({
			cardset_id: id
		});
		Meteor.call("updateWordsForWordcloud");
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
	},
	/**
	 * Deactivate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be deactivated.
	 */
	deactivateLearning: function (id) {
		check(id, String);

		if (Roles.userIsInRole(Meteor.userId(), "lecturer") && Cardsets.findOne(id).owner === Meteor.userId()) {
			Cardsets.update(id, {
				$set: {
					learningActive: false
				}
			});
			Meteor.call("clearLearningProgress", id);
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Activate the learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {String} maxCards - Maximum number of daily learnable cards
	 * @param {String} daysBeforeReset - Maximum overrun in days
	 * @param {Date} learningStart - Start date of the learnin gphase
	 * @param {Date} learningEnd - End date of the learning phase
	 * @param {String} learningInterval - Learning interval in days
	 */
	activateLearning: function (id, maxCards, daysBeforeReset, learningStart, learningEnd, learningInterval) {
		check(id, String);
		check(maxCards, String);
		check(daysBeforeReset, String);
		check(learningStart, Date);
		check(learningEnd, Date);
		check(learningInterval, [String]);

		if (Roles.userIsInRole(Meteor.userId(), "lecturer") && Cardsets.findOne(id).owner === Meteor.userId()) {
			if (!maxCards) {
				maxCards = 5;
			}
			if (!daysBeforeReset) {
				daysBeforeReset = 7;
			}
			if (!learningStart) {
				learningStart = new Date();
			}
			if (!learningEnd) {
				learningEnd = new Date();
				learningEnd.setMonth(learningEnd.getMonth() + 3);
			}
			if (!learningInterval) {
				learningInterval = [1, 3, 7, 4 * 7, 3 * 4 * 7];
			}
			learningInterval = learningInterval.sort(
				function (a, b) {
					return a - b;
				}
			);
			Cardsets.update(id, {
				$set: {
					learningActive: true,
					maxCards: maxCards,
					daysBeforeReset: daysBeforeReset,
					learningStart: learningStart,
					learningEnd: learningEnd,
					learningInterval: learningInterval
				}
			});
			Meteor.call("clearLearningProgress", id);
			Meteor.call("activateLearningPeriodSetEdu", id);
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	/**
	 * Updates the settings of a learning phase for the selected cardset.
	 * @param {String} id - ID of the cardset for which the learning phase is to be activated.
	 * @param {String} maxCards - Maximum number of daily learnable cards
	 * @param {String} daysBeforeReset - Maximum overrun in days
	 * @param {Date} learningStart - Start date of the learnin gphase
	 * @param {Date} learningEnd - End date of the learning phase
	 * @param {String} learningInterval - Learning interval in days
	 */
	updateLearning: function (id, maxCards, daysBeforeReset, learningStart, learningEnd, learningInterval) {
		check(id, String);
		check(maxCards, String);
		check(daysBeforeReset, String);
		check(learningStart, Date);
		check(learningEnd, Date);
		check(learningInterval, [String]);

		if (Roles.userIsInRole(Meteor.userId(), ["admin", "lecturer"]) && ((Cardsets.findOne(id).owner === Meteor.userId()) || Roles.userIsInRole(Meteor.userId(), "admin"))) {
			learningInterval = learningInterval.sort(
				function (a, b) {
					return a - b;
				}
			);
			Cardsets.update(id, {
				$set: {
					maxCards: maxCards,
					daysBeforeReset: daysBeforeReset,
					learningStart: learningStart,
					learningEnd: learningEnd,
					learningInterval: learningInterval
				}
			});
		} else {
			throw new Meteor.Error("not-authorized");
		}
		return true;
	},
	/**
	 * Updates the selected cardset if user is authorized.
	 * @param {String} id - ID of the cardset to be updated
	 * @param {String} name - Title of the cardset
	 * @param {String} description - Description for the content of the cardset
	 * @param {String} module - Module name
	 * @param {String} moduleShort - Abbreviation for the module
	 * @param {String} moduleNum - Number of the module
	 * @param {Number} skillLevel - Skill level of the cardset
	 * @param {String} college - Assigned university
	 * @param {String} course - Assigned university course
	 */
	updateCardset: function (id, name, description, module, moduleShort, moduleNum, skillLevel, college, course) {
		if (Meteor.settings.public.university.singleUniversity) {
			college = Meteor.settings.public.university.default;
		}
		check(id, String);
		check(name, String);
		check(description, String);
		check(module, String);
		check(moduleShort, String);
		check(moduleNum, String);
		check(skillLevel, Number);
		check(college, String);
		check(course, String);

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

		Cardsets.update(id, {
			$set: {
				name: name,
				description: description,
				dateUpdated: new Date(),
				module: module,
				moduleToken: moduleShort,
				moduleNum: moduleNum,
				skillLevel: skillLevel,
				college: college,
				course: course
			}
		});
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
			Learned.remove({
				cardset_id: cardset._id,
				card_id: removedCards[i]._id
			});
		}
		return true;
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
						price: price,
						visible: visible,
						relevance: relevance
					}
				});
			}
		});
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

		if (!Roles.userIsInRole(this.userId, ["admin"])) {
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
		Meteor.call("updateWordsForWordcloud");
	}
});
