//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import "./modal/removeUser.js";
import "./modal/userHistory.js";
import "./item/sort.js";
import "./bonus.html";
import {LeitnerProgress} from "../../../../util/leitnerProgress";
import {Utilities} from "../../../../util/utilities";
import {LeitnerHistoryUtilities} from "../../../../util/leitnerHistory";
import * as leitnerStatisticsConfig from "../../../../config/leitnerHistory";

/*
* ############################################################################
* cardsetLearnActivityStatistic
* ############################################################################
*/

Template.cardsetLearnActivityStatistic.onCreated(function () {
	Session.set('hideUserNames', true);
	let settings = leitnerStatisticsConfig.defaultBonusUserSortSettings;
	settings.content = "placeholderID";
	Session.set('sortBonusUsers', settings);
});

Template.cardsetLearnActivityStatistic.onRendered(function () {
	Session.set('activeCardset', Cardsets.findOne({_id: FlowRouter.getParam('_id')}));
});

Template.cardsetLearnActivityStatistic.helpers({
	adjustIndex: function (index) {
		return index + 1;
	},
	gotHiddenUserNames: function () {
		return Session.get('hideUserNames');
	},
	getCardsetStats: function () {
		return Session.get("learnerStats");
	},
	getPercentage: function () {
		if (this.percentage > 0) {
			return '<span class="cardPercentage">[' + this.percentage + ' %]</span>';
		}
	},
	earnedTrophy: function () {
		return this.percentage >= Session.get('activeCardset').workload.bonus.minLearned;
	},
	setSortObject: function (content) {
		return {
			type: 0,
			content: content
		};
	}
});

Template.cardsetLearnActivityStatistic.events({
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
		header[0] = TAPi18n.__('leitnerProgress.box', {number: 1});
		header[1] = TAPi18n.__('leitnerProgress.box', {number: 2});
		header[2] = TAPi18n.__('leitnerProgress.box', {number: 3});
		header[3] = TAPi18n.__('leitnerProgress.box', {number: 4});
		header[4] = TAPi18n.__('leitnerProgress.box', {number: 5});
		header[5] = TAPi18n.__('leitnerProgress.learned');
		header[6] = TAPi18n.__('box_export_birth_name');
		header[7] = TAPi18n.__('box_export_given_name');
		header[8] = TAPi18n.__('box_export_mail');
		header[9] = TAPi18n.__('leitnerProgress.bonus');
		header[10] = TAPi18n.__('confirmLearn-form.notification');
		header[11] = TAPi18n.__('leitnerProgress.dateJoinedBonus');
		header[12] = TAPi18n.__('leitnerProgress.lastActivity');
		header[13] = TAPi18n.__('leitnerProgress.modal.userHistory.stats.duration.cardArithmeticMean.stats');
		header[14] = TAPi18n.__('leitnerProgress.modal.userHistory.stats.duration.cardMedian');
		header[15] = TAPi18n.__('leitnerProgress.modal.userHistory.stats.duration.cardStandardDeviation');
		Meteor.call("getCSVExport", cardset._id, header, function (error, result) {
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
	"click .detailed-stats": function (event) {
		let user = {};
		user.index = $(event.target).data('index');
		user.firstName = $(event.target).data('firstname');
		user.lastName = $(event.target).data('lastname');
		user.email = $(event.target).data('email');
		user.isInBonus = true;
		Session.set('selectedBonusUser', user);
		LeitnerProgress.setupTempData(FlowRouter.getParam('_id'), $(event.target).data('id'), 'cardset');
		$('#progressModal').modal('show');
	},
	"click #showIntervalHelp": function (event) {
		event.stopPropagation();
		Session.set('helpFilter', "leitner");
		FlowRouter.go('help');
	},
	"click .showBonusUserHistory": function (event) {
		let user = {};
		user.user_id = $(event.target).data('id');
		user.index = $(event.target).data('index');
		user.firstName = $(event.target).data('firstname');
		user.lastName = $(event.target).data('lastname');
		user.email = $(event.target).data('email');
		user.isInBonus = true;
		if (user.user_id !== undefined) {
			Session.set('selectedBonusUser', user);
			Meteor.call("getLearningHistoryData", user.user_id, FlowRouter.getParam('_id'), function (error, result) {
				if (error) {
					throw new Meteor.Error(error.statusCode, 'Error could not receive content for history');
				}
				if (result) {
					Session.set('selectedBonusUserHistoryData', LeitnerHistoryUtilities.prepareUserHistoryData(result));
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
		Session.set('selectedBonusUser', user);
	},
	"click .sort-bonus-user": function (event) {
		let sortSettings = Session.get('sortBonusUsers');
		if (sortSettings.content !== $(event.target).data('content')) {
			sortSettings.content = $(event.target).data('content');
			sortSettings.desc = false;
		} else {
			sortSettings.desc = !sortSettings.desc;
		}
		Session.set('learnerStats', Utilities.sortArray(Session.get('learnerStats'), sortSettings.content, sortSettings.desc));
		Session.set('sortBonusUsers', sortSettings);
	}
});

Template.cardsetLearnActivityStatistic.created = function () {
	Session.set("learnerStats", "");
	Meteor.call("getLearningData", FlowRouter.getParam('_id'), function (error, result) {
		if (error) {
			throw new Meteor.Error(error.statusCode, 'Error could not receive content for stats');
		}
		if (result) {
			Session.set("learnerStats", LeitnerHistoryUtilities.prepareBonusUserData(result));
		}
	});
};
