import "./review.html";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {CardVisuals} from "../../../../util/cardVisuals";
import {CardNavigation} from "../../../../util/cardNavigation";
import {TranscriptBonusList} from "../../../../util/transcriptBonus";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";
import {Route} from "../../../../util/route";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

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
			return Session.get('activeIndexLength') === 1;
		}
	},
	canRateTranscript: function () {
		if (Route.isPresentationTranscriptReview()) {
			return true;
		} else {
			let transcriptBonus = TranscriptBonus.findOne({card_id: FlowRouter.getParam('card_id')});
			return TranscriptBonusList.isDeadlineExpired(transcriptBonus, true);
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
		$('#cardModalTranscriptRatingAccept').modal('show');
	},
	"click #denyTranscript": function () {
		$('#cardModalTranscriptRatingDeny').modal('show');
	}
});
