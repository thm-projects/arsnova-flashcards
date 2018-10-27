//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./pomodoroCount.html";

/*
* ############################################################################
* cardsetInfoBoxItemPomodoroCount
* ############################################################################
*/

Template.cardsetInfoBoxItemPomodoroCount.helpers({
	getPomodoroCount: function () {
		return TAPi18n.__('pomodoro.cardsetInfo.count.content', {
			count: this.pomodoroTimer.quantity,
			link: TAPi18n.__('pomodoro.form.link'),
			tooltip: TAPi18n.__('pomodoro.form.tooltip.link', {pomodoro: TAPi18n.__('pomodoro.name')}),
			pomodoro: TAPi18n.__('pomodoro.name', {count: this.pomodoroTimer.quantity})
		});
	}
});
