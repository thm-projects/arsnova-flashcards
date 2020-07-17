import * as config from "../config/barfyStars.js";

export let BarfyStarsConfig = class BarfyStarsConfig {

	static getConfig (type) {
		switch (type) {
			case "images":
				return config.images;
			default:
				return config.defaultSettings;
		}
	}

	static getStyle (type) {
		switch (type) {
			case "images":
				return "BSParticles-Images";
			default:
				return "BSParticles-Default";
		}
	}
};
