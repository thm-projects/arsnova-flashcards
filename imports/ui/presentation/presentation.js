//------------------------ IMPORTS

import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./presentation.html";
import {updateNavigation} from "../card/card";

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Session.set('animationPlaying', false);


function run_the_clock() {
	let date = new Date();
	let hr = date.getHours();
	let min = date.getMinutes();
	let sec = date.getSeconds();
	let hrPosition = hr * 360 / 12 + ((min * 360 / 60) / 12);
	let minPosition = (min * 360 / 60) + (sec * 360 / 60) / 60;
	let secPosition = sec * 360 / 60;
	$("#hour").css("transform","rotate(" + hrPosition + "deg)");
	$("#minute").css("transform","rotate(" + minPosition + "deg)");
	$("#second").css("transform","rotate(" + secPosition + "deg)");
}

/*
 * ############################################################################
 * presentationView
 * ############################################################################
 */

Template.presentationView.onRendered(function () {
	updateNavigation();
});

/*
 * ############################################################################
 * endPresentationModal
 * ############################################################################
 */

Template.endPresentationModal.events({
	"click #endPresentationConfirm": function () {
		$('#endPresentationModal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
		$('#endPresentationModal').on('hidden.bs.modal', function () {
			Router.go('cardsetdetailsid', {
				_id: Router.current().params._id
			});
		});
	}
});

/*
 * ############################################################################
 * presentationClock
 * ############################################################################
 */
let clockInterval;
Template.presentationClock.onRendered(function () {
	run_the_clock();
	if (clockInterval === undefined) {
		clockInterval = setInterval(run_the_clock, 1000);
	}
});

Template.presentationClock.onDestroyed(function () {
	if (clockInterval !== undefined) {
		clearInterval(clockInterval);
		clockInterval = undefined;
	}
});
