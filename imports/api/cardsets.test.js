import './cardsets.js';
import { Meteor } from "meteor/meteor";
import { assert, expect } from "chai";
import { Cardsets } from './cardsets.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { CreateStubUser } from "./createStubUsers";
import StubCollections from 'meteor/hwillson:stub-collections';


describe('addCardset', function () {
	beforeEach(() => {
		resetDatabase();
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});


	it('can create a new cardset', function () {
		CreateStubUser(['admin']);
		let name = "testcardset";
		let description = 'description';
		let visible = true;
		let ratings = true;
		let kind = 'test 3';
		let shuffled = true;
		let cardGroups = ["groupname"];
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

	it('should fail with wrong data type for name', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = 1;
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for description', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 1;
			let visible = true;
			let ratings = true;
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for visible', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = 'test';
			let ratings = true;
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for ratings', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = 'test';
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for kind', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 1;
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for shuffled', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'test 3';
			let shuffled = 'test';
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for cardGroups', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = 1;
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected array, got 1');
	});

	it('should fail with wrong data type for cardType', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = '1';
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected number, got string');
	});

	it('should fail with wrong data type for difficulty', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = '1';
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected number, got string');
	});

	it('should fail with wrong data type for sortType', function () {
		CreateStubUser(['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'test 3';
			let shuffled = true;
			let cardGroups = ["groupname"];
			let cardType = 1;
			let difficulty = 1;
			let sortType = '1';

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected number, got string');
	});
});

