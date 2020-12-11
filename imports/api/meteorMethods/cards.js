import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { TAPi18n } from 'meteor/tap:i18n';
import { Cardsets } from '../subscriptions/cardsets.js';
import { Leitner } from '../subscriptions/leitner';
import { Wozniak } from '../subscriptions/wozniak';
import { UserPermissions } from '../../util/permissions';
import { TranscriptBonus } from '../subscriptions/transcriptBonus';
import { TranscriptBonusList } from '../../util/transcriptBonus';
import { CardType } from '../../util/cardTypes';
import { Cards } from '../subscriptions/cards.js';

Meteor.methods({
  addCard(cardsetId, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, date, learningGoalLevel, backgroundStyle, transcriptBonusUser, initialLearningTime, repeatedLearningTime, answers) {
    check(cardsetId, String);
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
    check(transcriptBonusUser, Match.Maybe(Object));
    check(initialLearningTime, Number);
    check(repeatedLearningTime, Number);
    check(answers, Object);
    // Make sure the user is logged in and is authorized
    const cardset = Cardsets.findOne(cardsetId);
    let isOwner = false;
    let cardType;
    if (cardsetId === '-1') {
      isOwner = true;
      cardType = 2;
    } else {
      isOwner = UserPermissions.isOwner(cardset.owner);
      cardType = cardset.cardType;
    }

    if (UserPermissions.gotBackendAccess() || isOwner) {
      if (subject === '' && transcriptBonusUser === undefined) {
        throw new Meteor.Error(TAPi18n.__('cardsubject_required', {}, Meteor.user().profile.locale));
      }
      if (transcriptBonusUser) {
        if (!TranscriptBonusList.canBeSubmittedToLecture(transcriptBonusUser, Number(transcriptBonusUser.date_id))) {
          throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
        }
      }
      const cardId = Cards.insert({
        subject: subject.trim(),
        front: content1,
        back: content2,
        hint: content3,
        lecture: content4,
        top: content5,
        bottom: content6,
        cardset_id: cardsetId,
        centerTextElement,
        alignType,
        date,
        learningGoalLevel,
        backgroundStyle,
        owner: Meteor.userId(),
        cardType,
        dateUpdated: new Date(),
        lastEditor: Meteor.userId(),
        learningTime: {
          initial: initialLearningTime,
          repeated: repeatedLearningTime,
        },
        answers,
      }, { trimStrings: false });
      if (transcriptBonusUser) {
        Meteor.call('addTranscriptBonus', cardId, transcriptBonusUser.cardset_id, Meteor.userId(), Number(transcriptBonusUser.date_id));
      }
      if (cardsetId !== '-1') {
        Cardsets.update(cardsetId, {
          $set: {
            quantity: Cards.find({ cardset_id: cardsetId }).count(),
            dateUpdated: new Date(),
            lastEditor: Meteor.userId(),
          },
        });
        Meteor.call('updateShuffledCardsetQuantity', cardsetId);
        const cardsets = Cardsets.find({
          $or: [
            { _id: cardsetId },
            { cardGroups: { $in: [cardsetId] } },
          ],
        }, { fields: { _id: 1 } }).fetch();
        for (let i = 0; i < cardsets.length; i += 1) {
          Meteor.call('updateLeitnerCardIndex', cardsets[i]._id);
        }
      } else {
        Meteor.call('updateTranscriptCount', Meteor.userId());
      }
      return cardId;
    }
    throw new Meteor.Error('not-authorized');
  },
  copyCard(sourceCardsetId, targetCardsetId, cardId) {
    check(sourceCardsetId, String);
    check(targetCardsetId, String);
    check(cardId, String);
    const cardset = Cardsets.findOne(sourceCardsetId);
    let isOwner = false;
    if (sourceCardsetId === '-1') {
      isOwner = true;
    } else {
      isOwner = UserPermissions.isOwner(cardset.owner);
    }
    if (UserPermissions.isAdmin() || isOwner) {
      const card = Cards.findOne(cardId);
      if (card !== undefined) {
        let content1 = '';
        let content2 = '';
        let content3 = '';
        let content4 = '';
        let content5 = '';
        let content6 = '';
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
        Meteor.call('addCard', targetCardsetId, card.subject, content1, content2, content3, content4, content5, content6, '0', card.centerTextElement, card.alignType, card.date, card.learningGoalLevel, card.backgroundStyle, Number(initialLearningTime), Number(repeatedLearningTime), answers);
        return true;
      }
    } else {
      throw new Meteor.Error('not-authorizedmyBonusTranscriptCards');
    }
    return false;
  },
  deleteTranscript(cardId) {
    check(cardId, String);

    const card = Cards.findOne(cardId);
    if (card.owner === Meteor.userId() || UserPermissions.gotBackendAccess()) {
      const result = Cards.remove(cardId);
      const transcriptBonus = TranscriptBonus.findOne({ card_id: cardId });
      TranscriptBonus.remove({ card_id: cardId });
      Meteor.call('updateTranscriptBonusStats', transcriptBonus.cardset_id);
      Meteor.call('updateTranscriptCount', Meteor.userId());
      return result;
    }
    return [];
  },
  deleteCard(cardId, cardsetRouteId) {
    check(cardId, String);
    check(cardsetRouteId, String);

    const card = Cards.findOne(cardId);
    const cardset = Cardsets.findOne(card.cardset_id);
    if (UserPermissions.gotBackendAccess() || UserPermissions.isOwner(cardset.owner)) {
      const countCards = Cards.find({ cardset_id: cardset._id }).count();
      if (countCards < 1 && !CardType.gotTranscriptBonus(cardset.cardType)) {
        Cardsets.update(cardset._id, {
          $set: {
            kind: 'personal',
            reviewed: false,
            request: false,
            visible: false,
          },
        });
      }

      Cards.remove(cardId);
      if (card.cardset_id !== '-1') {
        Cardsets.update(card.cardset_id, {
          $set: {
            quantity: Cards.find({ cardset_id: card.cardset_id }).count(),
            dateUpdated: new Date(),
          },
        });

        Meteor.call('updateShuffledCardsetQuantity', cardset._id);
      } else {
        Meteor.call('updateTranscriptCount', Meteor.userId());
      }

      Leitner.remove({
        card_id: cardId,
      });
      Wozniak.remove({
        card_id: cardId,
      });
      return Cardsets.findOne({ _id: cardsetRouteId }).quantity;
    }
    throw new Meteor.Error('not-authorized');
  },
  updateCard(cardId, subject, content1, content2, content3, content4, content5, content6, centerTextElement, alignType, learningGoalLevel, backgroundStyle, transcriptBonusUser, initialLearningTime, repeatedLearningTime, answers) {
    check(cardId, String);
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
    check(transcriptBonusUser, Match.Maybe(Object));
    const card = Cards.findOne(cardId);
    const cardset = Cardsets.findOne(card.cardset_id);
    let isOwner = false;
    let transcriptBonusUserCopy = _.clone(transcriptBonusUser);

    if (transcriptBonusUser === null) {
      transcriptBonusUserCopy = undefined;
    }

    const transcriptBonusDatabase = TranscriptBonus.findOne({ card_id: cardId });
    if (card.cardset_id === '-1' && card.owner === Meteor.userId()) {
      isOwner = true;
    } else {
      isOwner = UserPermissions.isOwner(cardset.owner);
    }
    if (UserPermissions.isAdmin() || isOwner) {
      if (subject === '' && transcriptBonusUserCopy === undefined) {
        throw new Meteor.Error(TAPi18n.__('cardsubject_required', {}, Meteor.user().profile.locale));
      }
      if (transcriptBonusUserCopy === undefined) {
        TranscriptBonus.remove({ card_id: cardId });
      } else if (transcriptBonusDatabase === undefined) {
        if (!TranscriptBonusList.canBeSubmittedToLecture(transcriptBonusUserCopy, Number(transcriptBonusUserCopy.date_id))) {
          throw new Meteor.Error(TAPi18n.__('transcriptForm.server.notFound', {}, Meteor.user().profile.locale));
        }
        Meteor.call('addTranscriptBonus', cardId, transcriptBonusUserCopy.cardset_id, Meteor.userId(), Number(transcriptBonusUserCopy.date_id));
      } else {
        if (TranscriptBonusList.isDeadlineExpired(transcriptBonusDatabase, true)) {
          throw new Meteor.Error(TAPi18n.__('transcriptForm.server.deadlineExpired', {}, Meteor.user().profile.locale));
        }
        TranscriptBonusList.checkForUpdate(cardId, Meteor.userId(), transcriptBonusUserCopy, transcriptBonusDatabase, transcriptBonusUserCopy.date_id);
      }
      Cards.update(cardId, {
        $set: {
          subject: subject.trim(),
          front: content1,
          back: content2,
          hint: content3,
          lecture: content4,
          top: content5,
          bottom: content6,
          centerTextElement,
          alignType,
          learningGoalLevel,
          backgroundStyle,
          dateUpdated: new Date(),
          lastEditor: Meteor.userId(),
          learningTime: {
            initial: initialLearningTime,
            repeated: repeatedLearningTime,
          },
          answers,
        },
      }, { trimStrings: false });
      Cardsets.update(card.cardset_id, {
        $set: {
          dateUpdated: new Date(),
          lastEditor: Meteor.userId(),
        },
      });
      return true;
    }
    throw new Meteor.Error('not-authorized');
  },
  getCardMetaData(cardsetId) {
    check(cardsetId, String);

    if (Meteor.user()) {
      const cardset = Cardsets.findOne({ _id: cardsetId }, { fields: { _id: 1, owner: 1, cardType: 1 } });
      if (UserPermissions.isOwner(cardset.owner) || UserPermissions.gotBackendAccess()) {
        const cardSides = CardType.getCardTypeCubeSides(cardset.cardType);
        const cards = Cards.find({ cardset_id: cardset._id }, {
          fields: {
            front: 1, back: 1, hint: 1, lecture: 1, top: 1, bottom: 1,
          },
        }).fetch();
        const metaData = [];
        if (cardSides !== undefined) {
          for (let i = 0; i < cardSides.length; i += 1) {
            let count = 0;
            for (let c = 0; c < cards.length; c += 1) {
              if (cards[c][CardType.getContentIDTranslation(cardSides[i].contentId)] !== undefined && cards[c][CardType.getContentIDTranslation(cardSides[i].contentId)].trim().length > 0) {
                count += 1;
              }
            }
            let active = true;
            if (count === 0) {
              active = false;
            }
            const newSetting = {
              active,
              contentId: cardSides[i].contentId,
              count,
            };
            metaData.push(newSetting);
          }
        }
        return metaData;
      }
    }
    return [];
  },
});
