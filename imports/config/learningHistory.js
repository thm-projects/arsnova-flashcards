let maxTaskHistoryContentLength = 50;

let defaultBonusUserSortSettings = {
	content: "birthname",
	desc: false
};
let defaultUserHistorySortSettings = {
	content: "date",
	desc: false
};
let defaultTaskHistorySortSettings = {
	content: "cardSubmission",
	desc: true
};

module.exports = {
	maxTaskHistoryContentLength,
	defaultBonusUserSortSettings,
	defaultUserHistorySortSettings,
	defaultTaskHistorySortSettings
};
