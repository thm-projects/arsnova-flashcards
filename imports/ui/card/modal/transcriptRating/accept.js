import "./accept.html";
import {CardNavigation} from "../../../../api/cardNavigation";
import {Session} from "meteor/session";
import {BertAlertVisuals} from "../../../../api/bertAlertVisuals";
import {Template} from "meteor/templating";
import * as config from "../../../../config/transcriptBonus.js";
Session.setDefault('activeTranscriptStarsRating', config.defaultStarsRating);

/*
 * ############################################################################
 * cardModalTranscriptRatingAccept
 * ############################################################################
 */

Template.cardModalTranscriptRatingAccept.helpers({
	getStarsRatingDescription: function () {
		return TAPi18n.__('cardset.transcriptBonusRating.modal.accept.stars' + Session.get('activeTranscriptStarsRating'));
	},
	getDefaultRating: function () {
		return config.defaultStarsRating;
	}
});

Template.cardModalTranscriptRatingAccept.events({
	'click #rating': function () {
		Session.set('activeTranscriptStarsRating', Number($('#rating').data('userrating')));
	},
	"click #acceptTranscript": function () {
		CardNavigation.rateTranscript(true, [Session.get('activeTranscriptStarsRating')]);
		Session.set('isQuestionSide', true);
		BertAlertVisuals.displayBertAlert(TAPi18n.__('cardset.transcriptBonusRating.notification.accept'), 'success', 'growl-top-left');
		$('#cardModalTranscriptRatingAccept').modal('hide');
		$('.modal-backdrop').css('display', 'none');
	}
});

Template.cardModalTranscriptRatingAccept.onRendered(function () {
	$('#cardModalTranscriptRatingAccept').on('show.bs.modal', function () {
		Session.set('activeTranscriptStarsRating', config.defaultStarsRating);
		$('#rating .star-' + config.defaultStarsRating).click();
	});
	$('#cardModalTranscriptRatingAccept').on('hidden.bs.modal', function () {
		Session.set('activeTranscriptStarsRating', config.defaultStarsRating);
	}).modal('hide');
});
