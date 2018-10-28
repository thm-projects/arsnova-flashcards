//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./pomodoroBreakTime.html";

/*
* ############################################################################
* cardsetInfoBoxItemPomodoroBreakTime
* ############################################################################
*/

Template.cardsetInfoBoxItemPomodoroBreakTime.helpers({
	getPomodoroBreakTime: function () {
		return TAPi18n.__('pomodoro.cardsetInfo.break.content', {minutes: TAPi18n.__('pomodoro.form.time.minute', {count: this.pomodoroTimer.breakLength})});
	}
});
