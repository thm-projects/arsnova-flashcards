import "./arsnovaClick.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Session.setDefault('arsnovaClickModalActive', false);

/*
 * ############################################################################
 * cardSidebarItemArsnovaClick
 * ############################################################################
 */

Template.cardSidebarItemArsnovaClick.events({
	"click .showArsnovaClick": function () {
		Session.set('arsnovaClickModalActive', true);
		$('#arsnovaClickModal').modal('show');
	}
});

Template.cardSidebarItemArsnovaClick.onCreated(function () {
	if ($(window).width() >= 768) {
		Session.set('arsnovaClickModalActive', true);
	}
});

Template.cardSidebarItemArsnovaClick.onDestroyed(function () {
	Session.set('arsnovaClickModalActive', false);
});

/*
 * ############################################################################
 * arsnovaClickModal
 * ############################################################################
 */

Template.arsnovaClickModal.onRendered(function () {
	$('#arsnovaClickModal').on('hidden.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click.png');
		$('.showArsnovaClick').removeClass('pressed');
	});
	$('#arsnovaClickModal').on('shown.bs.modal', function () {
		$('.showArsnovaClick').attr('src', '/img/button/arsnova_click_pressed.png');
		$('.showArsnovaClick').addClass('pressed');
	});
});

Template.arsnovaClickModal.helpers({
	isArsnovaClickActive: function () {
		return Session.get('arsnovaClickModalActive');
	}
});
