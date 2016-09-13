import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import {Cards} from './cards.js';
import {Experience} from './experience.js';
import {Ratings} from './ratings.js';

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
		} else if (this.userId && !Roles.userIsInRole(this.userId, 'blocked')) {
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
	//username: {
		//type: String
	//},
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
	modulLong: {
		type: String
	},
	modulShort: {
		type: String
	},
	modulNum: {
		type: String
	},
	lastName: {
		type: String
	},
	degree: {
		type: String
	},
	college: {
		type: String
	},
	academicCourse: {
		type: String
	},
	department: {
		type: String
	},
	studyType: {
		type: String
	},
	BachelorOrMaster: {
		type: String
	},
	semester: {
		type: String
	}
});

Cardsets.attachSchema(CardsetsSchema);

CardsetsIndex = new EasySearch.Index({
	collection: Cardsets,
	fields: [
		'name',
		'description'
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
	addCardset: function (name, description, visible, ratings, kind, modulLong, modulShort, modulNum, college, studyType) {
		// Make sure the user is logged in before inserting a cardset
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
			throw new Meteor.Error("not-authorized");
		}
		var nameTitle = 'undefined';
		if (Meteor.user().profile.title === "") {
			nameTitle = Meteor.user().profile.title;
		}
		Cardsets.insert({
			name: name,
			description: description,
			date: new Date(),
			dateUpdated: new Date(),
			owner: Meteor.userId(),
			firstName: Meteor.user().profile.name,
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
			modulLong: modulLong,
			modulShort: modulShort,
			modulNum: modulNum,
			lastName: 'undefined',
			degree: nameTitle,
			college: college,
			academicCourse: 'undefined',
			department: 'undefined',
			studyType: studyType,
			BachelorOrMaster: 'undefined',
			semester: 'undefined'
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
		// Make sure only the task owner can make a task private
		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
				throw new Meteor.Error("not-authorized");
			}
		}

		Cardsets.remove(id);
		Cards.remove({
			cardset_id: id
		});
	},
	updateCardset: function (id, name, description, modulLong, modulShort, modulNum) {
		// Make sure only the task owner can make a task private
		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
				throw new Meteor.Error("not-authorized");
			}
		}

		Cardsets.update(id, {
			$set: {
				name: name,
				description: description,
				dateUpdated: new Date(),
				modulLong: modulLong,
				modulShort: modulShort,
				modulNum: modulNum
			}
		});
	},
	updateRelevance: function (cardset_id) {
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
	publicateCardset: function (id, kind, price, visible) {
		// Make sure only the task owner can make a task private
		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
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
		var cardset = Cardsets.findOne(cardset_id);

		if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
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
		var cardset = Cardsets.findOne(cardset_id);

		if (!Roles.userIsInRole(this.userId, 'lecturer')) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
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
		var cardset = Cardsets.findOne(cardset_id);
		if ((!Roles.userIsInRole(this.userId, 'lecturer')) && (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked'))) {
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
		var cardset = Cardsets.findOne(id);

		if (!Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			if (!Meteor.userId() || cardset.owner !== Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked')) {
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

