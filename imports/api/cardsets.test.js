import './cardsets.js';
import { Meteor } from "meteor/meteor";
import { assert, expect } from "chai";
import { Cardsets } from './cardsets.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { CreateStubUser } from "./createStubUsers";
import StubCollections from 'meteor/hwillson:stub-collections';
import {Cards} from "./cards";


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

		let cardset = Cardsets.findOne(cardsetId);

		assert.equal(name, cardset.name);
		assert.equal(description, cardset.description);
		assert.equal(visible, cardset.visible);
		assert.equal(ratings, cardset.ratings);
		assert.equal(kind, cardset.kind);
		assert.equal(shuffled, cardset.shuffled);
		expect(cardGroups).to.eql(cardset.cardGroups);
		assert.equal(cardType, cardset.cardType);
		assert.equal(difficulty, cardset.difficulty);
		assert.equal(sortType, cardset.sortType);

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

