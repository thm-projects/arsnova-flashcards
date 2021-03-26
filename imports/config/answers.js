let randomizeByDefault = true;

let success;
let fail;

if (!Meteor.isServer) {
	success = new Audio('/audio/correct-bell.mp3');
	fail = new Audio('/audio/bad-bell.mp3');
}

module.exports = {
	randomizeByDefault,
	success,
	fail
};

