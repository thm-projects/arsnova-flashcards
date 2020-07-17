import {AdminSettings} from "../api/subscriptions/adminSettings";


export let ServerSettings = class ServerSettings {
	static isMailEnabled () {
		return AdminSettings.findOne({name: "mailSettings"}).enabled;
	}

	static isPushEnabled () {
		return AdminSettings.findOne({name: "pushSettings"}).enabled;
	}
};
