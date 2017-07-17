import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {Cards} from "./cards.js";
import {Experience} from "./experience.js";
import {Ratings} from "./ratings.js";
import {check} from "meteor/check";

export const Cardsets = new Mongo.Collection("cardsets");

if (Meteor.isServer) {
	Meteor.publish("cardsets", function () {
		if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			return Cardsets.find();
		} else if (Roles.userIsInRole(this.userId, 'lecturer')) {
			return Cardsets.find({
				$or: [
					{visible: true},
					{request: true},
					{owner: this.userId}
				]
			});
		} else if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			return Cardsets.find({
				$or: [
					{visible: true},
					{owner: this.userId}
				]
			});
		}
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
	addCardset: function (name, description, visible, ratings, kind, module, moduleShort, moduleNum, skillLevel, college, course) {
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

		// Make sure the user is logged in before inserting a cardset
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		Cardsets.insert({
			name: name,
			description: description,
			date: new Date(),
			dateUpdated: new Date(),
			owner: Meteor.userId(),
			visible: visible,
			ratings: ratings,
			kind: kind,
			price: 0,
			reviewed: false,
			reviewer: 'undefined',
			request: false,
			relevance: 0,
			quantity: 0,
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
			mailNotification: true,
			webNotification: true
		});
		Experience.insert({
			type: 2,
			value: 3,
			date: new Date(),
			owner: Meteor.userId()
		});
		Meteor.call('checkLvl');
	},
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
	},
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
	updateCardset: function (id, name, description, module, moduleShort, moduleNum, skillLevel, college, course) {
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
	}
});
