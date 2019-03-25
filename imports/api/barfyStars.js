import * as config from "../config/barfyStars.js";

export let BarfyStarsConfig = class BarfyStarsConfig {

	static getConfig (type) {
		switch (type) {
			default:
				return config.defaultSettings;
		}
	}
};
