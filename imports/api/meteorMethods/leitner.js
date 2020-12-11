import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Leitner } from '../subscriptions/leitner';
import { Workload } from '../subscriptions/workload';
import { Cardsets } from '../subscriptions/cardsets';
import { Bonus } from '../../util/bonus';
import { Profile } from '../../util/profile';
import { UserPermissions } from '../../util/permissions';
import { CardType } from '../../util/cardTypes';
import { LeitnerUtilities } from '../../util/leitner';
import { LeitnerTasks } from '../subscriptions/leitnerTasks';
import { PomodoroTimer } from '../../util/pomodoroTimer';

Meteor.methods({
  initializeWorkloadData(cardset_id, user_id) {
    check(cardset_id, String);
    check(user_id, String);
    const workload = Workload.findOne({ user_id, cardset_id });
    if (workload === undefined) {
      Workload.insert({
        cardset_id,
        user_id,
        leitner: {
          bonus: false,
          nextLowestPriority: [-1, -1, -1, -1, -1],
        },
      });
    }
  },
  markLeitnerAutoPDF(cardset_id, card_id) {
    check(cardset_id, String);
    check(card_id, String);

    Leitner.update({
      cardset_id,
      card_id,
      user_id: Meteor.userId(),
    },
    {
      $set: {
        viewedPDF: true,
      },
    });
  },
  joinBonus(cardset_id) {
    check(cardset_id, String);
    const cardset = Cardsets.findOne({ _id: cardset_id }, { fields: { _id: 1 } });
    if (cardset !== undefined) {
      if (Bonus.canJoinBonus(cardset._id) && Bonus.isRegistrationPeriodActive(cardset._id) && Profile.isCompleted(Meteor.user())) {
        Meteor.call('initializeWorkloadData', cardset._id, Meteor.userId());
        Meteor.call('deleteLeitner', cardset._id);
        Meteor.call('deleteWozniak', cardset._id);
        Workload.update({
          cardset_id: cardset._id,
          user_id: Meteor.userId(),
        },
        {
          $set: {
            'leitner.bonus': true,
            'leitner.dateJoinedBonus': new Date(),
          },
        });
      }
    }
  },
  leaveBonus(cardset_id) {
    check(cardset_id, String);
    const workload = Workload.findOne({ user_id: Meteor.userId(), cardset_id }, {
      fields: {
        _id: 1,
        user_id: 1,
        cardset_id: 1,
      },
    });
    if (workload !== undefined) {
      Workload.update({
        cardset_id: workload.cardset_id,
        user_id: Meteor.userId(),
      },
      {
        $set: {
          'leitner.bonus': false,
        },
      });
    }
    Meteor.call('deleteLeitner', cardset_id);
  },
  /** Function adds a new user as learning
	 *  @param {string} cardset_id - The ID of the cardset in which the user is learning
	 *  @param {boolean} true - Process of adding the user to leitner ended successfully
	 * */
  addToLeitner(cardset_id) {
    check(cardset_id, String);
    if (Meteor.isServer) {
      if (!Meteor.userId() || Roles.userIsInRole(this.userId, 'blocked') || !UserPermissions.hasCardsetPermission(cardset_id)) {
        throw new Meteor.Error('not-authorized');
      } else {
        let cardset = Cardsets.findOne({ _id: cardset_id });
        if (cardset !== undefined) {
          if (cardset.shuffled) {
            let counter = 0;
            for (let i = 0; i < cardset.cardGroups.length; i++) {
              if (CardType.gotLearningModes(Cardsets.findOne(cardset.cardGroups[i]).cardType)) {
                counter++;
              }
            }
            if (counter === 0) {
              throw new Meteor.Error('not-authorized');
            }
          } else if (!CardType.gotLearningModes(cardset.cardType)) {
            throw new Meteor.Error('not-authorized');
          }
          const isNewcomer = LeitnerUtilities.addLeitnerCards(cardset, Meteor.userId());
          cardset = LeitnerUtilities.defaultCardsetLeitnerData(cardset);
          if (isNewcomer && (!Bonus.isInBonus(cardset._id, Meteor.userId()) || cardset.learningEnd.getTime() > new Date().getTime())) {
            LeitnerUtilities.setCards(cardset, Meteor.user(), false, isNewcomer);
          }
        }
      }
    }
  },
  updateLeitnerCardIndex(cardset_id) {
    check(cardset_id, String);
    if (!Meteor.isServer) {
      throw new Meteor.Error('not-authorized');
    } else {
      const cardset = Cardsets.findOne({ _id: cardset_id }, { fields: { _id: 1, cardGroups: 1, shuffled: 1 } });
      let activeLearners = Leitner.find({ cardset_id: cardset._id }, { fields: { user_id: 1 } }).fetch();
      activeLearners = _.uniq(activeLearners, false, function(d) {
        return d.user_id;
      });
      for (let i = 0; i < activeLearners.length; i++) {
        LeitnerUtilities.addLeitnerCards(cardset, activeLearners[i].user_id);
      }
    }
  },
  updateLeitnerTimer(cardset_id) {
    check(cardset_id, String);
    const leitnerTask = LeitnerTasks.findOne({
      user_id: Meteor.userId(),
      cardset_id,
    }, {
      sort: { createdAt: -1 },
    });
    if (leitnerTask !== undefined) {
      if (leitnerTask.timer.status === 0) {
        LeitnerUtilities.updateWorkTimer(leitnerTask);
      } else if (leitnerTask.timer.status === 2) {
        LeitnerUtilities.updateBreakTimer(leitnerTask);
      }
    }
  },
  startLeitnerBreak(cardset_id) {
    check(cardset_id, String);

    const leitnerTask = LeitnerTasks.findOne({
      user_id: Meteor.userId(),
      cardset_id,
    }, {
      sort: { createdAt: -1 },
    });
    if (leitnerTask !== undefined) {
      if (PomodoroTimer.getRemainingTime(leitnerTask) <= 1) {
        LeitnerTasks.update({
          _id: leitnerTask._id,
        },
        {
          $set: {
            'timer.lastCallback': new Date(),
            'timer.workload.current': 0,
            'timer.break.current': 0,
            'timer.status': 2,

          },
          $inc: {
            'timer.workload.completed': 1,
          },
        });
      }
    }
  },
  endLeitnerBreak(cardset_id) {
    check(cardset_id, String);

    const leitnerTask = LeitnerTasks.findOne({
      user_id: Meteor.userId(),
      cardset_id,
    }, {
      sort: { createdAt: -1 },
    });
    if (leitnerTask !== undefined) {
      if (PomodoroTimer.getRemainingTime(leitnerTask) <= 1) {
        LeitnerTasks.update({
          _id: leitnerTask._id,
        },
        {
          $set: {
            'timer.lastCallback': new Date(),
            'timer.workload.current': 0,
            'timer.break.current': 0,
            'timer.status': 0,
          },
          $inc: {
            'timer.break.completed': 1,
          },
        });
      }
    }
  },
  getTempLeitnerData(cardset_id, user_id, type) {
    check(cardset_id, String);
    check(user_id, String);
    check(type, String);

    const options = {
      fields: {
        cardset_id: 1,
        original_cardset_id: 1,
        user_id: 1,
        box: 1,
      },
    };
    if (type === 'cardset') {
      let isCardsetOwnerAndLecturer = false;
      let targetUserIsInBonus = false;
      const cardset = Cardsets.findOne({ _id: cardset_id }, { fields: { owner: 1 } });
      if (cardset !== undefined) {
        isCardsetOwnerAndLecturer = (cardset.owner === Meteor.userId() && UserPermissions.isLecturer());
      }
      const workload = Workload.findOne({ cardset_id, user_id });
      if (workload !== undefined) {
        targetUserIsInBonus = workload.leitner.bonus;
      }
      if (Meteor.userId() === user_id || (UserPermissions.gotBackendAccess() && targetUserIsInBonus) || (isCardsetOwnerAndLecturer && targetUserIsInBonus)) {
        return Leitner.find({ cardset_id, user_id }, options).fetch();
      }
      return [];
    } if (type === 'user') {
      return Leitner.find({ user_id: Meteor.userId() }, options).fetch();
    } if (UserPermissions.gotBackendAccess()) {
      return Leitner.find({}, options).fetch();
    }
    return [];
  },
});
