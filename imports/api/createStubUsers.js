import {Factory} from "meteor/dburles:factory";
import {Meteor} from "meteor/meteor";

// FOR TESTING ONLY

Factory.define('user', Meteor.users, {
	'name': 'Kevin',
	'roles': ['admin'],
	'profile': {
		'birthname': '.cards',
		'givenname': '',
		'completed': true,
		'name': '.cards',
		'title': '',
		'locale': 'de'
	}
});
