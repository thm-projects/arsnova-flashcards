import "./clock.html";

function updatePresentationClock() {
	let date = new Date();
	let hr = date.getHours();
	let min = date.getMinutes();
	let sec = date.getSeconds();
	let hrPosition = hr * 360 / 12 + ((min * 360 / 60) / 12);
	let minPosition = min * 360 / 60;
	let secPosition = sec * 360 / 60;
	$(".hour").css("transform", "rotate(" + hrPosition + "deg)");
	$(".minute").css("transform", "rotate(" + minPosition + "deg)");
	$(".second").css("transform", "rotate(" + secPosition + "deg)");
}

/*
 * ############################################################################
 * presentationClock
 * ############################################################################
 */
let clockInterval;
Template.cardHeaderItemClock.onRendered(function () {
	updatePresentationClock();
	if (clockInterval === undefined) {
		clockInterval = setInterval(updatePresentationClock, 1000);
	}
});

Template.cardHeaderItemClock.onDestroyed(function () {
	if (clockInterval !== undefined) {
		clearInterval(clockInterval);
		clockInterval = undefined;
	}
});
