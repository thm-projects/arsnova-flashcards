let minWorkloadCap = 1;
let defaultMaxWorkload = 30;

let minDaysBeforeReset = 3;
let maxDaysBeforeReset = 31;
let defaultDaysBeforeReset = 7;
let defaultMinBonusPoints = 1;
let defaultMaxBonusPoints = 10;

let dateFormat = "YYYY-MM-DD";
let defaultRegistrationPeriod = [31, 'days'];
let defaultDateRegistrationPeriod = moment().add(defaultRegistrationPeriod[0], defaultRegistrationPeriod[1]).format(dateFormat);
let defaultIntervals = [1, 3, 7, 28, 84];
let defaultDateStart = moment().format(dateFormat);
let defaultEndPeriod = [3, 'months'];
let defaultDateEnd = moment().add(defaultEndPeriod[0], defaultEndPeriod[1]).format(dateFormat);

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
	defaultDateEnd
};
