let defaultSettings = {
	goal: 2,
	work: {
		length: 25,
		max: 45,
		min: 15,
		step: 5
	},
	break: {
		length: 5,
		max: 15,
		min: 5,
		step: 5
	},
	longBreak: {
		goal: 4,
		length: 30
	},
	sounds: {
		bell: true,
		success: true,
		failure: true
	}
};

let defaultPresentationSettings = {
	goal: 2,
	work: {
		length: 40,
		max: 45,
		min: 15,
		step: 5
	},
	break: {
		length: 5,
		max: 15,
		min: 5,
		step: 5
	},
	longBreak: {
		goal: 4,
		length: 5
	},
	sounds: {
		bell: true,
		success: false,
		failure: false
	}
};

let defaultDemoSettings = {
	goal: 1,
	work: {
		length: 20,
		max: 45,
		min: 10,
		step: 5
	},
	break: {
		length: 5,
		max: 15,
		min: 5,
		step: 5
	},
	longBreak: {
		goal: 4,
		length: 10
	},
	sounds: {
		bell: true,
		success: true,
		failure: true
	}
};

let bellSound;
let failSound;
let successSound;

if (!Meteor.isServer) {
	bellSound = new Audio('/audio/Schulgong.mp3');
	failSound = new Audio('/audio/fail.mp3');
	successSound = new Audio('/audio/success.mp3');
}


module.exports = {
	defaultSettings,
	defaultPresentationSettings,
	defaultDemoSettings,
	bellSound,
	failSound,
	successSound
};
