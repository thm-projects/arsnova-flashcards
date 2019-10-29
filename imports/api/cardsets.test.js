import './cardsets.js';
import {Meteor} from "meteor/meteor";
import {assert, expect} from "chai";
import {Cardsets} from './cardsets.js';
import {resetDatabase} from 'meteor/xolvio:cleaner';
import {CreateStubUser} from "./createStubUsers";
import StubCollections from 'meteor/hwillson:stub-collections';
import cardsetStubs from "../tests/stubs/cardsets";

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

	it('create a new cardset with lower boundary values for cardType, difficulty, cardGroups and sortType', function (done) {
		CreateStubUser('id', ['admin']);
		let cardGroups = []; // can be empty
		let cardType = 0; // allowed 0 - 19
		let difficulty = 0; // allowed 0 - 3
		let sortType = 0; // allowed 0 - 1


		Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardGroups, cardType, difficulty, sortType, function (error, result) {
			if (error) {
				done(error);
			} else {
				let cardset = Cardsets.findOne(result);

				assert.equal(cardsetStubs.normalCardset.name, cardset.name);
				assert.equal(cardsetStubs.normalCardset.description, cardset.description);
				assert.equal(cardsetStubs.normalCardset.visible, cardset.visible);
				assert.equal(cardsetStubs.normalCardset.ratings, cardset.ratings);
				assert.equal(cardsetStubs.normalCardset.kind, cardset.kind);
				assert.equal(cardsetStubs.normalCardset.shuffled, cardset.shuffled);
				expect(cardGroups).to.eql(cardset.cardGroups);
				assert.equal(cardType, cardset.cardType);
				assert.equal(difficulty, cardset.difficulty);
				assert.equal(sortType, cardset.sortType);
				done();
			}
		});
	});

	it('create a new cardset with upper boundary values for cardType, difficulty, cardGroups and sortType', function (done) {
		CreateStubUser('id', ['admin']);
		let cardGroups = []; // can be empty
		let cardType = 19; // allowed 0 - 19
		let difficulty = 3; // allowed 0 - 3
		let sortType = 1; // allowed 0 - 1
		let kind = 'edu'; // TranscriptBonus is always edu
		let result;

		result = Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, kind, cardsetStubs.normalCardset.shuffled, cardGroups, cardType, difficulty, sortType);
		if (result) {
			let cardset = Cardsets.findOne(result);
			assert.equal(cardsetStubs.normalCardset.name, cardset.name);
			assert.equal(cardsetStubs.normalCardset.description, cardset.description);
			assert.equal(cardsetStubs.normalCardset.visible, cardset.visible);
			assert.equal(cardsetStubs.normalCardset.ratings, cardset.ratings);
			assert.equal(kind, cardset.kind);
			assert.equal(cardsetStubs.normalCardset.shuffled, cardset.shuffled);
			expect(cardGroups).to.eql(cardset.cardGroups);
			assert.equal(cardType, cardset.cardType);
			assert.equal(difficulty, cardset.difficulty);
			assert.equal(sortType, cardset.sortType);
			done();
		}
	});

	let shuffledSettings = ['', 'shuffled '];
	shuffledSettings.forEach(function (element) {
		it('create a new ' + element + 'cardset', function (done) {
			CreateStubUser('id', ['admin']);
			let shuffled = true;
			if (element === '') {
				shuffled = false;
			}
			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType, function (error, result) {
				if (error) {
					done(error);
				} else {
					let cardset = Cardsets.findOne(result);

					assert.equal(cardsetStubs.normalCardset.name, cardset.name);
					assert.equal(cardsetStubs.normalCardset.description, cardset.description);
					assert.equal(cardsetStubs.normalCardset.visible, cardset.visible);
					assert.equal(cardsetStubs.normalCardset.ratings, cardset.ratings);
					assert.equal(cardsetStubs.normalCardset.kind, cardset.kind);
					assert.equal(shuffled, cardset.shuffled);
					expect(cardsetStubs.normalCardset.cardGroups).to.eql(cardset.cardGroups);
					assert.equal(cardsetStubs.normalCardset.cardType, cardset.cardType);
					assert.equal(cardsetStubs.normalCardset.difficulty, cardset.difficulty);
					assert.equal(cardsetStubs.normalCardset.sortType, cardset.sortType);
					done();
				}
			});
		});
	});

	let kindSettings = ['edu', 'pro', 'personal', 'free'];
	kindSettings.forEach(function (kind) {
		it('create a new cardset with kind "' + kind + '"', function (done) {
			CreateStubUser('id', ['admin']);
			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType, function (error, result) {
				if (error) {
					done(error);
				} else {
					let cardset = Cardsets.findOne(result);

					assert.equal(cardsetStubs.normalCardset.name, cardset.name);
					assert.equal(cardsetStubs.normalCardset.description, cardset.description);
					assert.equal(cardsetStubs.normalCardset.visible, cardset.visible);
					assert.equal(cardsetStubs.normalCardset.ratings, cardset.ratings);
					assert.equal(kind, cardset.kind);
					assert.equal(cardsetStubs.normalCardset.shuffled, cardset.shuffled);
					expect(cardsetStubs.normalCardset.cardGroups).to.eql(cardset.cardGroups);
					assert.equal(cardsetStubs.normalCardset.cardType, cardset.cardType);
					assert.equal(cardsetStubs.normalCardset.difficulty, cardset.difficulty);
					assert.equal(cardsetStubs.normalCardset.sortType, cardset.sortType);
					done();
				}
			});
		});
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
			let cardType = -1;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw();
	});

	it('should fail with cardType 20 (allowed 0 - 19)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardType = 20;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw();
	});

	it('should fail with difficulty -1 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let difficulty = -1;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw();
	});

	it('should fail with difficulty 4 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let difficulty = 4;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw();
	});

	it('should fail with sortType -1 (allowed 0 - 1)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let sortType = -1;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, sortType);
		}).to.throw();
	});

	it('should fail with sortType 2 (allowed 0 - 1)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let sortType = 2;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, sortType);
		}).to.throw();
	});

	it('should fail with not existing cardGroup Id', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardGroups = ['abcdefg123'];
			let shuffled = true;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, shuffled, cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
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

			Meteor.call('addCardset', name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for description', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let description = 1;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for visible', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let visible = 'test';

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for ratings', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let ratings = 'test';

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for kind', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let kind = 1;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected string, got number');
	});

	it('should fail with wrong data type for shuffled', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let shuffled = 'test';

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected boolean, got string');
	});

	it('should fail with wrong data type for cardGroups', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardGroups = 1;
			let shuffled = true;

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, shuffled, cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw();
	});

	it('should fail with wrong data type for cardType', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let cardType = '1';

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected number, got string');
	});

	it('should fail with wrong data type for difficulty', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let difficulty = '1';

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('Match error: Expected number, got string');
	});

	it('should fail with wrong data type for sortType', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let sortType = '1';

			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, sortType);
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
			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('not-authorized');
	});

	it('should fail when having role "firstLogin" as "admin"', function () {
		CreateStubUser('id', ['firstLogin', 'admin']);
		expect(function () {
			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('not-authorized');
	});

	it('should fail when not logged in', function () {
		expect(function () {
			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('not-authorized');
		// *************************************************
		// Just used to clean up the user after every test
		CreateStubUser('id', ['firstLogin', 'admin']);
	});

	it('should fail when being "blocked"', function () {
		CreateStubUser('id', ['editor', 'blocked']);
		expect(function () {
			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('not-authorized');
	});

	it('should fail to create a bonus transcript cardset without being lecturer or admin', function () {
		CreateStubUser('id', ['pro']);
		expect(function () {
			Meteor.call('addCardset', cardsetStubs.transcriptBonusCardset.name, cardsetStubs.transcriptBonusCardset.description, cardsetStubs.transcriptBonusCardset.visible, cardsetStubs.transcriptBonusCardset.ratings, cardsetStubs.transcriptBonusCardset.kind, cardsetStubs.transcriptBonusCardset.shuffled, cardsetStubs.transcriptBonusCardset.cardGroups, cardsetStubs.transcriptBonusCardset.cardType, cardsetStubs.transcriptBonusCardset.difficulty, cardsetStubs.transcriptBonusCardset.sortType);
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
			Meteor.call('addCardset', cardsetStubs.normalCardset.name, cardsetStubs.normalCardset.description, cardsetStubs.normalCardset.visible, cardsetStubs.normalCardset.ratings, cardsetStubs.normalCardset.kind, cardsetStubs.normalCardset.shuffled, cardsetStubs.normalCardset.cardGroups, cardsetStubs.normalCardset.cardType, cardsetStubs.normalCardset.difficulty, cardsetStubs.normalCardset.sortType);
		}).to.throw('not-authorized');
	});
});

