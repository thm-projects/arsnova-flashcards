import {Route} from "./route.js";

//0: Themen-Pool / Pool
//1: Kartei anlegen / My Cardsets
//2: Kurse / Course
//3: Lernpensum / Learning
//4: Alle Karteien / All Cardsets
//5: Kartei mischen / Shuffle
let filtersWithResetButton = [0, 1, 2, 3, 4, 5];
let filtersWithSortButton = [0, 1, 2, 3, 4, 5];
let filtersWithDefaultSortName = [0, 1, 2, 3, 5];
let filtersWithDefaultSortDateUpdated = [4];
let filtersWithAuthor = [0, 2, 3, 4, 5];
let filtersWithCardType = [0, 1, 3, 4, 5];
let filtersWithDifficulty = [0, 1, 3, 4, 5];
let filtersWithTargetAudience = [];
let filtersWithSemester = [];
let filtersWithCollege = [];
let filtersWithCourse = [];
let filtersWithModule = [];
let filtersWithBonus = [0, 2, 3, 4, 5];
let filtersWithWordcloud = [0, 1, 2, 4, 5];
let filtersWithKind = [0, 1, 2, 3, 4, 5];
let filtersWithPersonalKind = [1, 2, 3, 4, 5];
let filtersWithFreeKind = [0, 1, 2, 3, 4, 5];
let filtersWithEduKind = [0, 1, 2, 3, 4, 5];
let filtersWithProKind = [0, 1, 2, 3, 4, 5];

export let FilterNavigation = class FilterNavigation {
	static gotAuthorFilter (filterType) {
		return filtersWithAuthor.includes(filterType);
	}

	static gotCardTypeFilter (filterType) {
		return filtersWithCardType.includes(filterType);
	}

	static gotTargetAudienceFilter (filterType) {
		return filtersWithTargetAudience.includes(filterType);
	}

	static gotSemesterFilter (filterType) {
		return filtersWithSemester.includes(filterType);
	}

	static gotCollegeFilter (filterType) {
		return filtersWithCollege.includes(filterType);
	}

	static gotCourseFilter (filterType) {
		return filtersWithCourse.includes(filterType);
	}

	static gotModuleFilter (filterType) {
		return filtersWithModule.includes(filterType);
	}

	static gotDifficultyFilter (filterType) {
		return filtersWithDifficulty.includes(filterType);
	}

	static gotBonusFilter (filterType) {
		return filtersWithBonus.includes(filterType);
	}

	static gotWordCloudFilter (filterType) {
		return filtersWithWordcloud.includes(filterType);
	}

	static gotKindFilter (filterType) {
		return filtersWithKind.includes(filterType);
	}

	static gotPersonalKindFilter (filterType) {
		return filtersWithPersonalKind.includes(filterType);
	}

	static gotFreeKindFilter (filterType) {
		return filtersWithFreeKind.includes(filterType);
	}

	static gotEduKindFilter (filterType) {
		return filtersWithEduKind.includes(filterType);
	}

	static gotProKindFilter (filterType) {
		return filtersWithProKind.includes(filterType);
	}

	static gotSortButton (filterType) {
		return filtersWithSortButton.includes(filterType);
	}

	static gotDefaultSortName (filterType) {
		return filtersWithDefaultSortName.includes(filterType);
	}


	static gotDefaultSortDateUpdated (filterType) {
		return filtersWithDefaultSortDateUpdated.includes(filterType);
	}


	static gotResetButton (filterType) {
		return filtersWithResetButton.includes(filterType);
	}

	static getRouteId () {
		if (Route.isPool()) {
			return 0;
		}
		if (Route.isMyCardsets()) {
			return 1;
		}
		if (Route.isRepetitorium()) {
			return 2;
		}
		if (Route.isWorkload()) {
			return 3;
		}
		if (Route.isAllCardsets()) {
			return 4;
		}
		if (Route.isShuffle() || Route.isEditShuffle()) {
			return 5;
		}
	}
};
