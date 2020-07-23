function continuePresentation() {
	return {
		title: TAPi18n.__('sweetAlert.presentation.continue.title'),
		html: TAPi18n.__('sweetAlert.presentation.continue.text'),
		type: "warning",
		showCancelButton: true,
		confirmButtonText: TAPi18n.__('sweetAlert.presentation.continue.button.confirm'),
		cancelButtonText: TAPi18n.__('sweetAlert.presentation.continue.button.cancel'),
		allowOutsideClick: false,
		footer: TAPi18n.__('sweetAlert.presentation.continue.footer')
	};
}

function completeProfile() {
	return {
		title: TAPi18n.__('sweetAlert.completeProfile.title'),
		html: TAPi18n.__('sweetAlert.completeProfile.text'),
		type: "warning",
		showCancelButton: true,
		confirmButtonText: TAPi18n.__('sweetAlert.completeProfile.button.confirm'),
		cancelButtonText: TAPi18n.__('sweetAlert.completeProfile.button.cancel'),
		allowOutsideClick: false,
		footer: TAPi18n.__('sweetAlert.completeProfile.footer')
	};
}

function chooseFullscreenMode() {
	return {
		title: TAPi18n.__('sweetAlert.choose.title'),
		html: TAPi18n.__('sweetAlert.choose.text'),
		type: "question",
		showCancelButton: true,
		confirmButtonText: TAPi18n.__('sweetAlert.choose.button.confirm'),
		cancelButtonText: TAPi18n.__('sweetAlert.choose.button.cancel'),
		allowOutsideClick: false,
		footer: TAPi18n.__('sweetAlert.choose.footer')
	};
}

function activateFullscreen() {
	return {
		title: TAPi18n.__('sweetAlert.fullscreen.title'),
		html: TAPi18n.__('sweetAlert.fullscreen.text'),
		type: "warning",
		showCancelButton: true,
		confirmButtonText: TAPi18n.__('sweetAlert.fullscreen.button.confirm'),
		cancelButtonText: TAPi18n.__('sweetAlert.fullscreen.button.cancel'),
		allowOutsideClick: false,
		footer: TAPi18n.__('sweetAlert.fullscreen.footer')
	};
}

//Currently unused
function exitPresentation() {
	return {
		title: TAPi18n.__('sweetAlert.presentation.end.title'),
		html: TAPi18n.__('sweetAlert.presentation.end.text'),
		type: "warning",
		showCancelButton: true,
		confirmButtonText: TAPi18n.__('sweetAlert.presentation.end.button.confirm'),
		cancelButtonText: TAPi18n.__('sweetAlert.presentation.end.button.cancel'),
		allowOutsideClick: false,
		footer: TAPi18n.__('sweetAlert.presentation.end.footer')
	};
}

function leitnerSimulatorError() {
	return {
		title: TAPi18n.__('sweetAlert.leitnerSimulatorError.title'),
		html: TAPi18n.__('sweetAlert.leitnerSimulatorError.text'),
		type: "warning",
		showCancelButton: false,
		confirmButtonText: TAPi18n.__('sweetAlert.leitnerSimulatorError.button.confirm'),
		allowOutsideClick: false,
		footer: TAPi18n.__('sweetAlert.leitnerSimulatorError.footer')
	};
}

module.exports = {
	continuePresentation,
	completeProfile,
	activateFullscreen,
	exitPresentation,
	leitnerSimulatorError,
	chooseFullscreenMode
};
