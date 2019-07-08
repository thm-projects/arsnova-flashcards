import "./review.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CardVisuals} from "../../../../api/cardVisuals";
import {CardNavigation} from "../../../../api/cardNavigation";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";

/*
 * ############################################################################
 * cardNavigationItemReview
 * ############################################################################
 */

Template.cardNavigationItemReview.onRendered(function () {
	$('#cardCarousel').on('slide.bs.carousel', function () {
		Session.set('animationPlaying', true);
	});
	CardVisuals.resizeFlashcard();
});

Template.cardNavigationItemReview.helpers({
	isQuestionSide: function () {
		return Session.get('isQuestionSide');
	},
	gotOneCardLeft: function () {
		if (Session.get('isQuestionSide')) {
			return $('.carousel-inner > .item').length === 1;
		}
	},
	isPomodoroBreakActive: function () {
		if (Session.get('pomodoroBreakActive') === true) {
			return "disabled";
		}
	}
});

Template.cardNavigationItemReview.events({
	"click #rateTranscript": function () {
		Session.set('isQuestionSide', false);
	},
	"click #skipTranscript": function () {
		CardNavigation.skipAnswer();
		Session.set('isQuestionSide', true);
	},
	"click #acceptTranscript": function () {
		CardNavigation.rateTranscript(true);
		Session.set('isQuestionSide', true);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.transcriptBonusRating.notification.accept'), 'success', 'growl-top-left');
	},
	"click #denyTranscript": function () {
		CardNavigation.rateTranscript(false);
		Session.set('isQuestionSide', true);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.transcriptBonusRating.notification.deny'), 'danger', 'growl-top-left');
	}
});
