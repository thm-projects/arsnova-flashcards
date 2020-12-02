import "../progress.js";
import "./progress.html";
import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {getAuthorName} from "../../../util/userData";
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
	getChartTitle: function () {
		if (Session.get('workloadProgressType') === 'cardset') {
			let cardsetCollection = LeitnerProgress.getCardsetCollection();
			let cardset = cardsetCollection.findOne({_id: Session.get('workloadProgressCardsetID')});
			let title = '»' + cardset.name + '«';
			if (Meteor.userId() === Session.get('workloadProgressUserID')) {
				return TAPi18n.__('admin.myProgress') + title;
			} else {
				let userName;
				if (Session.get('hideUserNames')) {
					userName = TAPi18n.__('leitnerProgress.hiddenUserPlaceholder', {index: Session.get('selectedBonusUser').index});
				} else {
					userName = getAuthorName(Session.get('workloadProgressUserID'));
				}
				return title + ' | ' + TAPi18n.__('admin.userProgress') + ' »' + userName + '«';
			}
		} else {
			return TAPi18n.__('admin.allLearnedCardsets');
		}
	}
});
