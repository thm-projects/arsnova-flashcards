import {Session} from "meteor/session";
import {Cardsets} from "../api/subscriptions/cardsets";
import {CardType} from "./cardTypes";
import {ServerStyle} from "./styles";
import {
	END_RECORDING,
	END_GROUP,
	START_GROUP,
	SKIP_RECORDING,
	START_RECORDING,
	TYPE_INITIALIZE, TYPE_MIGRATE, TYPE_CLEANUP
} from "../config/serverBoot";

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

	static debugServerBoot (status = 0, item = "", type = TYPE_INITIALIZE) {
		if (debugServerBoot === undefined) {
			debugServerBoot = ServerStyle.debugServerBoot();
			lastDebugTime = moment();
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
					lastDebugTime = moment();
					break;
				case END_RECORDING:
					let currentDebugTime = moment();
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
					let currentTime = moment.duration(currentDebugTime.diff(lastDebugTime)).asMilliseconds();
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
			}
		}
	}
};
