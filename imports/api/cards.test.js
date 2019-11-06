import './cards.js';
import { Meteor } from 'meteor/meteor';
import { assert, expect } from 'chai';
import { Cards } from './cards.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { CreateStubUser } from './createStubUsers';
import StubCollections from 'meteor/hwillson:stub-collections';
import { Cardsets } from './cardsets';
import cardsetStubs from "../tests/stubs/cardsets";
import cardStub from "../tests/stubs/cards";
import cloneDeep from 'lodash.clonedeep';
import { cardThresholds } from "../tests/thresholds/cards";


describe('create cards successfully', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(cardsetStubs.normalCardset);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});


	it('create a new card with lower boundary values for alignType, learningGoalLevel and backgroundStyle', function () {
		CreateStubUser('id', ['admin']);

		Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser, function (error, result) {
			if (result) {
				assert.isAbove(result.length, 0);
				let card = Cards.findOne(result);
				assert.equal(cardStub.normalCard.cardset_id, card.cardset_id);
				assert.equal(cardStub.normalCard.subject, card.subject);
				assert.equal(cardStub.normalCard.content1, card.front);
				assert.equal(cardStub.normalCard.content2, card.back);
				assert.equal(cardStub.normalCard.content3, card.hint);
				assert.equal(cardStub.normalCard.content4, card.lecture);
				assert.equal(cardStub.normalCard.content5, card.top);
				assert.equal(cardStub.normalCard.content6, card.bottom);
				expect(cardStub.normalCard.centerTextElement).to.eql(card.centerTextElement);
				expect(cardStub.normalCard.alignType).to.eql(card.alignType);
				expect(cardStub.normalCard.date).to.eql(card.date);
				assert.equal(cardStub.normalCard.learningGoalLevel, card.learningGoalLevel);
				assert.equal(cardStub.normalCard.backgroundStyle, card.backgroundStyle);
				assert.equal(Meteor.userId(), card.owner);
			}
		});
	});

	it('create a new card with upper boundary values for alignType, learningGoalLevel and backgroundStyle', function () {
		CreateStubUser('id', ['admin']);
		let alignType = [0, 0, 3, 0, 0, 0];

		Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser, function (error, result) {
			if (result) {
				assert.isAbove(result.length, 0);
				let card = Cards.findOne(result);
				assert.equal(cardStub.normalCard.cardset_id, card.cardset_id);
				assert.equal(cardStub.normalCard.subject, card.subject);
				assert.equal(cardStub.normalCard.content1, card.front);
				assert.equal(cardStub.normalCard.content2, card.back);
				assert.equal(cardStub.normalCard.content3, card.hint);
				assert.equal(cardStub.normalCard.content4, card.lecture);
				assert.equal(cardStub.normalCard.content5, card.top);
				assert.equal(cardStub.normalCard.content6, card.bottom);
				expect(cardStub.normalCard.centerTextElement).to.eql(card.centerTextElement);
				expect(alignType).to.eql(card.alignType);
				expect(cardStub.normalCard.date).to.eql(card.date);
				assert.equal(cardStub.normalCard.learningGoalLevel, card.learningGoalLevel);
				assert.equal(cardStub.normalCard.backgroundStyle, card.backgroundStyle);
				assert.equal(Meteor.userId(), card.owner);
			}
		});
	});
});


describe('create cards with wrong parameter values', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(cardsetStubs.normalCardset);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should fail with invalid cardset_id', function () {
		CreateStubUser('id', ['admin']);

		expect(function () {
			let cardset_id = "25627";

			Meteor.call('addCard', cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.cardset_id.not-valid', {}, Meteor.user().profile.locale));
	});

	it('should fail with empty subject', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let subject = '';

			Meteor.call('addCard', cardStub.normalCard.cardset_id, subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.subject.empty', {}, Meteor.user().profile.locale));
	});

	it('should fail with alignType values including -1 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let alignType = [0, 0, (cardThresholds.alignType.min - 1), 0, 0, 0];

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.alignType.min', {threshold: cardThresholds.alignType.max}, Meteor.user().profile.locale));
	});

	it('should fail with alignType values including 4 (allowed 0 - 3)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let alignType = [0, 0, (cardThresholds.alignType.max + 1), 0, 0, 0];
			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.alignType.max', {threshold: cardThresholds.alignType.max}, Meteor.user().profile.locale));
	});

	it('should fail with learningGoalLevel -1 (allowed 0 - 5)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let learningGoalLevel = cardThresholds.learningGoalLevel.min - 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.learningGoalLevel.min', {threshold: cardThresholds.learningGoalLevel.min}, Meteor.user().profile.locale));
	});

	it('should fail with learningGoalLevel 6 (allowed 0 - 5)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let learningGoalLevel = cardThresholds.learningGoalLevel.max + 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.learningGoalLevel.max', {threshold: cardThresholds.learningGoalLevel.max}, Meteor.user().profile.locale));
	});

	it('should fail with backgroundStyle -1 (allowed 0 - 1)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let backgroundStyle = cardThresholds.backgroundStyle.min - 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.backgroundStyle.min', {threshold: cardThresholds.backgroundStyle.min}, Meteor.user().profile.locale));
	});

	it('should fail with backgroundStyle 2 (allowed 0 - 1)', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let backgroundStyle = cardThresholds.backgroundStyle.max + 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.backgroundStyle.max', {threshold: cardThresholds.backgroundStyle.max}, Meteor.user().profile.locale));
	});
});

describe('create cards with wrong permissions', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		let cardset = cloneDeep(cardsetStubs.normalCardset);
		cardset.owner = "no-owner";
		Cardsets.insert(cardset);
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
			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.user.not-authorized', {}, Meteor.user().profile.locale));
	});

	it('should fail when first login', function () {
		CreateStubUser('id', ['admin', 'blocked']);
		expect(function () {
			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.user.not-authorized', {}, Meteor.user().profile.locale));
	});

	it('should fail when not logged in', function () {
		expect(function () {
			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.user.not-authorized', {}, 'en'));
		// ****************************************************************
		// Only used for cleanup
		CreateStubUser('id', ['admin', 'blocked']);
	});
});

describe('create cards with wrong data types', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		Cardsets.insert(cardsetStubs.normalCardset);
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
			Meteor.call('addCard', cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.cardset_id.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for subject', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let subject = 1;
			Meteor.call('addCard', cardStub.normalCard.cardset_id, subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.subject.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for content1', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let content1 = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.content.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for content2', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let content2 = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.content.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for content3', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let content3 = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.content.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for content4', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let content4 = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.content.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for content5', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let content5 = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.content.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for content6', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let content6 = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.content.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for centerTextElement', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let centerTextElement = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.centerTextElement.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for alignType', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let alignType = '1';

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.alignType.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for date', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let date = 1;

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, date, cardStub.normalCard.learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.date.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for learningGoalLevel', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let learningGoalLevel = '0';

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, learningGoalLevel, cardStub.normalCard.backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.learningGoalLevel.wrong-type', {}, Meteor.user().profile.locale));
	});

	it('should fail with wrong data type for backgroundStyle', function () {
		CreateStubUser('id', ['admin']);
		expect(function () {
			let backgroundStyle = '0';

			Meteor.call('addCard', cardStub.normalCard.cardset_id, cardStub.normalCard.subject, cardStub.normalCard.content1, cardStub.normalCard.content2, cardStub.normalCard.content3, cardStub.normalCard.content4, cardStub.normalCard.content5, cardStub.normalCard.content6, cardStub.normalCard.centerTextElement, cardStub.normalCard.alignType, cardStub.normalCard.date, cardStub.normalCard.learningGoalLevel, backgroundStyle, cardStub.normalCard.bonusUser);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.cards.backgroundStyle.wrong-type', {}, Meteor.user().profile.locale));
	});
});


describe('deleteCard', function () {
	beforeEach(() => {
		resetDatabase();

		StubCollections.stub(Cardsets);
		let tempCardset = cloneDeep(cardsetStubs.normalCardset);
		tempCardset._id = 'testCardset1';
		tempCardset.owner = 'testUser';
		Cardsets.insert(tempCardset);

		tempCardset._id = 'testCardset2';
		tempCardset.name = 'TestCardSet2';
		Cardsets.insert(tempCardset);

		StubCollections.stub(Cards);
		let tempCard = cloneDeep(cardStub.normalCard);
		tempCard._id = 'testCard1';
		tempCard.cardset_id = 'testCardset1';
		tempCard.owner = 'testUser';
		Cards.insert(tempCard);

		tempCard._id = 'testCard2';
		tempCard.cardset_id = 'testCardset2';
		tempCard.owner = 'testUser';
		Cards.insert(tempCard);
	});

	afterEach(() => {
		Meteor.user.restore();
		Meteor.userId.restore();
		StubCollections.restore();
		resetDatabase();
	});

	it('should delete a card as admin', function () {
		CreateStubUser('testAdmin', ['admin']);
		let card_id = 'testCard1';
		let cardset_id = 'testCardset1';
		assert.exists(Cards.findOne(card_id));
		Meteor.call('deleteCard', card_id, cardset_id);
		assert.notExists(Cards.findOne(card_id));
	});

	it('should delete a card as owner', function () {
		CreateStubUser('testUser', ['editor']);
		let card_id = 'testCard1';
		let cardset_id = 'testCardset1';
		assert.exists(Cards.findOne(card_id));
		Meteor.call('deleteCard', card_id, cardset_id);
		assert.notExists(Cards.findOne(card_id));
	});

	it('should not delete a card without permission', function () {
		CreateStubUser('not-owner', ['editor']);
		expect(function () {
			let card_id = 'testCard2';
			let cardset_route_id = 'testCardset2';
			assert.exists(Cards.findOne(card_id));
			Meteor.call('deleteCard', card_id, cardset_route_id);
		}).to.throw(Meteor.Error(), TAPi18n.__('error.user.not-authorized', {}, 'en'));
	});
});
