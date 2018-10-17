import "./arsnovaApp.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Session.setDefault('arsnovaAppModalActive', false);

/*
 * ############################################################################
 * cardSidebarItemArsnovaApp
 * ############################################################################
 */

Template.cardSidebarItemArsnovaApp.events({
	"click .showArsnovaApp": function () {
		Session.set('arsnovaAppModalActive', true);
		$('#arsnovaAppModal').modal('show');
	}
});

Template.cardSidebarItemArsnovaApp.onCreated(function () {
	if ($(window).width() >= 768) {
		Session.set('arsnovaAppModalActive', true);
	}
});

Template.cardSidebarItemArsnovaApp.onDestroyed(function () {
	Session.set('arsnovaAppModalActive', false);
});

/*
 * ############################################################################
 * arsnovaAppModal
 * ############################################################################
 */

Template.arsnovaAppModal.onRendered(function () {
	$('#arsnovaAppModal').on('hidden.bs.modal', function () {
		$('.showArsnovaApp').attr('src', '/img/button/arsnova_app.png');
		$('.showArsnovaApp').removeClass('pressed');
	});
	$('#arsnovaAppModal').on('shown.bs.modal', function () {
		$('.showArsnovaApp').attr('src', '/img/button/arsnova_app_pressed.png');
		$('.showArsnovaApp').addClass('pressed');
	});
});

Template.arsnovaAppModal.helpers({
	isArsnovaAppModalActive: function () {
		return Session.get('arsnovaAppModalActive');
	}
});
