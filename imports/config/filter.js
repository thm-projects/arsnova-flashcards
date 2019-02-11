//Filter
let itemStartingValue = 5;
let itemIncrementValue = 20;

//Filter Navigation

//0: Themen-Pool / Pool
//1: Kartei anlegen / My Cardsets
//2: Repetitorien / Repetitorium
//3: Lernpensum / Learning
//4: Alle Karteien / All Cardsets
//5: Kartei mischen / Shuffle
let filtersWithResetButton = [0, 1, 2, 3, 4, 5];
let filtersWithDisplayModeButton = [0, 2, 4];
let filtersWithSortButton = [0, 1, 2, 3, 4, 5];
let filtersWithDefaultSortName = [0, 2, 3, 5];
let filtersWithDefaultSortDateUpdated = [4];
let filtersWithDefaultSortDateCreated = [1];
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

module.exports = {
	itemStartingValue,
	itemIncrementValue,
	filtersWithResetButton,
	filtersWithDisplayModeButton,
	filtersWithSortButton,
	filtersWithDefaultSortName,
	filtersWithDefaultSortDateUpdated,
	filtersWithDefaultSortDateCreated,
	filtersWithAuthor,
	filtersWithCardType,
	filtersWithDifficulty,
	filtersWithTargetAudience,
	filtersWithSemester,
	filtersWithCollege,
	filtersWithCourse,
	filtersWithModule,
	filtersWithBonus,
	filtersWithWordcloud,
	filtersWithKind,
	filtersWithPersonalKind,
	filtersWithFreeKind,
	filtersWithEduKind,
	filtersWithProKind
};
