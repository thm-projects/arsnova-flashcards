import {Factory} from "meteor/dburles:factory";
import {Meteor} from "meteor/meteor";
import sinon from 'sinon';

// FOR TESTING ONLY


export function CreateStubUser(id, roles) {
	Factory.define('user', Meteor.users, {
		'_id': id,
		'name': 'TestUser',
		'roles': roles,
		'profile': {
			'birthname': 'User',
			'givenname': 'Test',
			'completed': true,
			'name': 'TestUser',
			'title': '',
			'locale': 'de'
		},
		'count': {
			'transcripts': 5,
			'bonusTranscripts': 5
		}
	});

	const currentUser = Factory.create('user');
	sinon.stub(Meteor, 'user');
	Meteor.user.returns(currentUser); // now Meteor.user() will return the user we just created

	sinon.stub(Meteor, 'userId');
	Meteor.userId.returns(currentUser._id); // needed in methods
}
