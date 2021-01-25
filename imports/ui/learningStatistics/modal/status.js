import "../../learn/progress.js";
import "./status.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {LearningStatus} from "../../../util/learningStatus";

Session.setDefault("learningStatusModalActive", false);

Template.learningStatusModal.onRendered(function () {
	$('#learningStatusModal').on('shown.bs.modal', function () {
		Session.set("learningStatusModalActive", true);
	});
	$('#learningStatusModal').on('hidden.bs.modal', function () {
		Session.set("learningStatusModalActive", false);
		LearningStatus.clearTempData();
		Session.set('lastLearningStatusActivity', undefined);
	});
});

Template.learningStatusModal.helpers({
	getTitle: function () {
		if (Session.get('workloadProgressType') === 'cardset') {
			return TAPi18n.__('learningStatus.titleCardset');
		} else {
			return TAPi18n.__('learningStatus.titleAll');
		}
	},
	isCardsetView: function () {
		return Session.get('workloadProgressType') === 'cardset';
	}
});
