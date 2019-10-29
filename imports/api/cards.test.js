import './cards.js';
import { Meteor } from 'meteor/meteor';
import { assert, expect } from 'chai';
import { Cards } from './cards.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { CreateStubUser } from './createStubUsers';
import StubCollections from 'meteor/hwillson:stub-collections';
import { Cardsets } from './cardsets';
import {TranscriptBonus} from "./transcriptBonus";


describe('create cards successfully', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(
			{
				'_id': '123456789',
				'name': 'TestCardSet',
				'description': 'Cardset for tests',
				'date': 1537650325474,
				'dateUpdated': 1539500144049,
				'editors': [],
				'owner': 'no-owner',
				'visible': true,
				'ratings': false,
				'kind': 'test',
				'price': 0,
				'reviewed': false,
				'reviewer': 'undefined',
				'request': false,
				'rating': 0,
				'raterCount': 0,
				'quantity': 0,
				'license': [],
				'userDeleted': false,
				'learningActive': false,
				'maxCards': 5,
				'daysBeforeReset': 0,
				'learningStart': 0,
				'learningEnd': 0,
				'registrationPeriod': 0,
				'learningInterval': [],
				'wordcloud': false,
				'shuffled': false,
				'cardGroups': [null],
				'cardType': 13,
				'difficulty': 2,
				'noDifficulty': true,
				'originalAuthorName': {
					'title': '',
					'birthname': 'Test',
					'givenname': 'Author'
				},
				'workload': {
					'bonus': {
						'count': 0
					},
					'normal': {
						'count': 0
					}
				}
			}
		);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});


	it('create a new card with lower boundary values for alignType, learningGoalLevel and backgroundStyle', function () {
		CreateStubUser('id', ['admin']);
		let cardset_id = '-1';
		let subject = 'TestSubject';
		let content1 = 'Test content 1';
		let content2 = 'Test content 2';
		let content3 = 'Test content 3';
		let content4 = 'Test content 4';
		let content5 = 'Test content 5';
		let content6 = 'Test content 6';
		let centerTextElement = [false, false, false, false];
		let alignType = [0, 0, 0, 0, 0, 0]; // values from 0 - 3 allowed
		let date = new Date();
		let learningGoalLevel = 0; // values from 0 - 5 allowed
		let backgroundStyle = 0; // values from 0 - 1 allowed
		let bonusUser = false;

		Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, bonusUser, function (error, result) {
			if (result) {
				assert.isAbove(result.length, 0);
				let card = Cards.findOne(result);
				assert.equal(cardset_id, card.cardset_id);
				assert.equal(subject, card.subject);
				assert.equal(content1, card.front);
				assert.equal(content2, card.back);
				assert.equal(content3, card.hint);
				assert.equal(content4, card.lecture);
				assert.equal(content5, card.top);
				assert.equal(content6, card.bottom);
				expect(centerTextElement).to.eql(card.centerTextElement);
				expect(alignType).to.eql(card.alignType);
				expect(date).to.eql(card.date);
				assert.equal(learningGoalLevel, card.learningGoalLevel);
				assert.equal(backgroundStyle, card.backgroundStyle);
				assert.equal(Meteor.userId(), card.owner);
			}
		});
	});

	it('create a new card with upper boundary values for alignType, learningGoalLevel and backgroundStyle', function () {
		CreateStubUser('id', ['admin']);
		let cardset_id = '-1';
		let subject = 'TestSubject';
		let content1 = 'Test content 1';
		let content2 = 'Test content 2';
		let content3 = 'Test content 3';
		let content4 = 'Test content 4';
		let content5 = 'Test content 5';
		let content6 = 'Test content 6';
		let centerTextElement = [false, false, false, false];
		let alignType = [0, 0, 3, 0, 0, 0]; // values from 0 - 3 allowed
		let date = new Date();
		let learningGoalLevel = 5; // values from 0 - 5 allowed
		let backgroundStyle = 1; // values from 0 - 1 allowed
		let bonusUser = false;

		Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, bonusUser, function(error, result) {
			if (result) {
				assert.isAbove(result.length, 0);
				let card = Cards.findOne(result);
				assert.equal(cardset_id, card.cardset_id);
				assert.equal(subject, card.subject);
				assert.equal(content1, card.front);
				assert.equal(content2, card.back);
				assert.equal(content3, card.hint);
				assert.equal(content4, card.lecture);
				assert.equal(content5, card.top);
				assert.equal(content6, card.bottom);
				expect(centerTextElement).to.eql(card.centerTextElement);
				expect(alignType).to.eql(card.alignType);
				expect(date).to.eql(card.date);
				assert.equal(learningGoalLevel, card.learningGoalLevel);
				assert.equal(backgroundStyle, card.backgroundStyle);
				assert.equal(Meteor.userId(), card.owner);
			}
		});
	});

	it('create a new card in a cardset', function () {
		CreateStubUser('id', ['admin']);
		let cardset_id = '123456789';
		let subject = 'TestSubject';
		let content1 = 'Test content 1';
		let content2 = 'Test content 2';
		let content3 = 'Test content 3';
		let content4 = 'Test content 4';
		let content5 = 'Test content 5';
		let content6 = 'Test content 6';
		let centerTextElement = [false, false, false, false];
		let alignType = [0, 0, 0, 0, 0, 0];
		let date = new Date();
		let learningGoalLevel = 0;
		let backgroundStyle = 0;
		let bonusUser = false;

		Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, bonusUser, function (error, result) {
			if (result) {
				assert.isAbove(result.length, 0);
				let card = Cards.findOne(result);
				assert.equal(cardset_id, card.cardset_id);
				assert.equal(subject, card.subject);
				assert.equal(content1, card.front);
				assert.equal(content2, card.back);
				assert.equal(content3, card.hint);
				assert.equal(content4, card.lecture);
				assert.equal(content5, card.top);
				assert.equal(content6, card.bottom);
				expect(centerTextElement).to.eql(card.centerTextElement);
				expect(alignType).to.eql(card.alignType);
				expect(date).to.eql(card.date);
				assert.equal(learningGoalLevel, card.learningGoalLevel);
				assert.equal(backgroundStyle, card.backgroundStyle);
				assert.equal(Meteor.userId(), card.owner);
			}
		});
	});
});


describe('create cards with wrong parameter values', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(
			{
				'_id': '123456789',
				'name': 'TestCardSet',
				'description': 'Cardset for tests',
				'date': 1537650325474,
				'dateUpdated': 1539500144049,
				'editors': [],
				'owner': 'no-owner',
				'visible': true,
				'ratings': false,
				'kind': 'test',
				'price': 0,
				'reviewed': false,
				'reviewer': 'undefined',
				'request': false,
				'rating': 0,
				'raterCount': 0,
				'quantity': 0,
				'license': [],
				'userDeleted': false,
				'learningActive': false,
				'maxCards': 5,
				'daysBeforeReset': 0,
				'learningStart': 0,
				'learningEnd': 0,
				'registrationPeriod': 0,
				'learningInterval': [],
				'wordcloud': false,
				'shuffled': false,
				'cardGroups': [null],
				'cardType': 13,
				'difficulty': 2,
				'noDifficulty': true,
				'originalAuthorName': {
					'title': '',
					'birthname': 'Test',
					'givenname': 'Author'
				},
				'workload': {
					'bonus': {
						'count': 0
					},
					'normal': {
						'count': 0
					}
				}
			}
		);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail with empty subject', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '-1';
			let subject = '';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with alignType values including -1 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '-1';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, -1, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with alignType values including 4 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '-1';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 4, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with learningGoalLevel -1 (allowed 0 - 5)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '-1';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = -1;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with learningGoalLevel 6 (allowed 0 - 5)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '-1';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 6;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with backgroundStyle -1 (allowed 0 - 1)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '-1';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = -1;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with backgroundStyle 2 (allowed 0 - 1)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '-1';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 2;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});
});

describe('create cards with wrong permissions', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(
			{
				'_id': '123456789',
				'name': 'TestCardSet',
				'description': 'Cardset for tests',
				'date': 1537650325474,
				'dateUpdated': 1539500144049,
				'editors': [],
				'owner': 'no-owner',
				'visible': true,
				'ratings': false,
				'kind': 'test',
				'price': 0,
				'reviewed': false,
				'reviewer': 'undefined',
				'request': false,
				'rating': 0,
				'raterCount': 0,
				'quantity': 0,
				'license': [],
				'userDeleted': false,
				'learningActive': false,
				'maxCards': 5,
				'daysBeforeReset': 0,
				'learningStart': 0,
				'learningEnd': 0,
				'registrationPeriod': 0,
				'learningInterval': [],
				'wordcloud': false,
				'shuffled': false,
				'cardGroups': [null],
				'cardType': 13,
				'difficulty': 2,
				'noDifficulty': true,
				'originalAuthorName': {
					'title': '',
					'birthname': 'Test',
					'givenname': 'Author'
				},
				'workload': {
					'bonus': {
						'count': 0
					},
					'normal': {
						'count': 0
					}
				}
			}
		);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail when blocked', function () {
		CreateStubUser('id', ['admin', 'blocked']);
		expect(function () {
			let cardset_id = '123456789';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail when first login', function () {
		CreateStubUser('id', ['admin', 'blocked']);
		expect(function () {
			let cardset_id = '123456789';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail when not logged in', function () {
		expect(function () {
			let cardset_id = '123456789';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
		// ****************************************************************
		// Only used for cleanup
		CreateStubUser('id', ['admin', 'blocked']);
	});
});

describe('create cards with wrong data types', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(
			{
				'_id': '123456789',
				'name': 'TestCardSet',
				'description': 'Cardset for tests',
				'date': 1537650325474,
				'dateUpdated': 1539500144049,
				'editors': [],
				'owner': 'no-owner',
				'visible': true,
				'ratings': false,
				'kind': 'test',
				'price': 0,
				'reviewed': false,
				'reviewer': 'undefined',
				'request': false,
				'rating': 0,
				'raterCount': 0,
				'quantity': 0,
				'license': [],
				'userDeleted': false,
				'learningActive': false,
				'maxCards': 5,
				'daysBeforeReset': 0,
				'learningStart': 0,
				'learningEnd': 0,
				'registrationPeriod': 0,
				'learningInterval': [],
				'wordcloud': false,
				'shuffled': false,
				'cardGroups': [null],
				'cardType': 13,
				'difficulty': 2,
				'noDifficulty': true,
				'originalAuthorName': {
					'title': '',
					'birthname': 'Test',
					'givenname': 'Author'
				},
				'workload': {
					'bonus': {
						'count': 0
					},
					'normal': {
						'count': 0
					}
				}
			}
		);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail with wrong data type for cardset_id', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = 1;
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for subject', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 1;
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for content1', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 1;
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for content2', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 1;
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for content3', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 1;
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for content4', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 1;
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for content5', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 1;
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for content6', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 1;
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for centerTextElement', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = 1;
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for alignType', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = '1';
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for date', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = 1;
			let learningGoalLevel = 0;
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for learningGoalLevel', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = '0';
			let backgroundStyle = 0;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});

	it('should fail with wrong data type for backgroundStyle', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardset_id = '1';
			let subject = 'Aktivitätsdiagramm';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = '0';

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle);
		}).to.throw();
	});
});

describe('addCard when not logged in', function () {
	beforeEach(() => {
		resetDatabase();
	});

	afterEach(() => {
		resetDatabase();
	});

	it('should fail when not logged in', function () {
		expect(function () {
			let cardset_id = '-1';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;
			let bonusUser = false;

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, bonusUser);
		}).to.throw();
	});
});

describe('add card with bonus transcript', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(TranscriptBonus);
		TranscriptBonus.insert(
			{
				'cardset_id': 'bonusCardset',
				'card_id': 'bonusCard',
				'user_id': 'bonusUser',
				'date': 1537650325474,
				'dates': [1537650325474, 9999999999900],
				'lectureEnd': '1537650325475',
				'deadline': 17520,
				'deadlineEditing': 1539500144030,
				rating: 5,
				stars: 5,
				reasons: []
			}
		);

		StubCollections.stub(Cardsets);
		Cardsets.insert(
			{
				'_id': 'bonusCardset',
				'name': 'BonusCardSet',
				'description': 'Cardset for tests',
				'date': 1537650325474,
				'dateUpdated': 1539500144049,
				'editors': [],
				'owner': 'TestUserId',
				'visible': true,
				'ratings': false,
				'kind': 'test',
				'price': 0,
				'reviewed': false,
				'reviewer': 'undefined',
				'request': false,
				'rating': 0,
				'raterCount': 0,
				'quantity': 1,
				'license': [],
				'userDeleted': false,
				'learningActive': false,
				'maxCards': 5,
				'daysBeforeReset': 0,
				'learningStart': 0,
				'learningEnd': 0,
				'registrationPeriod': 0,
				'learningInterval': [],
				'wordcloud': false,
				'shuffled': false,
				'cardGroups': [null],
				'cardType': 13,
				'difficulty': 2,
				'noDifficulty': true,
				'originalAuthorName': {
					'title': '',
					'birthname': 'Test',
					'givenname': 'Author'
				},
				'workload': {
					'bonus': {
						'count': 0
					},
					'normal': {
						'count': 0
					}
				},
				'transcriptBonus': {
					'cardset_id': 'bonusCardset',
					'card_id': 'bonusCard',
					'user_id': 'bonusUser',
					'date': 1537650325474,
					'dates': [1537650325474],
					'lectureEnd': '9999999900000',
					'deadline': 17520,
					'deadlineEditing': 999,
					'enabled': true
				}
			}
		);

		StubCollections.stub(Cards);
		Cards.insert(
			{
				'_id': 'bonusCard',
				'subject': 'TestSubject',
				'difficulty': 2,
				'front': 'Test text front',
				'back': 'Test text back',
				'hint': 'Test hint',
				'cardset_id': 'bonusCardset',
				'cardType': 19,
				'owner': 'bonusUser',
				'centerTextElement': [
					false,
					false,
					false,
					false
				],
				'learningGoalLevel': 0,
				'backgroundStyle': 0,
				'date': 1513612598530,
				'learningIndex': '0',
				'originalAuthorName': {
					'legacyName': 'Test, Author'
				},
				'alignType': [
					0,
					0,
					0,
					0,
					0,
					0
				]
			}
		);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail to create a card with bonus after deadline ended', function () {
		CreateStubUser('bonusUser', ['admin']);
		expect(function () {
			let cardset_id = 'bonusCardset';
			let subject = 'TestSubject';
			let content1 = 'Test content 1';
			let content2 = 'Test content 2';
			let content3 = 'Test content 3';
			let content4 = 'Test content 4';
			let content5 = 'Test content 5';
			let content6 = 'Test content 6';
			let centerTextElement = [false, false, false, false];
			let alignType = [0, 0, 0, 0, 0, 0];
			let date = new Date();
			let learningGoalLevel = 0;
			let backgroundStyle = 0;
			let bonusUser = {
				'date_id': 1,
				'cardset_id': 'bonusCardset'
			};

			Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, bonusUser);
		}).to.throw();
	});
});

describe('deleteCard', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(
			{
				'_id': '123456789',
				'name': 'TestCardSet',
				'description': 'Cardset for tests',
				'date': 1537650325474,
				'dateUpdated': 1539500144049,
				'editors': [],
				'owner': 'TestUserId',
				'visible': true,
				'ratings': false,
				'kind': 'test',
				'price': 0,
				'reviewed': false,
				'reviewer': 'undefined',
				'request': false,
				'rating': 0,
				'raterCount': 0,
				'quantity': 1,
				'license': [],
				'userDeleted': false,
				'learningActive': false,
				'maxCards': 5,
				'daysBeforeReset': 0,
				'learningStart': 0,
				'learningEnd': 0,
				'registrationPeriod': 0,
				'learningInterval': [],
				'wordcloud': false,
				'shuffled': false,
				'cardGroups': [null],
				'cardType': 13,
				'difficulty': 2,
				'noDifficulty': true,
				'originalAuthorName': {
					'title': '',
					'birthname': 'Test',
					'givenname': 'Author'
				},
				'workload': {
					'bonus': {
						'count': 0
					},
					'normal': {
						'count': 0
					}
				}
			}
		);

		Cardsets.insert(
			{
				'_id': '-1',
				'name': 'TestCardSet2',
				'description': 'Cardset for tests',
				'date': 1537650325474,
				'dateUpdated': 1539500144049,
				'editors': [],
				'owner': 'TestUserId',
				'visible': true,
				'ratings': false,
				'kind': 'test',
				'price': 0,
				'reviewed': false,
				'reviewer': 'undefined',
				'request': false,
				'rating': 0,
				'raterCount': 0,
				'quantity': 1,
				'license': [],
				'userDeleted': false,
				'learningActive': false,
				'maxCards': 5,
				'daysBeforeReset': 0,
				'learningStart': 0,
				'learningEnd': 0,
				'registrationPeriod': 0,
				'learningInterval': [],
				'wordcloud': false,
				'shuffled': false,
				'cardGroups': [null],
				'cardType': 1,
				'difficulty': 2,
				'noDifficulty': true,
				'originalAuthorName': {
					'title': '',
					'birthname': 'Test',
					'givenname': 'Author'
				},
				'workload': {
					'bonus': {
						'count': 0
					},
					'normal': {
						'count': 0
					}
				}
			}
		);

		StubCollections.stub(Cards);
		Cards.insert(
			{
				'_id': 'testCard',
				'subject': 'TestSubject',
				'difficulty': 2,
				'front': 'Test text front',
				'back': 'Test text back',
				'hint': 'Test hint',
				'cardset_id': '123456789',
				'cardType': 5,
				'owner': 'TestUserId',
				'centerTextElement': [
					false,
					false,
					false,
					false
				],
				'learningGoalLevel': 0,
				'backgroundStyle': 0,
				'date': 1513612598530,
				'learningIndex': '0',
				'originalAuthorName': {
					'legacyName': 'Test, Author'
				},
				'alignType': [
					0,
					0,
					0,
					0,
					0,
					0
				]
			}
		);

		Cards.insert(
			{
				'_id': 'testCard2',
				'subject': 'TestSubject',
				'difficulty': 2,
				'front': 'Test text front',
				'back': 'Test text back',
				'hint': 'Test hint',
				'cardset_id': '-1',
				'cardType': 5,
				'owner': 'TestUserId',
				'centerTextElement': [
					false,
					false,
					false,
					false
				],
				'learningGoalLevel': 0,
				'backgroundStyle': 0,
				'date': 1513612598530,
				'learningIndex': '0',
				'originalAuthorName': {
					'legacyName': 'Test, Author'
				},
				'alignType': [
					0,
					0,
					0,
					0,
					0,
					0
				]
			}
		);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should delete a card as admin', function () {
		CreateStubUser('id', ['admin']);
		let card_id = 'testCard';
		let cardset_route_id = '123456789';
		assert.exists(Cards.findOne(card_id));
		Meteor.call('deleteCard', card_id, cardset_route_id);
		assert.notExists(Cards.findOne(card_id));
	});

	it('should delete a card as owner', function () {
		CreateStubUser('TestUserId', ['editor']);
		let card_id = 'testCard';
		let cardset_route_id = '123456789';
		assert.exists(Cards.findOne(card_id));
		Meteor.call('deleteCard', card_id, cardset_route_id);
		assert.notExists(Cards.findOne(card_id));
	});

	it('should not delete a card without permission', function () {
		CreateStubUser('not-owner', ['editor']);
		expect(function () {
			let card_id = 'testCard';
			let cardset_route_id = '123456789';
			assert.exists(Cards.findOne(card_id));
			Meteor.call('deleteCard', card_id, cardset_route_id);
		}).to.throw('not-authorized');
	});

	it('should delete a card in private cardset', function () {
		CreateStubUser('not-owner', ['admin']);
		let card_id = 'testCard2';
		let cardset_route_id = '-1';
		assert.exists(Cards.findOne(card_id));
		Meteor.call('deleteCard', card_id, cardset_route_id);
		assert.notExists(Cards.findOne(card_id));
	});
});

