import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import { Leitner } from '../subscriptions/leitner';
import { Cards } from '../subscriptions/cards';
import { Cardsets } from '../subscriptions/cardsets';
import { AnswerUtilities } from '../../util/answers';
import { LeitnerTasks } from '../subscriptions/leitnerTasks';
import { LeitnerHistory } from '../subscriptions/leitnerHistory';
import { Workload } from '../subscriptions/workload';
import { LeitnerUtilities } from '../../util/leitner';

Meteor.methods({
  getCardAnswerContent(cardIds, cardsetId, disableAnswers) {
    check(cardIds, [String]);
    check(cardsetId, String);
    check(disableAnswers, Boolean);

    return AnswerUtilities.getAnswerContent(cardIds, cardsetId, disableAnswers);
  },
  nextMCCard(activeCardId, cardsetId, timestamps) {
    check(activeCardId, String);
    check(cardsetId, String);
    check(timestamps, Object);
    check(timestamps.question, Date);
    check(timestamps.answer, Date);
    check(timestamps.submission, Date);
    const leitner = Leitner.findOne({
      card_id: activeCardId,
      user_id: Meteor.userId(),
      cardset_id: cardsetId,
      submitted: true,
      active: true,
    });

    const task = LeitnerTasks.findOne(
        { cardset_id: cardsetId, user_id: Meteor.userId() }, { fields: { _id: 1 }, sort: { session: -1, createdAt: -1 } }
    );

    if (leitner !== undefined && task !== undefined) {
      Leitner.update({
        card_id: activeCardId,
        user_id: Meteor.userId(),
        cardset_id: cardsetId,
        submitted: true,
      }, {
        $set: {
          active: false,
        },
      });

      LeitnerHistory.update({
        card_id: activeCardId,
        user_id: Meteor.userId(),
        cardset_id: cardsetId,
        task_id: task._id,
      }, {
        $set: {
          timestamps,
        },
      });
    }
  },
  setMCAnswers(cardIds, activeCardId, cardsetId, userAnswers, timestamps) {
    check(cardIds, [String]);
    check(activeCardId, String);
    check(cardsetId, String);
    check(userAnswers, [Number]);
    check(timestamps, Object);
    check(timestamps.question, Date);
    check(timestamps.answer, Date);

    const activeLeitner = Leitner.findOne({
      card_id: activeCardId,
      user_id: Meteor.userId(),
      cardset_id: cardsetId,
    });

    if (activeLeitner !== undefined && activeLeitner.submitted !== true) {
      const task = LeitnerTasks.findOne(
          { cardset_id: cardsetId, user_id: Meteor.userId() }, { fields: { _id: 1 }, sort: { session: -1, createdAt: -1 } }
      );

      const card = Cards.findOne({ _id: activeCardId });
      const cardset = Cardsets.findOne({ _id: activeLeitner.cardset_id });
      let answers = [];
      if (task !== undefined && card !== undefined && cardset !== undefined) {
        answers = userAnswers.sort();

        let isAnswerWrong = false;
        if (_.difference(answers, card.answers.rightAnswers).length > 0 || answers.length !== card.answers.rightAnswers.length) {
          isAnswerWrong = true;
        }


        const result = LeitnerUtilities.setNextBoxData(isAnswerWrong, activeLeitner, cardset);

        Leitner.update({
          _id: activeLeitner._id,
        }, {
          $set: {
            box: result.box,
            nextDate: result.nextDate,
            currentDate: new Date(),
            priority: result.priority,
            submitted: true,
          },
        });
        LeitnerHistory.update({
          card_id: activeCardId,
          user_id: Meteor.userId(),
          cardset_id: cardsetId,
          task_id: task._id,
        }, {
          $set: {
            timestamps,
            'answer': isAnswerWrong ? 1 : 0,
            'mcAnswers.user': answers,
            'mcAnswers.card': card.answers.rightAnswers,
          },
        });

        Workload.update({ cardset_id: activeLeitner.cardset_id, user_id: activeLeitner.user_id }, {
          $set: {
            'leitner.nextLowestPriority': result.lowestPriorityList,
          },
        });
        return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
      }
      throw new Meteor.Error('Leitner Task not found');
    } else {
      return AnswerUtilities.getAnswerContent(cardIds, cardsetId, true);
    }
  },
  /** Function marks an active leitner card as learned
   * @param {string} cardsetId - The cardset id from the card
   * @param {string} cardId - The id from the card
   * @param {boolean} isAnswerWrong - false = known, true = not known
   * @param {Object} timestamps - Timestamps for viewing the question and viewing the answer
   **/
  setSimpleAnswer(cardsetId, cardId, isAnswerWrong, timestamps) {
    // Make sure the user is logged in
    if (!Meteor.userId() || Roles.userIsInRole(this.userId, ['firstLogin', 'blocked'])) {
      throw new Meteor.Error('not-authorized');
    }
    check(cardsetId, String);
    check(cardId, String);
    check(isAnswerWrong, Boolean);
    check(timestamps, Object);
    check(timestamps.question, Date);
    check(timestamps.answer, Date);
    check(timestamps.submission, Date);

    const cardset = Cardsets.findOne({ _id: cardsetId });

    if (cardset !== undefined) {
      const query = {};

      query.card_id = cardId;
      query.cardset_id = cardsetId;
      query.user_id = Meteor.userId();
      query.active = true;

      const activeLeitner = Leitner.findOne(query);
      if (activeLeitner !== undefined) {
        const result = LeitnerUtilities.setNextBoxData(isAnswerWrong, activeLeitner, cardset);

        Leitner.update(activeLeitner._id, {
          $set: {
            box: result.box,
            active: false,
            nextDate: result.nextDate,
            currentDate: new Date(),
            priority: result.priority,
          },
        });

        const leitnerTask = LeitnerTasks.findOne({ cardset_id: activeLeitner.cardset_id, user_id: activeLeitner.user_id }, { sort: { session: -1 } });
        if (leitnerTask !== undefined) {
          delete query.active;
          query.task_id = leitnerTask._id;
          LeitnerHistory.update(query, {
            $set: {
              box: result.box,
              answer: isAnswerWrong ? 1 : 0,
              timestamps,
            },
          });
        }

        Workload.update({ cardset_id: activeLeitner.cardset_id, user_id: activeLeitner.user_id }, {
          $set: {
            'leitner.nextLowestPriority': result.lowestPriorityList,
          },
        });
      }
      LeitnerUtilities.updateLeitnerWorkload(cardsetId, Meteor.userId());
    }
  },
});
