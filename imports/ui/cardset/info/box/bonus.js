//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Profile} from "../../../../api/profile";
import {Bonus} from "../../../../api/bonus";
import {CardsetVisuals} from "../../../../api/cardsetVisuals";
import "./bonus.html";

/*
* ############################################################################
* learningPhaseInfoBox
* ############################################################################
*/

Template.learningPhaseInfoBox.helpers({
	getDateEnd: function () {
		return moment(this.learningEnd).format("DD.MM.YYYY");
	},
	getDateStart: function () {
		return moment(this.learningStart).format("DD.MM.YYYY");
	},
	getRegistrationPeriod: function () {
		return moment(this.registrationPeriod).format("DD.MM.YYYY");
	},
	getDeadline: function () {
		if (this.daysBeforeReset === 1) {
			return this.daysBeforeReset + " " + TAPi18n.__('panel-body-experience.day');
		} else {
			return this.daysBeforeReset + " " + TAPi18n.__('panel-body-experience.day_plural');
		}
	},
	getLearningStatus: function () {
		if (this.learningEnd.getTime() > new Date().getTime()) {
			return TAPi18n.__('set-list.activeLearnphase');
		} else {
			return TAPi18n.__('set-list.inactiveLearnphase');
		}
	},
	getWorkload: function () {
		if (this.maxCards === 1) {
			return this.maxCards + " " + TAPi18n.__('confirmLearn-form.card');
		} else {
			return this.maxCards + " " + TAPi18n.__('confirmLearn-form.cards');
		}
	},
	getPomodoroCount: function () {
		return TAPi18n.__('pomodoro.cardsetInfo.count.content', {
			count: this.pomodoroTimer.quantity,
			link: TAPi18n.__('pomodoro.form.link'),
			tooltip: TAPi18n.__('pomodoro.form.tooltip.link', {pomodoro: TAPi18n.__('pomodoro.name')}),
			pomodoro: TAPi18n.__('pomodoro.name', {count: this.pomodoroTimer.quantity})
		});
	},
	getPomodoroWorkTime: function () {
		return TAPi18n.__('pomodoro.cardsetInfo.work.content', {minutes: TAPi18n.__('pomodoro.form.time.minute', {count: this.pomodoroTimer.workLength})});
	},
	getPomodoroBreakTime: function () {
		return TAPi18n.__('pomodoro.cardsetInfo.break.content', {minutes: TAPi18n.__('pomodoro.form.time.minute', {count: this.pomodoroTimer.breakLength})});
	},
	canJoinBonus: function () {
		return Bonus.canJoinBonus(Session.get('activeCardset')._id);
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id);
	},
	isProfileCompleted: function () {
		return Profile.isCompleted();
	}
});

Template.learningPhaseInfoBox.events({
	"click #collapseLearningPhaseInfoButton": function () {
		CardsetVisuals.changeCollapseIcon("#collapseLearningPhaseInfoIcon");
	}
});
