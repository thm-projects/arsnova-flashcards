import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {AnswerUtilities} from "../../util/answers";

Meteor.methods({
	getCardAnswerContent: function (cardIds, cardsetId, disableAnswers) {
		check(cardIds, [String]);
		check(cardsetId, String);
		check(disableAnswers, Boolean);

		return AnswerUtilities.getAnswerContent(cardIds, cardsetId, disableAnswers);
	},
	nextMCCard: function (activeCardId, cardsetId, timestamps) {
		check(activeCardId, String);
		check(activeCardId, String);

		AnswerUtilities.nextMCCard(activeCardId, cardsetId, timestamps);
	},
	setMCAnswers: function (cardIds, activeCardId, cardsetId, userAnswers, timestamps) {
		check(cardIds, [String]);
		check(activeCardId, String);
		check(cardsetId, String);
		check(userAnswers, [Number]);

		return AnswerUtilities.setMCAnswers(cardIds, activeCardId, cardsetId, userAnswers, timestamps);
	},
	/** Function marks an active leitner card as learned
	 *  @param {string} cardset_id - The cardset id from the card
	 *  @param {string} card_id - The id from the card
	 *  @param {boolean} answer - 0 = known, 1 = not known
	 *  @param {Object} timestamps - Timestamps for viewing the question and viewing the answer
	 * */
	updateLeitner: function (cardset_id, card_id, answer, timestamps) {
		// Make sure the user is logged in
		if (!Meteor.userId() || Roles.userIsInRole(this.userId, ["firstLogin", "blocked"])) {
			throw new Meteor.Error("not-authorized");
		}
		check(cardset_id, String);
		check(card_id, String);
		check(answer, Boolean);

		return AnswerUtilities.updateSimpleAnswer(cardset_id, card_id, answer, timestamps);
	}
});
