//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./participants.html";

/*
* ############################################################################
* cardsetInfoBoxItemTranscriptParticipants
* ############################################################################
*/

Template.cardsetInfoBoxItemTranscriptParticipants.helpers({
	getParticipants: function (cardset) {
		if (cardset.transcriptBonus !== undefined && cardset.transcriptBonus.stats !== undefined) {
			return cardset.transcriptBonus.stats.participants;
		}
	}
});
