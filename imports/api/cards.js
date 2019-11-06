import {Meteor} from "meteor/meteor";
import {Cardsets} from "./subscriptions/cardsets.js";
import {Leitner} from "./subscriptions/leitner";
import {Wozniak} from "./subscriptions/wozniak";
import {check, Match} from "meteor/check";
import {UserPermissions} from "./permissions";
import {TranscriptBonus} from "./subscriptions/transcriptBonus";
import {TranscriptBonusList} from "./transcriptBonus";
import {CardType} from "./cardTypes";
import {Cards} from "./subscriptions/cards.js";
import { cardThresholds } from "../tests/thresholds/cards";
import testHelpers from "../tests/helpers";

Meteor.methods({
	addCard: function (cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, transcriptBonusUser) {
		let cardset;
		if (!Match.test(cardset_id, String)) {
			throw new Meteor.Error(TAPi18n.__('error.cards.cardset_id.wrong-type', {}, Meteor.user().profile.locale));
		}
		if (cardset_id !== "-1") {
			cardset = Cardsets.findOne(cardset_id);
			if (!cardset) {
				throw new Meteor.Error(TAPi18n.__('error.cards.cardset_id.not-valid', {}, Meteor.user().profile.locale));
			}
		}
		if (!Match.test(subject, String)) {
			throw new Meteor.Error(TAPi18n.__('error.cards.subject.wrong-type', {}, Meteor.user().profile.locale));
		}
		if (!subject.trim().length) {
			throw new Meteor.Error(TAPi18n.__('error.cards.subject.empty', {}, Meteor.user().profile.locale));
		}
		let content = [content1, content2, content3, content4, content5, content6];
		for (let i = 0; i < content.length; i++) {
			if (!Match.test(content[i], String)) {
				throw new Meteor.Error(TAPi18n.__('error.cards.content.wrong-type', {}, Meteor.user().profile.locale));
			}
		}
		if (!Match.test(centerTextElement, [Boolean])) {
			throw new Meteor.Error(TAPi18n.__('error.cards.centerTextElement.wrong-type', {}, Meteor.user().profile.locale));
		}
		if (!Match.test(alignType, [Number])) {
			throw new Meteor.Error(TAPi18n.__('error.cards.alignType.wrong-type', {}, Meteor.user().profile.locale));
		}
		if (testHelpers.matchAny(alignType, cardThresholds.alignType.min, 0)) {
			throw new Meteor.Error(TAPi18n.__('error.cards.alignType.min', {threshold: cardThresholds.alignType.min}, Meteor.user().profile.locale));
		}
		if (testHelpers.matchAny(alignType, cardThresholds.alignType.max, 4)) {
			throw new Meteor.Error(TAPi18n.__('error.cards.alignType.max', {threshold: cardThresholds.alignType.max}, Meteor.user().profile.locale));
		}
		if (!Match.test(date, Date)) {
			throw new Meteor.Error(TAPi18n.__('error.cards.date.wrong-type', {}, Meteor.user().profile.locale));
		}
		if (!Match.test(learningGoalLevel, Number)) {
			throw new Meteor.Error(TAPi18n.__('error.cards.learningGoalLevel.wrong-type', {}, Meteor.user().profile.locale));
		}
		if (learningGoalLevel < cardThresholds.learningGoalLevel.min) {
			throw new Meteor.Error(TAPi18n.__('error.cards.learningGoalLevel.min', {threshold: cardThresholds.learningGoalLevel.min}, Meteor.user().profile.locale));
		} else if (learningGoalLevel > cardThresholds.learningGoalLevel.max) {
			throw new Meteor.Error(TAPi18n.__('error.cards.learningGoalLevel.max', {threshold: cardThresholds.learningGoalLevel.max}, Meteor.user().profile.locale));
		}
		if (!Match.test(backgroundStyle, Number)) {
			throw new Meteor.Error(TAPi18n.__('error.cards.backgroundStyle.wrong-type', {}, Meteor.user().profile.locale));
		}
		if (backgroundStyle < cardThresholds.backgroundStyle.min) {
			throw new Meteor.Error(TAPi18n.__('error.cards.backgroundStyle.min', {threshold: cardThresholds.learningGoalLevel.min}, Meteor.user().profile.locale));
		} else if (backgroundStyle > cardThresholds.backgroundStyle.max) {
			throw new Meteor.Error(TAPi18n.__('error.cards.backgroundStyle.max', {threshold: cardThresholds.learningGoalLevel.max}, Meteor.user().profile.locale));
		}
		// Make sure the user is logged in and is authorized
		let isOwner = false;
		let cardType;
		if (cardset_id === "-1") {
			isOwner = true;
			cardType = 2;
		} else {
			isOwner = UserPermissions.isOwner(cardset.owner);
			cardType = cardset.cardType;
		}

		if ((UserPermissions.gotBackendAccess() || isOwner) && UserPermissions.isNotBlockedOrFirstLogin()) {
			if (subject === "" && transcriptBonusUser === undefined) {
				throw new Meteor.Error(TAPi18n.__('cardsubject_required', {}, Meteor.user().profile.locale));
			}
			if (transcriptBonusUser) {
				if (!TranscriptBonusList.canBeSubmittedToLecture(transcriptBonusUser, Number(transcriptBonusUser.date_id))) {
					throw new Meteor.Error(TAPi18n.__('error.cards.transcriptBonus.deadline-expired', {}, Meteor.user().profile.locale));
				}
			}
			let card_id = Cards.insert({
				subject: subject.trim(),
				front: content1,
				back: content2,
				hint: content3,
				lecture: content4,
				top: content5,
				bottom: content6,
				cardset_id: cardset_id,
				centerTextElement: centerTextElement,
				alignType: alignType,
				date: date,
				learningGoalLevel: learningGoalLevel,
				backgroundStyle: backgroundStyle,
				owner: Meteor.userId(),
				cardType: cardType,
				dateUpdated: new Date(),
				lastEditor: Meteor.userId()
			}, {trimStrings: false});
			if (transcriptBonusUser) {
				Meteor.call("addTranscriptBonus", card_id, transcriptBonusUser.cardset_id, Meteor.userId(), Number(transcriptBonusUser.date_id));
			}
			if (cardset_id !== "-1") {
				Cardsets.update(cardset_id, {
					$set: {
						quantity: Cards.find({cardset_id: cardset_id}).count(),
						dateUpdated: new Date(),
						lastEditor: Meteor.userId()
					}
				});
				Meteor.call('updateShuffledCardsetQuantity', cardset_id);
				let cardsets = Cardsets.find({
					$or: [
						{_id: cardset_id},
						{cardGroups: {$in: [cardset_id]}}
					]
				}, {fields: {_id: 1}}).fetch();
				for (let i = 0; i < cardsets.length; i++) {
					Meteor.call('updateLeitnerCardIndex', cardsets[i]._id);
				}
			} else {
				Meteor.call('updateTranscriptCount', Meteor.userId());
			}
			return card_id;
		} else {
			if (Meteor.userId()) {
				throw new Meteor.Error(TAPi18n.__('error.user.not-authorized', {}, Meteor.user().profile.locale));
			} else {
				throw new Meteor.Error(TAPi18n.__('error.user.not-authorized', {}, 'en'));
			}
		}
	},
	copyCard: function (sourceCardset_id, targetCardset_id, card_id) {
		check(sourceCardset_id, String);
		check(targetCardset_id, String);
		check(card_id, String);
		let cardset = Cardsets.findOne(sourceCardset_id);
		let isOwner = false;
		if (sourceCardset_id === "-1") {
			isOwner = true;
		} else {
			isOwner = UserPermissions.isOwner(cardset.owner);
		}
		if (UserPermissions.isAdmin() || isOwner) {
			let card = Cards.findOne(card_id);
			if (card !== undefined) {
				let content1 = "";
				let content2 = "";
				let content3 = "";
				let content4 = "";
				let content5 = "";
				let content6 = "";
				if (card.front !== undefined) {
					content1 = card.front;
				}
				if (card.back !== undefined) {
					content2 = card.back;
				}
				if (card.hint !== undefined) {
					content3 = card.hint;
				}
				if (card.lecture !== undefined) {
					content4 = card.lecture;
				}
				if (card.top !== undefined) {
					content5 = card.top;
				}
				if (card.bottom !== undefined) {
					content6 = card.bottom;
				}
				Meteor.call("addCard", targetCardset_id, card.subject, content1, content2, content3, content4, content5, content6, "0", card.centerTextElement, card.alignType, card.date, card.learningGoalLevel, card.backgroundStyle);
				return true;
			}
		} else {
			throw new Meteor.Error("not-authorizedmyBonusTranscriptCards");
		}
	},
	deleteTranscript: function (card_id) {
		let card = Cards.findOne(card_id);
		if (card.owner === Meteor.userId() || UserPermissions.gotBackendAccess()) {
			let result = Cards.remove(card_id);
			let transcriptBonus = TranscriptBonus.findOne({card_id: card_id});
			TranscriptBonus.remove({card_id: card_id});
			Meteor.call('updateTranscriptBonusStats', transcriptBonus.cardset_id);
			Meteor.call('updateTranscriptCount', Meteor.userId());
			return result;
		}
	},
	deleteCard: function (card_id, cardset_route_id) {
		check(card_id, String);
		check(cardset_route_id, String);
		let card = Cards.findOne(card_id);
		let cardset = Cardsets.findOne(card.cardset_id);
		if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
			var countCards = Cards.find({cardset_id: cardset._id}).count();
			if (countCards < 1 && !CardType.gotTranscriptBonus(cardset.cardType)) {
				Cardsets.update(cardset._id, {
					$set: {
						kind: 'personal',
						reviewed: false,
						request: false,
						visible: false
					}
				});
			}

			Cards.remove(card_id);
			if (card.cardset_id !== "-1") {
				Cardsets.update(card.cardset_id, {
					$set: {
						quantity: Cards.find({cardset_id: card.cardset_id}).count(),
						dateUpdated: new Date()
					}
				});

				Meteor.call('updateShuffledCardsetQuantity', cardset._id);
			} else {
				Meteor.call('updateTranscriptCount', Meteor.userId());
			}

			Leitner.remove({
				card_id: card_id
			});
			Wozniak.remove({
				card_id: card_id
			});
			return Cardsets.findOne({_id: cardset_route_id}).quantity;
		} else {
			if (Meteor.userId()) {
				throw new Meteor.Error(TAPi18n.__('error.user.not-authorized', {}, Meteor.user().profile.locale));
			} else {
				throw new Meteor.Error(TAPi18n.__('error.user.not-authorized', {}, 'en'));
			}
		}
	},
	updateCard: function (card_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement,alignType, learningGoalLevel, backgroundStyle, transcriptBonusUser) {
		check(card_id, String);
		check(subject, String);
		check(content1, String);
		check(content2, String);
		check(content3, String);
		check(content4, String);
		check(content5, String);
		check(content6, String);
		check(centerTextElement, [Boolean]);
		check(alignType, [Number]);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
		let card = Cards.findOne(card_id);
		let cardset = Cardsets.findOne(card.cardset_id);
		let isOwner = false;
		if (transcriptBonusUser === null) {
			transcriptBonusUser = undefined;
		}
		let transcriptBonusDatabase = TranscriptBonus.findOne({card_id: card_id});
		if (card.cardset_id === "-1" && card.owner === Meteor.userId()) {
			isOwner = true;
		} else {
			isOwner = UserPermissions.isOwner(cardset.owner);
		}
		if (UserPermissions.isAdmin() || isOwner) {
			if (subject === "" && transcriptBonusUser === undefined) {
				throw new Meteor.Error(TAPi18n.__('cardsubject_required', {}, Meteor.user().profile.locale));
			}
			if (transcriptBonusUser === undefined) {
				TranscriptBonus.remove({card_id: card_id});
			} else {
				if (transcriptBonusDatabase === undefined) {
					if (!TranscriptBonusList.canBeSubmittedToLecture(transcriptBonusUser, Number(transcriptBonusUser.date_id))) {
						throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
					}
					Meteor.call("addTranscriptBonus", card_id, transcriptBonusUser.cardset_id, Meteor.userId(), Number(transcriptBonusUser.date_id));
				} else {
					if (TranscriptBonusList.isDeadlineExpired(transcriptBonusDatabase, true)) {
						throw new Meteor.Error(TAPi18n.__('transcriptForm.server.deadlineExpired', {}, Meteor.user().profile.locale));
					}
					TranscriptBonusList.checkForUpdate(card_id, Meteor.userId(), transcriptBonusUser, transcriptBonusDatabase, transcriptBonusUser.date_id);
				}
			}
			Cards.update(card_id, {
				$set: {
					subject: subject.trim(),
					front: content1,
					back: content2,
					hint: content3,
					lecture: content4,
					top: content5,
					bottom: content6,
					centerTextElement: centerTextElement,
					alignType: alignType,
					learningGoalLevel: learningGoalLevel,
					backgroundStyle: backgroundStyle,
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			}, {trimStrings: false});
			Cardsets.update(card.cardset_id, {
				$set: {
					dateUpdated: new Date(),
					lastEditor: Meteor.userId()
				}
			});
			return true;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	}
});
