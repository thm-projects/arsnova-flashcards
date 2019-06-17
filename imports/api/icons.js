import * as config from "../config/icons.js";
import * as icons from "../config/icons";

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
			case "myTranscripts":
				return config.useCasesIcons.myTranscripts;
			case "myRepositories":
				return config.useCasesIcons.myRepositories;
		}
	}

	static getNavigationIcon (type) {
		switch (type) {
			case "wordcloud":
				return config.landingPageNavigation.wordcloud;
			case "transcript":
				return icons.topNavigation.transcripts.transcripts;
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

	static labels (type) {
		switch (type) {
			case "lecturerAuthorized":
				return config.labels.lecturerAuthorized;
			case "wordcloud":
				return config.labels.wordcloud;
			default:
				return "";
		}
	}
};
