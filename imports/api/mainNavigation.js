import {Session} from "meteor/session";
import {Route} from "./route";

let keyEventsUnlocked = true;
let firstTimePresentation = 'isFirstTimePresentation';
let firstTimeLeitner = 'isFirstTimeLeitner';
let firstTimeWozniak = 'isFirstTimeWozniak';
let firstTimeDemo = 'isFirstTimeDemo';

export let MainNavigation = class MainNavigation {

	static showHelp () {
		$('#helpModal').modal('show');
	}

	static getFirstTimePresentationString () {
		return firstTimePresentation;
	}

	static getFirstTimeLeitnerString () {
		return firstTimeLeitner;
	}

	static getFirstTimeWozniakString () {
		return firstTimeWozniak;
	}

	static getFirstTimeDemoString () {
		return firstTimeDemo;
	}

	static toggleHelp () {
		if ($('#helpModal').is(':visible')) {
			$('#helpModal').modal('hide');
		} else {
			$('#helpModal').modal('show');
		}
	}

	static enableKeyEvents () {
		keyEventsUnlocked = true;
	}

	static keyEvents (event) {
		if (keyEventsUnlocked) {
			let keyCodes = [112];
			keyEventsUnlocked = false;
			if (keyCodes.indexOf(event.keyCode) > -1) {
				event.preventDefault();
				switch (event.keyCode) {
					case 112:
						if (Session.get('helpFilter') !== undefined || Route.isPresentationOrDemo() || Route.isBox() || Route.isMemo()) {
							this.toggleHelp();
						}
						break;
				}
			}
		}
	}
};
