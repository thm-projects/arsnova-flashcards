import "../progress.js";
import "./progress.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {LeitnerProgress} from "../../../util/leitnerProgress";

Session.setDefault("progressModalActive", false);

Template.progressModal.onRendered(function () {
	$('#progressModal').on('shown.bs.modal', function () {
		Session.set("progressModalActive", true);
	});
	$('#progressModal').on('hidden.bs.modal', function () {
		Session.set("progressModalActive", false);
		LeitnerProgress.clearTempData();
	});
});

Template.progressModal.helpers({
	getTitle: function () {
		if (Session.get('workloadProgressType') === 'cardset') {
			return TAPi18n.__('leitnerProgress.modal.progress.titleCardset');
		} else {
			return TAPi18n.__('leitnerProgress.modal.progress.titleAll');
		}
	},
	isCardsetView: function () {
		return Session.get('workloadProgressType') === 'cardset';
	}
});
