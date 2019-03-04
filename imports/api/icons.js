import * as config from "../config/icons.js";

export let Icons = class Icons {

	static aspectRatio (type) {
		switch (type) {
			case "fill":
				return config.aspectRatio.fill;
			case "din":
				return config.aspectRatio.din;
			default:
				return config.aspectRatio[type];
		}
	}
};
