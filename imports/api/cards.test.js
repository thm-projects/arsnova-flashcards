import './cards.js';
import { Meteor } from "meteor/meteor";
import { assert, expect } from "chai";
import {Mongo} from "meteor/mongo";
import { Cards } from './cards.js';

describe('addCard', function () {
	beforeEach(() => {
		DDP._CurrentInvocation.get = function () {
			return {
				userId: 'admin'
			};
		};
	});


	it('can create a new card', function () {
		let cardset_id = "-1";
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
		let bonusUser = false;

		let cardId = Meteor.call('addCard', cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, bonusUser);
		assert.isAbove(cardId.length, 0);

		let card = Cards.findOne(cardId);
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
	});

	it('should fail without subject', function () {
		expect(function () {
			let cardset_id = "-1";
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
});

