//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../api/subscriptions/cardsets";
import "./modal/removeBonusUser.js";
import "./modal/history.js";
import "./item/sort.js";
import "./bonusStatistics.html";
import {LearningStatus} from "../../util/learningStatus";
import {Utilities} from "../../util/utilities";
import {LeitnerHistoryUtilities} from "../../util/learningHistory";
import * as leitnerStatisticsConfig from "../../config/learningHistory";
import {LeitnerLearningPhaseUtilities} from "../../util/learningPhase";
import {LeitnerLearningPhase} from "../../api/subscriptions/leitner/leitnerLearningPhase";

Template.learningBonusStastics.onCreated(function () {
	Session.set('hideUserNames', true);
	let settings = leitnerStatisticsConfig.defaultBonusUserSortSettings;
	settings.content = "placeholderID";
	Session.set('sortBonusUsers', settings);
});

Template.learningBonusStastics.onRendered(function () {
	Session.set('activeCardset', Cardsets.findOne({_id: FlowRouter.getParam('_id')}));
});

Template.learningBonusStastics.helpers({
	gotMultipleLearningPhases: function () {
		return LeitnerLearningPhase.find({cardset_id: FlowRouter.getParam('_id'), isBonus: true}).count() > 1;
	},
	getLearningPhases: function () {
		return LeitnerLearningPhase.find({cardset_id: FlowRouter.getParam('_id'), isBonus: true}).fetch();
	},
	getSelectedLearningPhaseData: function () {
		let learningPhase = LeitnerLearningPhase.findOne({_id: Session.get('selectedLearningPhaseID')});
		let string = Utilities.getMomentsDate(learningPhase.createdAt, false, 0, false);
		if (!learningPhase.isActive) {
			string += " " + TAPi18n.__('learningStatistics.archived');
		}
		return string;
	},
	adjustIndex: function (index) {
		return index + 1;
	},
	gotHiddenUserNames: function () {
		return Session.get('hideUserNames');
	},
	getCardsetStats: function () {
		return Session.get("selectedLearningStatistics");
	},
	getPercentage: function () {
		if (this.percentage > 0) {
			return '<span class="cardPercentage">[' + this.percentage + ' %]</span>';
		}
	},
	earnedTrophy: function () {
		return this.percentage >= LeitnerLearningPhaseUtilities.getActiveBonus(Session.get('activeCardset')._id).bonusPoints.minLearned;
	},
	setSortObject: function (content) {
		return {
			type: 0,
			content: content
		};
	}
});

Template.learningBonusStastics.events({
	"click .learningPhaseDropdownItem": function (event) {
		Session.set('selectedLearningPhaseID', $(event.target).data('id'));
		Meteor.call("getLearningStatistics", FlowRouter.getParam('_id'), Session.get('selectedLearningPhaseID'), function (error, result) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
			}
			if (result) {
				Session.set("selectedLearningStatistics", LeitnerHistoryUtilities.prepareBonusUserData(result));
			}
		});
	},
	"click .showUserNames": function () {
		Session.set('hideUserNames', !Session.get('hideUserNames'));

		let currentSettings = Session.get('sortBonusUsers');
		if (Session.get('hideUserNames') && (currentSettings.content === "birthname" || currentSettings.content === "givenname" || currentSettings.content === "email")) {
			currentSettings.content = "placeholderID";
		} else if (currentSettings.content === "placeholderID") {
			currentSettings.content = "birthname";
		}
		Session.set('sortBonusUsers', currentSettings);
	},
	"click #exportCSV": function () {
		var cardset = Cardsets.findOne({_id: this._id});
		var hiddenElement = document.createElement('a');
		var header = [];
		header.push([TAPi18n.__('box_export_birth_name'), "lastName"]);
		header.push([TAPi18n.__('box_export_given_name'), "firstName"]);
		header.push([TAPi18n.__('box_export_mail'), "email"]);
		header.push([TAPi18n.__('confirmLearn-form.notification'), "notifications"]);
		header.push([TAPi18n.__('learningStatistics.dateJoinedBonus'), "dateJoined"]);
		header.push([TAPi18n.__('learningStatistics.lastActivity'), "lastActivity"]);
		header.push([TAPi18n.__('learningHistory.stats.duration.workingTime.sum'), "workingTimeSum"]);
		header.push([TAPi18n.__('learningHistory.stats.duration.workingTime.arithmeticMean'), "workingTimeArithmeticMean"]);
		header.push([TAPi18n.__('learningHistory.stats.duration.workingTime.median'), "workingTimeMedian"]);
		header.push([TAPi18n.__('learningHistory.stats.duration.workingTime.standardDeviation'), "workingTimeStandardDeviation"]);
		header.push([TAPi18n.__('learningHistory.stats.duration.answerTime.arithmeticMean'), "answerTimeArithmeticMean"]);
		header.push([TAPi18n.__('learningHistory.stats.duration.answerTime.median'), "answerTimeMedian"]);
		header.push([TAPi18n.__('learningHistory.stats.duration.answerTime.standardDeviation'), "answerTimeStandardDeviation"]);
		header.push([TAPi18n.__('learningStatistics.box', {number: 1}), "box1"]);
		header.push([TAPi18n.__('learningStatistics.box', {number: 2}), "box2"]);
		header.push([TAPi18n.__('learningStatistics.box', {number: 3}), "box3"]);
		header.push([TAPi18n.__('learningStatistics.box', {number: 4}), "box4"]);
		header.push([TAPi18n.__('learningStatistics.box', {number: 5}), "box5"]);
		header.push([TAPi18n.__('learningStatistics.learned'), "learned"]);
		header.push([TAPi18n.__('learningStatistics.bonus'), "achievedBonus"]);
		Meteor.call("getLearningStatisticsCSVExport", cardset._id, Session.get('selectedLearningPhaseID'), header, function (error, result) {
			if (error) {
				throw new Meteor.Error(error.statusCode, 'Error could not receive content for .csv');
			}
			if (result) {
				var statistics = TAPi18n.__('box_export_statistics');
				hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(result);
				hiddenElement.target = '_blank';
				var str = (cardset.name + "_" + statistics + "_" + new Date() + ".csv");
				hiddenElement.download = str.replace(/ /g, "_").replace(/:/g, "_");
				document.body.appendChild(hiddenElement);
				hiddenElement.click();
			}
		});
	},
	"click #backButton": function () {
		FlowRouter.go('cardsetdetailsid', {_id: this._id});
	},
	"click .showLearningStatus": function (event) {
		let user = {};
		user.index = $(event.target).data('index');
		user.firstName = $(event.target).data('firstname');
		user.lastName = $(event.target).data('lastname');
		user.email = $(event.target).data('email');
		user.isInBonus = true;
		Session.set('selectedLearningStatisticsUser', user);
		LearningStatus.setupTempData(FlowRouter.getParam('_id'), $(event.target).data('id'), $(event.target).data('workloadid'), 'cardset');
		Meteor.call('getLastLearningStatusActivity', $(event.target).data('id'), FlowRouter.getParam('_id'), $(event.target).data('workloadid'), false, function (err, res) {
			if (res) {
				Session.set('lastLearningStatusActivity', res);
			}
		});
		$('#learningStatusModal').modal('show');
	},
	"click #showIntervalHelp": function (event) {
		event.stopPropagation();
		Session.set('helpFilter', "leitner");
		FlowRouter.go('help');
	},
	"click .showLearningHistory": function (event) {
		let user = {};
		user.user_id = $(event.target).data('id');
		user.index = $(event.target).data('index');
		user.firstName = $(event.target).data('firstname');
		user.lastName = $(event.target).data('lastname');
		user.email = $(event.target).data('email');
		user.workload_id = $(event.target).data('workloadid');
		user.isInBonus = true;
		if (user.user_id !== undefined) {
			Session.set('selectedLearningStatisticsUser', user);
			Meteor.call("getLearningHistory", user.user_id, FlowRouter.getParam('_id'), user.workload_id, function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for history');
				}
				if (result) {
					Session.set('selectedLearningHistory', LeitnerHistoryUtilities.prepareUserHistoryData(result));
				}
			});
		}
	},
	"click .removeBonusUser": function (event) {
		let user = {};
		user.index = $(event.target).data('index');
		user.user_id = $(event.target).data('user_id');
		user.firstName = $(event.target).data('firstname');
		user.lastName = $(event.target).data('lastname');
		user.email = $(event.target).data('email');
		user.box1 = $(event.target).data('box1');
		user.box2 = $(event.target).data('box2');
		user.box3 = $(event.target).data('box3');
		user.box4 = $(event.target).data('box4');
		user.box5 = $(event.target).data('box5');
		user.box6 = $(event.target).data('box6');
		user.mailNotification = $(event.target).data('mailnotification');
		user.webNotification = $(event.target).data('webnotification');
		user.dateJoinedBonus = $(event.target).data('datejoinedbonus');
		user.lastActivity = $(event.target).data('lastactivity');
		user.workingTimeSum = $(event.target).data('workingtimesum');
		user.cardArithmeticMean = $(event.target).data('cardarithmeticmean');
		user.percentage = $(event.target).data('percentage');
		user.achievedBonus = $(event.target).data('achievedbonus');
		user.workload_id = $(event.target).data('workloadid');
		Session.set('selectedLearningStatisticsUser', user);
	},
	"click .sort-bonus-user": function (event) {
		let sortSettings = Session.get('sortBonusUsers');
		if (sortSettings.content !== $(event.target).data('content')) {
			sortSettings.content = $(event.target).data('content');
			sortSettings.desc = false;
		} else {
			sortSettings.desc = !sortSettings.desc;
		}
		Session.set('selectedLearningStatistics', Utilities.sortArray(Session.get('selectedLearningStatistics'), sortSettings.content, sortSettings.desc));
		Session.set('sortBonusUsers', sortSettings);
	}
});

Template.learningBonusStastics.created = function () {
	Session.set("selectedLearningStatistics", "");
	Session.set('selectedLearningPhaseID', LeitnerLearningPhaseUtilities.getNewestBonus(FlowRouter.getParam('_id'))._id);
	Meteor.call("getLearningStatistics", FlowRouter.getParam('_id'), Session.get('selectedLearningPhaseID'), function (error, result) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
		}
		if (result) {
			Session.set("selectedLearningStatistics", LeitnerHistoryUtilities.prepareBonusUserData(result));
		}
	});
};
