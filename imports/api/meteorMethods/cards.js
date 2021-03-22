import {Meteor} from "meteor/meteor";
import {Cardsets} from "../subscriptions/cardsets.js";
import {LeitnerCardStats} from "../subscriptions/leitner/leitnerCardStats";
import {Wozniak} from "../subscriptions/wozniak";
import {check} from "meteor/check";
import {UserPermissions} from "../../util/permissions";
import {TranscriptBonus} from "../subscriptions/transcriptBonus";
import {TranscriptBonusList} from "../../util/transcriptBonus";
import {CardType} from "../../util/cardTypes";
import {Cards} from "../subscriptions/cards.js";

Meteor.methods({
	addCard: function (cardset_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, transcriptBonusUser, initialLearningTime, repeatedLearningTime, answers) {
		check(cardset_id, String);
		check(subject, String);
		check(content1, String);
		check(content2, String);
		check(content3, String);
		check(content4, String);
		check(content5, String);
		check(content6, String);
		check(centerTextElement, [Boolean]);
		check(alignType, [Number]);
		check(date, Date);
		check(learningGoalLevel, Number);
		check(backgroundStyle, Number);
		check(initialLearningTime, Number);
		check(repeatedLearningTime, Number);
		check(answers, Object);
		// Make sure the user is logged in and is authorized
		let cardset = Cardsets.findOne(cardset_id);
		let isOwner = false;
		let cardType;
		if (cardset_id === "-1") {
			isOwner = true;
			cardType = 2;
		} else {
			isOwner = UserPermissions.isOwner(cardset.owner);
			cardType = cardset.cardType;
		}

		if (UserPermissions.gotBackendAccess() || isOwner) {
			if (subject === "" && transcriptBonusUser === undefined) {
				throw new Meteor.Error(TAPi18n.__('cardsubject_required', {}, Meteor.user().profile.locale));
			}
			if (transcriptBonusUser) {
				if (!TranscriptBonusList.canBeSubmittedToLecture(transcriptBonusUser, Number(transcriptBonusUser.date_id))) {
					throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
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
				lastEditor: Meteor.userId(),
				learningTime: {
					initial: initialLearningTime,
					repeated: repeatedLearningTime
				},
				answers: answers
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
				if (CardType.getCardTypesWithLearningModes().findIndex(elem => elem === cardset.cardType) >= 0) {
					Meteor.call("updateCurrentBonusPoints", cardset_id);
					Cardsets.find({
						learningActive: true,
						cardGroups: cardset_id
					}).forEach(cardsetElem => Meteor.call("updateCurrentBonusPoints", cardsetElem._id));
				}
			} else {
				Meteor.call('updateTranscriptCount', Meteor.userId());
			}
			return card_id;
		} else {
			throw new Meteor.Error("not-authorized");
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
				let initialLearningTime = -1;
				let repeatedLearningTime = -1;
				let answers = {};
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
				if (card.learningTime !== undefined) {
					initialLearningTime = card.learningTime.initial;
					repeatedLearningTime = card.learningTime.repeated;
				}
				if (card.answers !== undefined) {
					answers = card.answers;
				}
				Meteor.call("addCard", targetCardset_id, card.subject, content1, content2, content3, content4, content5, content6, "0", card.centerTextElement, card.alignType, card.date, card.learningGoalLevel, card.backgroundStyle, Number(initialLearningTime), Number(repeatedLearningTime), answers);
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
				if (CardType.getCardTypesWithLearningModes().findIndex(elem => elem === cardset.cardType) >= 0) {
					Meteor.call("updateCurrentBonusPoints", cardset._id);
					Cardsets.find({
						learningActive: true,
						cardGroups: cardset._id
					}).forEach(cardsetElem => Meteor.call("updateCurrentBonusPoints", cardsetElem._id));
				}
			} else {
				Meteor.call('updateTranscriptCount', Meteor.userId());
			}

			LeitnerCardStats.remove({
				card_id: card_id
			});
			Wozniak.remove({
				card_id: card_id
			});
			return Cardsets.findOne({_id: cardset_route_id}).quantity;
		} else {
			throw new Meteor.Error("not-authorized");
		}
	},
	updateCard: function (card_id, subject, content1, content2, content3, content4, content5, content6, centerTextElement,alignType, learningGoalLevel, backgroundStyle, transcriptBonusUser, initialLearningTime, repeatedLearningTime, answers) {
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
		check(initialLearningTime, Number);
		check(repeatedLearningTime, Number);
		check(answers, Object);
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
					lastEditor: Meteor.userId(),
					learningTime: {
						initial: initialLearningTime,
						repeated: repeatedLearningTime
					},
					answers: answers
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
	},
	getCardMetaData: function (cardset_id) {
		if (Meteor.user()) {
			let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1, cardType: 1}});
			if (UserPermissions.isOwner(cardset.owner) || UserPermissions.gotBackendAccess()) {
				let cardSides = CardType.getCardTypeCubeSides(cardset.cardType);
				let cards = Cards.find({cardset_id: cardset._id}, {fields: {front: 1, back: 1, hint: 1, lecture: 1, top: 1, bottom: 1}}).fetch();
				let metaData = [];
				if (cardSides !== undefined) {
					for (let i = 0; i < cardSides.length; i++) {
						let count = 0;
						for (let c = 0; c < cards.length; c++) {
							if (cards[c][CardType.getContentIDTranslation(cardSides[i].contentId)] !== undefined && cards[c][CardType.getContentIDTranslation(cardSides[i].contentId)].trim().length > 0) {
								count++;
							}
						}
						let active = true;
						if (count === 0) {
							active = false;
						}
						let newSetting = {
							active: active,
							contentId: cardSides[i].contentId,
							count: count
						};
						metaData.push(newSetting);
					}
				}
				return metaData;
			}
		}
		return [];
	}
});
