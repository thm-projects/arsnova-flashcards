import './cardsets.js';
import { Meteor } from "meteor/meteor";
import { assert, expect } from "chai";
import { Cardsets } from './cardsets.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { CreateStubUser } from "./createStubUsers";
import StubCollections from 'meteor/hwillson:stub-collections';
import {Cards} from "./cards";


describe('create cardsets successfully', function () {

	beforeEach(() => {
		resetDatabase();
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('create a new cardset with lower boundary values for cardType, difficulty, cardGroups and sortType', function () {
		CreateStubUser('id', ['admin']);
		let name = "testcardset";
		let description = 'description';
		let visible = true;
		let ratings = true;
		let kind = 'personal';
		let shuffled = true;
		let cardGroups = []; // can be empty
		let cardType = 0; // allowed 0 - 19
		let difficulty = 0; // allowed 0 - 3
		let sortType = 0; // allowed 0 - 1


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

	it('create a new cardset with upper boundary values for cardType, difficulty, cardGroups and sortType', function () {
		CreateStubUser('id', ['admin']);
		let name = "testcardset";
		let description = 'description';
		let visible = true;
		let ratings = true;
		let kind = 'personal';
		let shuffled = true;
		let cardGroups = []; // can be empty
		let cardType = 19; // allowed 0 - 19
		let difficulty = 3; // allowed 0 - 3
		let sortType = 1; // allowed 0 - 1


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

	it('create a new cardset shuffled', function () {
		CreateStubUser('id', ['admin']);
		let name = "testcardset";
		let description = 'description';
		let visible = true;
		let ratings = true;
		let kind = 'personal';
		let shuffled = true;
		let cardGroups = [];
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

	it('create a new cardset not shuffled', function () {
		CreateStubUser('id', ['admin']);
		let name = "testcardset";
		let description = 'description';
		let visible = true;
		let ratings = true;
		let kind = 'personal';
		let shuffled = false;
		let cardGroups = [];
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
		expect([]).to.eql(cardset.cardGroups);
		assert.equal(cardType, cardset.cardType);
		assert.equal(difficulty, cardset.difficulty);
		assert.equal(sortType, cardset.sortType);
		assert.equal(0, cardset.quantity);
	});

	it('create a new cardset with each allowed kind', function () {
		CreateStubUser('id', ['admin']);
		let name = "testcardset";
		let description = 'description';
		let visible = true;
		let ratings = true;
		let kind = 'edu';
		let shuffled = true;
		let cardGroups = []; // can be empty
		let cardType = 0; // allowed 0 - 19
		let difficulty = 0; // allowed 0 - 3
		let sortType = 0; // allowed 0 - 1


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


		kind = 'pro';
		cardsetId = Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		assert.isAbove(cardsetId.length, 0);
		cardset = Cardsets.findOne(cardsetId);
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

		kind = 'personal';
		cardsetId = Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		assert.isAbove(cardsetId.length, 0);
		cardset = Cardsets.findOne(cardsetId);
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

		kind = 'free';
		cardsetId = Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		assert.isAbove(cardsetId.length, 0);
		cardset = Cardsets.findOne(cardsetId);
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
});

describe('create cardsets with wrong parameter values', function () {
	beforeEach(() => {
		resetDatabase();
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail with cardType -1 (allowed 0 - 19)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = -1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw();
	});

	it('should fail with cardType 20 (allowed 0 - 19)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 20;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw();
	});

	it('should fail with difficulty -1 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = -1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw();
	});

	it('should fail with difficulty 4 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 4;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw();
	});

	it('should fail with sortType -1 (allowed 0 - 1)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = -1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw();
	});

	it('should fail with sortType 2 (allowed 0 - 2)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 2;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw();
	});

	it('should fail with not existing cardGroup Id', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = ['abcdefg123'];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw();
	});
});

describe('create cardsets with wrong data types', function () {
	beforeEach(() => {
		resetDatabase();
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail with wrong data type for name', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = 1;
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for description', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 1;
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for visible', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = 'test';
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for ratings', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = 'test';
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for kind', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 1;
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for shuffled', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = 'test';
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for cardGroups', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = 1;
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected array, got 1');
	});

	it('should fail with wrong data type for cardType', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = '1';
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected number, got string');
	});

	it('should fail with wrong data type for difficulty', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = '1';
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected number, got string');
	});

	it('should fail with wrong data type for sortType', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = '1';

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('Match error: Expected number, got string');
	});
});

describe('create cardsets with wrong permissions', function () {
	beforeEach(() => {
		resetDatabase();
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail when only having role "firstLogin"', function () {
		CreateStubUser('id', ['firstLogin']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('not-authorized');
	});

	it('should fail when being blocked"', function () {
		CreateStubUser('id', ['editor', 'blocked']);
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('not-authorized');
	});

});

describe('addCardset when not logged in', function () {
	beforeEach(() => {
		resetDatabase();
	});

	afterEach(() => {
		resetDatabase();
	});

	it('should fail when not logged in', function () {
		expect(function () {
			let name = "testcardset";
			let description = 'description';
			let visible = true;
			let ratings = true;
			let kind = 'personal';
			let shuffled = true;
			let cardGroups = [];
			let cardType = 1;
			let difficulty = 1;
			let sortType = 1;

			Meteor.call('addCardset', name, description, visible, ratings, kind, shuffled, cardGroups, cardType, difficulty, sortType);
		}).to.throw('not-authorized');
	});
});

