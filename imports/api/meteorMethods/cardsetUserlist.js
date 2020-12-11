import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Leitner } from '../subscriptions/leitner';
import { Workload } from '../subscriptions/workload';
import { Cardsets } from '../subscriptions/cardsets.js';
import { Bonus } from '../../util/bonus';
import { LeitnerHistory } from '../subscriptions/leitnerHistory';
import { Utilities } from '../../util/utilities';
import { UserPermissions } from '../../util/permissions';
import { LeitnerTasks } from '../subscriptions/leitnerTasks';
import { LeitnerUtilities } from '../../util/leitner';
import { CardsetUserlist } from '../../util/cardsetUserlist';

Meteor.methods({
  getCSVExport(cardset_id, header) {
    check(cardset_id, String);
    check(header, [String]);

    const cardset = Cardsets.findOne({ _id: cardset_id });
    const cardsetInfo = CardsetUserlist.getCardsetInfo(cardset);
    const learningPhaseInfo = CardsetUserlist.getLearningPhaseInfo(cardset);
    if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor']) || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
      let content;
      const colSep = ';'; // Separates columns
      const infoCol = ';;;;;;;;;;;;;;'; // Separates columns
      const newLine = '\r\n'; // Adds a new line
      let infoCardsetCounter = 0;
      const infoCardsetLength = 6;
      let infoLearningPhaseCounter = 0;
      const infoLearningPhaseLength = 10;
      content = header[6] + colSep + header[7] + colSep + header[8] + colSep + header[10] + colSep + header[11] + colSep + header[12] + colSep;
      for (let i = 0; i <= 4; i++) {
        content += `${header[i]} [${cardset.learningInterval[i]}]${colSep}`;
      }
      content += header[5] + colSep + header[9] + colSep + colSep + cardsetInfo[infoCardsetCounter++][0] + newLine;
      const learners = CardsetUserlist.getLearners(Workload.find({ cardset_id, 'leitner.bonus': true }).fetch(), cardset_id);
      for (let k = 0; k < learners.length; k++) {
        const totalCards = learners[k].box1 + learners[k].box2 + learners[k].box3 + learners[k].box4 + learners[k].box5 + learners[k].box6;
        let achievedBonus = Bonus.getAchievedBonus(learners[k].box6, cardset.workload, totalCards);
        if (achievedBonus > 0) {
          achievedBonus += ' %';
        } else {
          achievedBonus = '0 %';
        }
        let { box6 } = learners[k];
        const percentage = Math.round(box6 / totalCards * 100);
        if (percentage > 0) {
          box6 += ` [${percentage} %]`;
        }
        content += learners[k].birthname + colSep + learners[k].givenname + colSep + learners[k].email + colSep + Bonus.getNotificationStatus(learners[k], true) + colSep;
        content += Utilities.getMomentsDate(learners[k].dateJoinedBonus, false, 0, false) + colSep + Utilities.getMomentsDate(learners[k].lastActivity, false, 0, false) + colSep;
        content += learners[k].box1 + colSep + learners[k].box2 + colSep + learners[k].box3 + colSep + learners[k].box4 + colSep + learners[k].box5 + colSep + box6 + colSep + achievedBonus + colSep;
        if (infoCardsetCounter <= infoCardsetLength) {
          content += colSep + cardsetInfo[infoCardsetCounter][0] + colSep + cardsetInfo[infoCardsetCounter++][1];
        } else if (infoLearningPhaseCounter <= infoLearningPhaseLength) {
          content += colSep + learningPhaseInfo[infoLearningPhaseCounter][0] + colSep + learningPhaseInfo[infoLearningPhaseCounter++][1];
        }
        content += newLine;
      }
      while (infoCardsetCounter <= infoCardsetLength) {
        content += infoCol + cardsetInfo[infoCardsetCounter][0] + colSep + cardsetInfo[infoCardsetCounter++][1] + newLine;
      }
      while (infoLearningPhaseCounter <= infoLearningPhaseLength) {
        content += infoCol + learningPhaseInfo[infoLearningPhaseCounter][0] + colSep + learningPhaseInfo[infoLearningPhaseCounter++][1] + newLine;
      }
      return content;
    }
  },
  getLearningData(cardset_id) {
    check(cardset_id, String);
    const cardset = Cardsets.findOne({ _id: cardset_id });
    if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
      return CardsetUserlist.getLearners(Workload.find({ cardset_id, 'leitner.bonus': true }).fetch(), cardset_id);
    }
  },
  getLearningHistoryData(user, cardset_id) {
    check(user, String);
    check(cardset_id, String);

    let user_id;
    const cardset = Cardsets.findOne({ _id: cardset_id });
    if (UserPermissions.gotBackendAccess() || (Meteor.userId() === cardset.owner || cardset.editors.includes(Meteor.userId()))) {
      user_id = user;
    } else {
      user_id = Meteor.userId();
    }
    const highestSessionTask = LeitnerUtilities.getHighestLeitnerTaskSessionID(cardset_id, user_id);
    const leitnerTasks = LeitnerTasks.find({ user_id, cardset_id, session: highestSessionTask.session }, { sort: { createdAt: -1 } }).fetch();
    const result = [];
    for (let i = 0; i < leitnerTasks.length; i++) {
      const item = {};
      let missedLastDeadline;
      item.cardsetShuffled = cardset.shuffled;
      item.cardsetTitle = cardset.name;
      item.date = leitnerTasks[i].createdAt;
      item.workload = LeitnerHistory.find({ user_id, cardset_id, task_id: leitnerTasks[i]._id }).count();
      item.known = LeitnerHistory.find({
        user_id, cardset_id, task_id: leitnerTasks[i]._id, answer: 0,
      }).count();
      item.notKnown = LeitnerHistory.find({
        user_id, cardset_id, task_id: leitnerTasks[i]._id, answer: 1,
      }).count();
      item.missedDeadline = leitnerTasks[i].missedDeadline;
      if (i < leitnerTasks.length - 1) {
        missedLastDeadline = leitnerTasks[i + 1].missedDeadline;
      } else {
        missedLastDeadline = false;
      }
      if (missedLastDeadline) {
        item.reason = 1;
      } else {
        item.reason = 0;
      }
      const lastAnswerDate = LeitnerHistory.findOne({
        user_id,
        cardset_id,
        task_id: leitnerTasks[i]._id,
        answer: { $exists: true },
      }, { fields: { timestamps: 1 }, sort: { 'timestamps.submission': -1 } });
      if (lastAnswerDate !== undefined && lastAnswerDate.timestamps !== undefined) {
        item.lastAnswerDate = lastAnswerDate.timestamps.submission;
      }
      item.duration = 0;
      const history = LeitnerHistory.find({
        user_id, cardset_id, task_id: leitnerTasks[i]._id, answer: { $exists: true },
      }, { fields: { timestamps: 1 } }).fetch();
      if (history !== undefined) {
        for (let h = 0; h < history.length; h++) {
          const submission = moment(history[h].timestamps.submission);
          const question = moment(history[h].timestamps.question);
          const duration = submission.diff(question);
          item.duration += moment(duration).valueOf();
        }
      }
      result.push(item);
    }
    return result;
  },
  getEditors(cardset_id) {
    check(cardset_id, String);

    const cardset = Cardsets.findOne({ _id: cardset_id });
    const editorsDataArray = [];
    if (Meteor.userId() === cardset.owner || Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
      const editors = Meteor.users.find({
        _id: { $ne: cardset.owner },
        roles: { $nin: ['admin', 'editor'], $in: ['lecturer'] },
      }).fetch();
      for (let i = 0; i < editors.length; i++) {
        editorsDataArray.push({
          givenname: editors[i].profile.givenname,
          birthname: editors[i].profile.birthname,
          roles: editors[i].roles,
          id: editors[i]._id,
        });
      }
    }
    return editorsDataArray;
  },
  addEditor(cardset_id, user_id) {
    check(cardset_id, String);
    check(user_id, String);
    const cardset = Cardsets.findOne({ _id: cardset_id });
    if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
      Cardsets.update(
          { _id: cardset._id },
          {
            $push: { editors: user_id },
          }
      );
    }
    Leitner.remove({
      cardset_id: cardset._id,
      user_id,
    });
    Meteor.call('updateLearnerCount', cardset._id);
  },
  removeEditor(cardset_id, user_id) {
    check(cardset_id, String);
    check(user_id, String);
    const cardset = Cardsets.findOne({ _id: cardset_id });
    if (Meteor.userId() === cardset.owner && user_id !== cardset.owner) {
      Cardsets.update(
          { _id: cardset._id },
          {
            $pull: { editors: user_id },
          }
      );
    }
  },
  leaveEditors(cardset_id) {
    check(cardset_id, String);
    const cardset = Cardsets.findOne({ _id: cardset_id });
    if (cardset.editors.includes(Meteor.userId())) {
      Cardsets.update(
          { _id: cardset._id },
          {
            $pull: { editors: Meteor.userId() },
          }
      );
    }
  },
  getWordcloudUserName(owner_id) {
    if (Cardsets.findOne({ owner: owner_id, wordcloud: true, visible: true })) {
      return Meteor.users.findOne({ _id: owner_id }, {
        fields: {
          'profile.title': 1,
          'profile.givenname': 1,
          'profile.birthname': 1,
        },
      });
    }
  },
});
