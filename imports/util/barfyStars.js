import * as config from "../config/barfyStars.js";

export let BarfyStarsConfig = class BarfyStarsConfig {

	static getConfig (type) {
		if (type === "images") {
			return config.images;
		} else {
			return config.defaultSettings;
		}
	}

	static getStyle (type) {
		if (type === "images") {
			return "BSParticles-Images";
		} else {
			return "BSParticles-Default";
		}
	}
};
