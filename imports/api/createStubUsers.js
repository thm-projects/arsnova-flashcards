import {Factory} from "meteor/dburles:factory";
import {Meteor} from "meteor/meteor";
import sinon from 'sinon';

// FOR TESTING ONLY


export function CreateStubUser(roles) {
	Factory.define('user', Meteor.users, {
		'_id': 'TestUserId',
		'name': 'TestUser',
		'roles': roles,
		'profile': {
			'birthname': 'User',
			'givenname': 'Test',
			'completed': true,
			'name': 'TestUser',
			'title': '',
			'locale': 'de'
		}
	});

	const currentUser = Factory.create('user');
	sinon.stub(Meteor, 'user');
	Meteor.user.returns(currentUser); // now Meteor.user() will return the user we just created

	sinon.stub(Meteor, 'userId');
	Meteor.userId.returns(currentUser._id); // needed in methods
}
