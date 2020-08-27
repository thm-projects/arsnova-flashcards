import "./content/content.js";
import "./item/checkbox.js";
import "./fullscreen.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {BertAlertVisuals} from "../../../../util/bertAlertVisuals";
import {ServerStyle} from "../../../../util/styles";
import {Fullscreen} from "../../../../util/fullscreen";
import {ReactiveDict} from 'meteor/reactive-dict';
import {ReactiveVar} from "meteor/reactive-var";

export let activeFullscreenSettings = new ReactiveDict();
export let displayProfileFullscreenButtons = new ReactiveVar();

Template.profileFullscreen.onCreated(function () {
	activeFullscreenSettings.set(Meteor.user().fullscreen.settings);
	displayProfileFullscreenButtons.set(false);
});

Template.profileFullscreen.helpers({
	canDisplayButtons: function () {
		return displayProfileFullscreenButtons.get();
	}
});

Template.profileFullscreen.events({
	"click #fullscreenSave": function () {
		let presentation = Meteor.user().fullscreen.settings.presentation;
		let demo = Meteor.user().fullscreen.settings.demo;
		let leitner = Meteor.user().fullscreen.settings.leitner;
		let wozniak = Meteor.user().fullscreen.settings.wozniak;


		if (ServerStyle.gotFullscreenSettingsAccess(1)) {
			presentation = activeFullscreenSettings.get('presentation');
		}
		if (ServerStyle.gotFullscreenSettingsAccess(2)) {
			demo = activeFullscreenSettings.get('demo');
		}
		if (ServerStyle.gotFullscreenSettingsAccess(3)) {
			leitner = activeFullscreenSettings.get('leitner');
		}
		if (ServerStyle.gotFullscreenSettingsAccess(4)) {
			wozniak = activeFullscreenSettings.get('wozniak');
		}

		// Reset the Chose Mode Session of the User switched to a different mode
		if (presentation !== 3) {
			Fullscreen.resetChooseModeSessions(0);
		}
		if (demo !== 3) {
			Fullscreen.resetChooseModeSessions(1);
		}
		if (leitner !== 3) {
			Fullscreen.resetChooseModeSessions(2);
		}
		if (wozniak !== 3) {
			Fullscreen.resetChooseModeSessions(3);
		}
		Meteor.call("updateUserFullscreenSettings", presentation, demo, leitner, wozniak);
		displayProfileFullscreenButtons.set(false);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('fullscreen.settings.notifications.saved'), 'success', 'growl-top-left');
	},
	"click #fullscreenCancel": function () {
		activeFullscreenSettings.set(Meteor.user().fullscreen.settings);
		displayProfileFullscreenButtons.set(false);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('fullscreen.settings.notifications.canceled'), 'danger', 'growl-top-left');
	}
});
