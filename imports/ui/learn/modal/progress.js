import "../progress.js";
import "./progress.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {getAuthorName} from "../../../api/userdata";
import {LeitnerProgress} from "../../../api/leitnerProgress";


Template.progressModal.onRendered(function () {
	$('#progressModal').on('hidden.bs.modal', function () {
		LeitnerProgress.clearTempData();
	});
});

Template.progressModal.helpers({
	getChartTitle: function () {
		if (Session.get('workloadProgressType') === 'cardset') {
			let cardsetCollection = LeitnerProgress.getCardsetCollection();
			let cardset = cardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')});
			let title = '»' + cardset.name + '«';
			if (Meteor.userId() === Session.get('workloadProgressUserID')) {
				return TAPi18n.__('admin.myProgress') + title;
			} else {
				return title + ' | ' + TAPi18n.__('admin.userProgress') + ' »' + getAuthorName(Session.get('workloadProgressUserID')) + '«';
			}
		} else {
			return TAPi18n.__('admin.allLearnedCardsets');
		}
	}
});
