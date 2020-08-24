import "./checkbox.html";
import {Template} from "meteor/templating";
import {displayProfileFullscreenButtons} from "../fullscreen.js";
import {activeFullscreenSettings} from "../fullscreen.js";

Template.profileViewItemFullscreenCheckbox.helpers({
	gotChecked: function () {
		let mode = 0;
		switch (this.group) {
			case 1:
				mode = activeFullscreenSettings.get('presentation');
				break;
			case 2:
				mode = activeFullscreenSettings.get('demo');
				break;
			case 3:
				mode = activeFullscreenSettings.get('leitner');
				break;
			case 4:
				mode = activeFullscreenSettings.get('wozniak');
				break;
		}
		return mode === this.mode;
	}
});

Template.profileViewItemFullscreenCheckbox.events({
	"click .fa-stack": function () {
		switch (this.group) {
			case 1:
				activeFullscreenSettings.set('presentation', this.mode);
				break;
			case 2:
				activeFullscreenSettings.set('demo', this.mode);
				break;
			case 3:
				activeFullscreenSettings.set('leitner', this.mode);
				break;
			case 4:
				activeFullscreenSettings.set('wozniak', this.mode);
				break;
		}
		if (_.isEqual(activeFullscreenSettings.all(), Meteor.user().fullscreen.settings)) {
			displayProfileFullscreenButtons.set(false);
		} else {
			displayProfileFullscreenButtons.set(true);
		}
	}
});
