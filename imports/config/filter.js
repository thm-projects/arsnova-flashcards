//Filter
let itemStartingValue = 5;
let itemIncrementValue = 20;

//Filter Navigation

//0: Themen-Pool / Pool
//1: Kartei anlegen / My Cardsets
//2: Repetitorien / Repetitories
//3: Lernpensum / Learning
//4: Alle Karteien / All Cardsets
//5: Kartei mischen / Shuffle
//6: Alle Repetitorien / All Repetitories
//7: Meine Repetitorien / My Repetitories
//8: Meine losen Mitschriften / My Transcripts
//9: Meine gekoppelten Mitschriften / My Bonus Transcripts
//10: Gekoppelte Mitschriften (Kartei)
let filtersWithResetButton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let filtersWithDisplayModeButton = [0, 2, 4, 7];
let filtersWithSortButton = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let filtersWithDefaultSortName = [0, 2, 3, 5];
let filtersWithDefaultSortDateUpdated = [1, 4, 6, 7, 8, 9, 10];
let filtersWithDefaultSortDateCreated = [];
let filtersWithAuthor = [0, 2, 3, 4, 5, 6, 10];
let filtersWithCardType = [0, 1, 3, 4, 5];
let filtersWithDifficulty = [0, 1, 3, 4, 5];
let filtersWithTranscriptLecture = [9, 10];
let filtersWithRating = [9, 10];
let filtersWithStars = [9, 10];
let filtersWithTargetAudience = [];
let filtersWithSemester = [];
let filtersWithCollege = [];
let filtersWithCourse = [];
let filtersWithModule = [];
let filtersWithBonus = [0, 1, 2, 3, 4, 5, 6, 7];
let filtersWithWordcloud = [0, 1, 2, 4, 5, 6, 7];
let filtersWithLecturerAuthorized = [0, 1, 2, 4, 5, 6, 7];
let filtersWithUseCase = [0, 1, 2, 4, 5, 6, 7];
let filtersWithKind = [0, 1, 2, 3, 4, 5, 6, 7];
let filtersWithPersonalKind = [1, 3, 4, 5, 6, 7];
let filtersWithFreeKind = [0, 1, 2, 3, 4, 5, 6, 7];
let filtersWithEduKind = [0, 1, 2, 3, 4, 5, 6, 7];
let filtersWithProKind = [0, 1, 2, 3, 4, 5, 6, 7];

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
	filtersWithLecturerAuthorized,
	filtersWithUseCase,
	filtersWithKind,
	filtersWithPersonalKind,
	filtersWithFreeKind,
	filtersWithEduKind,
	filtersWithProKind,
	filtersWithRating,
	filtersWithTranscriptLecture,
	filtersWithStars
};
