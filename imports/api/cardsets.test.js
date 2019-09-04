import './cardsets.js';
import { Meteor } from "meteor/meteor";
import { assert, expect } from "chai";
import { Cards } from './cardsets.js';

describe('addCardset', function () {
	beforeEach(() => {
		DDP._CurrentInvocation.get = function () {
			return {
				userId: 'admin'
			};
		};
	});


	it('can create a new cardset', function () {
		let name = "testcardset";
		let description = 'description';
		let visible = true;
		let ratings = true;
		let kind = 'test 3';
		let shuffled = true;
		let cardGroups = "groupname"
		let cardType = 1;
		let difficulty = 1;
		let sortType = 1;


		let cardsetId = Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		assert.isAbove(cardsetId.length, 0);

		/*let card = Cards.findOne(cardId);
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
		assert.equal(backgroundStyle, card.backgroundStyle);*/
	});
});

