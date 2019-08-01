let roundTheMedian = true;
let roundTheStarsMedian = false;
let denyReasonCount = 6;
let defaultStarsRating = 1;

//Weighting of both values in %. 25 = 25%, 100 = 100%. Both values will be combined to calculate the final score.
let minSubmissionsWeighting = 25;
let minStarsWeighting = 75;

module.exports = {
	roundTheMedian,
	denyReasonCount,
	defaultStarsRating,
	roundTheStarsMedian,
	minSubmissionsWeighting,
	minStarsWeighting
};
