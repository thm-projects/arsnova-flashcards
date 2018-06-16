//1: Privat / Private
//2: Vorkurs / Pre-course
//3: Brückenkurs / Bridge Course
//4: Bachelorkurs / Bachelor
//5: Masterkurs / Master
//6: Weiterbildungskurs / Advanced Training
let targetAudienceWithAccessControl = [2, 3, 4, 5, 6];
let targetAudienceWithSemester = [3, 4, 5];
let targetAudienceWithModule = [2, 3, 4, 5, 6];
let targetAudienceOrder = [{targetAudience: 1}, {targetAudience: 2}, {targetAudience: 3}, {targetAudience: 4}, {targetAudience: 5}, {targetAudience: 6}];

export let TargetAudience = class TargetAudience {
	static gotAccessControl (targetAudience) {
		return targetAudienceWithAccessControl.includes(targetAudience);
	}

	static gotSemester (targetAudience) {
		return targetAudienceWithSemester.includes(targetAudience);
	}

	static gotModule (targetAudience) {
		return targetAudienceWithModule.includes(targetAudience);
	}

	static getTargetAudienceName (targetAudience) {
		return TAPi18n.__('courseIteration.targetAudience' + targetAudience + '.name');
	}

	static getTargetAudienceAbbreviation (targetAudience) {
		return TAPi18n.__('courseIteration.targetAudience' + targetAudience + '.abbreviation');
	}

	static getTargetAudienceOrder () {
		return targetAudienceOrder;
	}
};
