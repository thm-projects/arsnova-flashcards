let minWorkloadCap = 1;
let defaultMaxWorkload = 30;

let minDaysBeforeReset = 3;
let maxDaysBeforeReset = 31;
let defaultDaysBeforeReset = 7;
let defaultMinBonusPoints = 1;
let defaultMaxBonusPoints = 10;

//Minimum cards learned in % for max Bonus points
let defaultMinLearned = 20;

let dateFormat = "YYYY-MM-DD";
let defaultRegistrationPeriod = [31, 'days'];
let defaultDateRegistrationPeriod = moment().add(defaultRegistrationPeriod[0], defaultRegistrationPeriod[1]).format(dateFormat);
let defaultIntervals = [1, 3, 7, 28, 84];
let defaultDateStart = moment().format(dateFormat);
let defaultEndPeriod = [3, 'months'];
let defaultDateEnd = moment().add(defaultEndPeriod[0], defaultEndPeriod[1]).format(dateFormat);
// Default error count in percent for the simulator
let defaultErrorCount = [50, 20, 10, 5, 2];

//Bonus settings
let defaultForceNotifications = {
	mail: true,
	push: true
};

module.exports = {
	minWorkloadCap,
	defaultMaxWorkload,
	minDaysBeforeReset,
	maxDaysBeforeReset,
	defaultDaysBeforeReset,
	defaultMinBonusPoints,
	defaultMaxBonusPoints,
	dateFormat,
	defaultRegistrationPeriod,
	defaultDateRegistrationPeriod,
	defaultIntervals,
	defaultDateStart,
	defaultEndPeriod,
	defaultDateEnd,
	defaultErrorCount,
	defaultMinLearned,
	defaultForceNotifications
};
