import {Meteor} from "meteor/meteor";
import {CardType} from "../../../../../util/cardTypes";
import {Session} from "meteor/session";
import "./label.html";

/*
 * ############################################################################
 * cardContentItemLabel
 * ############################################################################
 */

Template.cardContentItemLabel.helpers({
	gotDifficulty: function (cardType) {
		return CardType.gotDifficultyLevel(cardType);
	}
});

Template.cardContentItemLabel.events({
	'click .card-error-label': function () {
		Meteor.call("getCardErrors", Session.get('activeCard'), function (err, res) {
			if (!err) {
				Session.set('errorReportingCard', res);
			}
		});
		Session.set('errorReportingMode', true);
		$('#showOverviewErrorReportsModal').modal('show');
	}
});
