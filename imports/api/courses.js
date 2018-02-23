import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const Courses = new Mongo.Collection("courses");


if (Meteor.isServer) {
	let universityFilter = {$ne: null};
	if (Meteor.settings.public.university.singleUniversity) {
		universityFilter = Meteor.settings.public.university.default;
	}
	Meteor.publish("courses", function () {
		if (Roles.userIsInRole(this.userId, [
				'admin',
				'editor'
			])) {
			return Courses.find({college: universityFilter});
		} else if (Roles.userIsInRole(this.userId, 'lecturer')) {
			return Courses.find(
				{
					college: universityFilter,
					$or: [
						{visible: true},
						{request: true},
						{owner: this.userId}
					]
				});
		} else if (this.userId && !Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			return Courses.find(
				{
					college: universityFilter,
					$or: [
						{visible: true},
						{owner: this.userId}
					]
				});
		}
	});
}

const CoursesSchema = new SimpleSchema({
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
	quantity: {
		type: Number
	},
	userDeleted: {
		type: Boolean
	},
	moduleActive: {
		type: Boolean
	},
	module: {
		type: String,
		optional: true
	},
	moduleToken: {
		type: String,
		optional: true
	},
	moduleNum: {
		type: String,
		optional: true
	},
	moduleLink: {
		type: String,
		optional: true
	},
	college: {
		type: String,
		optional: true
	},
	course: {
		type: String,
		optional: true
	},
	cardsets: {
		type: [String]
	}
});

Courses.attachSchema(CoursesSchema);

CardsetsIndex = new EasySearch.Index({
	collection: Courses,
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

});
