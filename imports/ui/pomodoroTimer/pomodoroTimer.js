//------------------------ IMPORTS
import "./pomodoroTimer.html";
import {Template} from "meteor/templating";
import {PomodoroTimer} from "../../api/pomodoroTimer";

/*
 * ############################################################################
 * pomodoroTimer
 * ############################################################################
 */

Template.pomodoroTimer.onCreated(function () {
	PomodoroTimer.initialize();
});

Template.pomodoroTimer.onRendered(function () {
});

Template.pomodoroTimer.onDestroyed(function () {
});

Template.pomodoroTimer.helpers({
});

Template.pomodoroTimer.events({
});

/*
 * ############################################################################
 * pomodoroTimerModal
 * ############################################################################
 */

Template.pomodoroTimerModal.onCreated(function () {
});

Template.pomodoroTimerModal.onRendered(function () {
});

Template.pomodoroTimerModal.onDestroyed(function () {
});

Template.pomodoroTimerModal.helpers({
});

Template.pomodoroTimerModal.events({
});
