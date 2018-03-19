let targetAudienceWithAccessControl = [2, 3, 4, 5, 6];
let targetAudienceWithSemester = [1, 3, 4, 5, 6];
export let targetAudienceOrder = [{targetAudience: 1}, {targetAudience: 2}, {targetAudience: 3}, {targetAudience: 4}, {targetAudience: 5}, {targetAudience: 6}];

export function gotAccessControl(targetAudience) {
	return targetAudienceWithAccessControl.includes(targetAudience);
}

export function gotSemester(targetAudience) {
	return targetAudienceWithSemester.includes(targetAudience);
}

export function getTargetAudienceName(targetAudience) {
	return TAPi18n.__('courseIteration.targetAudience' + targetAudience + '.name');
}

export function getTargetAudienceAbbreviation(targetAudience) {
	return TAPi18n.__('courseIteration.targetAudience' + targetAudience + '.abbreviation');
}
