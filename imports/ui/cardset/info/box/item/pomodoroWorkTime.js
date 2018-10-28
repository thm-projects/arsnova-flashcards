//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./pomodoroWorkTime.html";

/*
* ############################################################################
* cardsetInfoBoxItemPomodoroWorkTime
* ############################################################################
*/

Template.cardsetInfoBoxItemPomodoroWorkTime.helpers({
	getPomodoroWorkTime: function () {
		return TAPi18n.__('pomodoro.cardsetInfo.work.content', {minutes: TAPi18n.__('pomodoro.form.time.minute', {count: this.pomodoroTimer.workLength})});
	}
});
