import {Session} from "meteor/session";
import {Cardsets} from "../api/subscriptions/cardsets";
import {CardType} from "./cardTypes";
import {ServerStyle} from "./styles";
import {median, mean, std, sum} from "mathjs";

import {
	END_RECORDING,
	END_GROUP,
	START_GROUP,
	SKIP_RECORDING,
	START_RECORDING,
	TYPE_INITIALIZE, TYPE_MIGRATE, TYPE_CLEANUP, PROCESS_RECORDING
} from "../config/serverBoot";
import {humanizeDurationSettings} from "../config/humanizeDuration";
import humanizeDuration from "humanize-duration";

let debugServerBoot;
let lastDebugTime;
let groupTime;
let groupCounter = 1;

export let Utilities = class Utilities {
	static getCalendarString (type = '', minutes = '', displayMode = 0) {
		let today = '[Today]';
		let yesterday = '[Yesterday]';
		let tomorrow = '[Tomorrow]';
		let language;
		if (Meteor.isServer) {
			language = ServerStyle.getServerLanguage();
		} else {
			language = Session.get('activeLanguage');
		}
		if (language === 'de') {
			if (minutes !== '') {
				switch (displayMode) {
					case 1:
						minutes = '[ bis ]' + minutes + '[ Uhr ]';
						break;
					case 2:
						minutes = '[ ab ]' + minutes + '[ Uhr ]';
						break;
					default:
						minutes = '[ ]' + minutes;
						break;
				}
			}
			today = '[Heute]';
			yesterday = '[Gestern]';
			tomorrow = '[Morgen]';
		} else {
			if (minutes !== '') {
				switch (displayMode) {
					case 1:
						minutes = '[ until ]' + minutes;
						break;
					case 2:
						minutes = '[ at ]' + minutes;
						break;
					default:
						minutes = '[ ]' + minutes;
						break;
				}
			}
		}
		switch (type) {
			case "today":
				return today + minutes;
			case "yesterday":
				return yesterday + minutes;
			case "nextDay":
				return tomorrow + minutes;
			default:
				return type + minutes;
		}
	}

	static getMomentsDate (date, displayMinutes = false, displayMode = 0, transformToSpeech = true) {
		let minutes = "";
		let dateFormat = "D. MMMM YYYY";
		if (displayMinutes === true) {
			dateFormat = "D. MMM YY ";
			minutes = "H:mm";
		}
		let language;
		if (Meteor.isServer) {
			language = ServerStyle.getServerLanguage();
		} else {
			language = Session.get('activeLanguage');
		}
		if (!transformToSpeech) {
			return moment(date).locale(language).calendar(null, {
				sameDay: this.getCalendarString(dateFormat, minutes, displayMode),
				lastDay: this.getCalendarString(dateFormat, minutes, displayMode),
				nextDay: this.getCalendarString(dateFormat, minutes, displayMode),
				nextWeek: this.getCalendarString(dateFormat, minutes, displayMode),
				lastWeek: this.getCalendarString(dateFormat, minutes, displayMode),
				sameElse: this.getCalendarString(dateFormat, minutes, displayMode)
			});
		} else {
			if (displayMode === 0) {
				return moment(date).locale(language).calendar(null, {
					sameDay: this.getCalendarString("today", minutes, displayMode),
					lastDay: this.getCalendarString("yesterday", minutes, displayMode),
					nextDay: this.getCalendarString("nextDay", minutes, displayMode),
					nextWeek: this.getCalendarString(dateFormat, "", displayMode),
					lastWeek: this.getCalendarString(dateFormat, "", displayMode),
					sameElse: this.getCalendarString(dateFormat, "", displayMode)
				});
			} else {
				return moment(date).locale(language).calendar(null, {
					sameDay: this.getCalendarString("today", minutes, displayMode),
					lastDay: this.getCalendarString("yesterday", minutes, displayMode),
					nextDay: this.getCalendarString("nextDay", minutes, displayMode),
					nextWeek: this.getCalendarString(dateFormat, minutes, displayMode),
					lastWeek: this.getCalendarString(dateFormat, minutes, displayMode),
					sameElse: this.getCalendarString(dateFormat, minutes, displayMode)
				});
			}
		}
	}

	static getMomentsTime (date) {
		return moment(date).format("H:mm");
	}

	static getMomentsDateShort (date) {
		let language;
		if (Meteor.isServer) {
			language = ServerStyle.getServerLanguage();
		} else {
			language = Session.get('activeLanguage');
		}
		return moment(date).locale(language).calendar(null, {
			sameDay: this.getCalendarString("today"),
			lastDay: this.getCalendarString("yesterday"),
			nextWeek: 'D.MMM YY',
			lastWeek: 'D.MMM YY',
			sameElse: 'D.MMM YY'
		});
	}

	static getUniqData (data, key) {
		let distinctArray = _.uniq(data, false, function (item) {
			return item[key];
		});
		return _.pluck(distinctArray, key);
	}

	static checkIfRepGotWorkloadCardset (rep) {
		for (let c = 0; c < rep.cardGroups.length; c++) {
			let cardset = Cardsets.findOne({_id: rep.cardGroups[c]}, {fields: {cardType: 1}});
			if (cardset !== undefined) {
				if (CardType.getCardTypesWithLearningModes().includes(cardset.cardType)) {
					return true;
				}
			}
		}
	}

	static debugServerBoot (status = 0, item = "", type = TYPE_INITIALIZE, count = 0) {
		if (debugServerBoot === undefined) {
			debugServerBoot = ServerStyle.debugServerBoot();
			lastDebugTime = new Date();
		}
		if (debugServerBoot) {
			let typeText;
			switch (status) {
				case START_RECORDING:
					switch (type) {
						case TYPE_INITIALIZE:
							typeText = 'Initializing';
							break;
						case TYPE_MIGRATE:
							typeText = 'Migrating';
							break;
						case TYPE_CLEANUP:
							typeText = 'Remove';
							break;
					}
					console.log(`${String(groupCounter).padStart(2, '0')}: ${typeText} ${item}...`);
					lastDebugTime = new Date();
					break;
				case END_RECORDING:
					switch (type) {
						case TYPE_INITIALIZE:
							typeText = 'Initialization';
							break;
						case TYPE_MIGRATE:
							typeText = 'Migration';
							break;
						case TYPE_CLEANUP:
							typeText = 'Removal';
							break;
					}
					let currentTime = new Date() - lastDebugTime;
					groupTime += currentTime;
					console.log(`${String(groupCounter).padStart(2, '0')}: ${typeText} of ${item} completed, took ${currentTime} Milliseconds`);
					groupCounter++;
					break;
				case SKIP_RECORDING:
					switch (type) {
						case TYPE_INITIALIZE:
							typeText = 'initialize';
							break;
						case TYPE_MIGRATE:
							typeText = 'migrate';
							break;
						case TYPE_CLEANUP:
							typeText = 'remove';
							break;
					}
					groupTime += new Date() - lastDebugTime;
					console.log(`${String(groupCounter).padStart(2, '0')}: Nothing to ${typeText}, skipping.`);
					groupCounter++;
					break;
				case START_GROUP:
					groupTime = 0;
					groupCounter = 1;
					console.log(`##### Starting Step "${item}"`);
					break;
				case END_GROUP:
					console.log(`##### Step "${item}" took ${groupTime} Milliseconds to complete\n`);
					break;
				case PROCESS_RECORDING:
					console.log(`${String(groupCounter).padStart(2, '0')}: Found ${count} outdated entries`);
					break;
			}
		}
	}

	static getMedian (array) {
		if (array.length) {
			return median(array);
		} else {
			return 0;
		}
	}

	static getArithmeticMean (array) {
		if (array.length) {
			return mean(array);
		} else {
			return 0;
		}
	}

	static getStandardDeviation (array) {
		if (array.length) {
			return std(array);
		} else {
			return 0;
		}
	}

	static getSum (array) {
		if (array.length) {
			return sum(array);
		} else {
			return 0;
		}
	}

	static humanizeDuration (duration = 0, onlyHours = false) {
		let settings = humanizeDurationSettings;
		if (onlyHours) {
			if (duration < 3600000) {
				settings.units = ['m'];
			} else {
				settings.units = ['h'];
			}
		} else {
			if (duration < 60000) {
				settings.units = ['s'];
			} else {
				settings.units = ['h', 'm'];
			}
		}
		return humanizeDuration(duration, settings);
	}

	static sortArray (array, content, desc = false) {
		if (desc) {
			return _.sortBy(array, content);
		} else {
			return _.sortBy(array, content).reverse();
		}
	}

	static setActiveLanguage () {
		let language = ServerStyle.getClientLanguage();
		Session.set('activeLanguage', language);
		TAPi18n.setLanguage(language).done(function () {
			if (Session.get('loadedCardsSettings') !== true) {
				Utilities.triggerCookieConsent();
				Session.set('loadedCardsSettings', true);
			}
		});
	}

	static triggerCookieConsent () {
		window.cookieconsent.initialise({
			"palette": {
				"popup": {
					"background": "#4A5C66",
					"text": "#ffffff"
				},
				"button": {
					"background": "lightgrey",
					"text": "#4a5c66"
				}
			},
			"theme": "edgeless",
			"position": "bottom-right",

			"content": {
				"message": TAPi18n.__('cookieconsent.message', {firstAppTitle: ServerStyle.getFirstAppTitle(), lastAppTitle: ServerStyle.getLastAppTitle()}, (Session.get('activeLanguage'))),
				"dismiss": TAPi18n.__('cookieconsent.dismiss', {}, (Session.get('activeLanguage'))),
				"link": TAPi18n.__('cookieconsent.link', {}, (Session.get('activeLanguage'))),
				"href": "/datenschutz"
			}
		});
	}
};
