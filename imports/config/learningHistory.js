let maxTaskHistoryContentLength = 50;

let defaultBonusUserSortSettings = {
	content: "birthname",
	desc: true
};
let defaultUserHistorySortSettings = {
	content: "createdAt",
	desc: false
};

let defaultActivationDayHistorySortSettings = {
	content: "cardSubmission",
	desc: true
};

let defaultCardStatsSettings = {
	content: "totalAnswers",
	desc: false
};

module.exports = {
	maxTaskHistoryContentLength,
	defaultBonusUserSortSettings,
	defaultUserHistorySortSettings,
	defaultActivationDayHistorySortSettings,
	defaultCardStatsSettings
};
