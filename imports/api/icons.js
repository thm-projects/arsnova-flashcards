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

	static useCases (type) {
		switch (type) {
			case "search":
				return config.useCasesIcons.search;
			case "workload":
				return config.useCasesIcons.workload;
			case "create":
				return config.useCasesIcons.create;
			case "myCardsets":
				return config.useCasesIcons.myCardsets;
			case "myRepositories":
				return config.useCasesIcons.myRepositories;
		}
	}

	static getNavigationIcon (type) {
		switch (type) {
			case "wordcloud":
				return config.landingPageNavigation.wordcloud;
		}
	}
	static displayMode (type) {
		switch (type) {
			case "wordcloud":
				return config.topNavigation.displayMode.wordcloud;
			case "list":
				return config.topNavigation.displayMode.list;
		}
	}
};
