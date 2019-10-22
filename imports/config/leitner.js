//For Leitner Modal related settings, see bonusForm.js


// Attempt to fill missing slots if there are not enough cards available to reach the max workload
let fillUpMissingCards = true;

// true = Start from box1
// false = Start from box5
let fillUpFromLeftToRight = false;

// What should happen to a persons workload if the deadline got passed (Excludes cards in box 6 = learned)?
// 0 = Reset all active cards to the previous box
// 1 = Reset all active cards to the first box
// 2 = Reset all cards to the previous box
// 3 = Reset all cards to the first box
// 4 = Reset all active cards to the current index (Freeze the current learning status)
let resetDeadlineMode = 1;

// What should happen if the user answers a card with "Not Known"
// 0 = Move the card back to the first box
// 1 = Move the card back to the previous box
let wrongAnswerMode = 1;

// From left to right: box 1 - box 5
let boxAlgorithm = [0.5, 0.2, 0.15, 0.1, 0.05];

module.exports = {
	fillUpMissingCards,
	fillUpFromLeftToRight,
	boxAlgorithm,
	resetDeadlineMode,
	wrongAnswerMode
};
