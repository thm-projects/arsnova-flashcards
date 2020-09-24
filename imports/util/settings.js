import {AdminSettings} from "../api/subscriptions/adminSettings";


export let ServerSettings = class ServerSettings {
	static isMailEnabled () {
		let mailSettings = AdminSettings.findOne({name: "mailSettings"});
		if (mailSettings !== undefined) {
			return mailSettings.enabled;
		}
	}

	static isPushEnabled () {
		let pushSettings = AdminSettings.findOne({name: "pushSettings"});
		if (pushSettings !== undefined) {
			return pushSettings.enabled;
		}
	}
};
