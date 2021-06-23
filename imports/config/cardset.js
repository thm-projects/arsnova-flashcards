//Settings for new cardsets
let defaultSortTopicContentByDateCreate = true;

let kindsOwnedByServer = ['demo', 'makingOf', 'server'];
let kindsVisibleToThePublic = ['free', 'edu', 'pro'];

const NONE = 0;
const PLANNED = 1;
const ONGOING_OPEN = 2;
const ONGOING_CLOSED = 3;
const FINISHED = 4;
const ARCHIVED = 5;

const BONUS_STATUS = {
	NONE,
	PLANNED,
	ONGOING_OPEN,
	ONGOING_CLOSED,
	FINISHED,
	ARCHIVED
};

module.exports = {
	defaultSortTopicContentByDateCreate,
	kindsOwnedByServer,
	kindsVisibleToThePublic,
	BONUS_STATUS
};
