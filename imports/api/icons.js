import * as config from "../config/icons.js";

export let Icons = class Icons {

	static aspectRatio (type) {
		switch (type) {
			case "169":
				return config.aspectRatio["169"];
			case "43":
				return config.aspectRatio["43"];
			case "stretched":
				return config.aspectRatio.stretched;
			case "din":
				return config.aspectRatio.din;
		}
	}
};
