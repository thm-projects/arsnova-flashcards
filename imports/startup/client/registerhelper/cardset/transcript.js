import {Route} from "../../../../util/route";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {CardType} from "../../../../util/cardTypes";
import {TranscriptBonusList} from "../../../../api/transcriptBonus";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";

Template.registerHelper("gotTranscriptBonus", function (cardset_id) {
	if (Route.isTranscriptBonus() || Route.isMyBonusTranscripts() || Route.isTranscriptBonus()) {
		return true;
	}
	let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, cardGroups: 1, shuffled: 1, cardType: 1}});
	if (cardset !== undefined) {
		if (cardset.shuffled) {
			let cardsetGroup;
			for (let i = 0; i < cardset.cardGroups.length; i++) {
				cardsetGroup = Cardsets.findOne({_id: cardset.cardGroups[i]}, {fields: {_id: 1, cardType: 1}});
				if (cardsetGroup !== undefined && CardType.gotTranscriptBonus(cardsetGroup.cardType)) {
					return true;
				}
			}
		} else if (CardType.gotTranscriptBonus(cardset.cardType)) {
			return true;
		}
	}
});

Template.registerHelper("gotTranscriptBonusAndIsNotShuffled", function (cardset_id) {
	if (Route.isTranscript() || Route.isTranscriptBonus()) {
		return true;
	}
	let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, cardGroups: 1, shuffled: 1, cardType: 1}});
	if (cardset !== undefined && !cardset.shuffled) {
		return CardType.gotTranscriptBonus(cardset.cardType);
	}
});

Template.registerHelper("getTranscriptLectureNameMaxLength", function () {
	return TranscriptBonusList.getTranscriptLectureNameMaxLength();
});

Template.registerHelper("getTranscriptSubmissions", function (data) {
	if (Route.isMyBonusTranscripts() || Route.isTranscriptBonus()) {
		let transcriptBonus = TranscriptBonus.findOne({card_id: data._id, user_id: data.owner}, {fields: {user_id: 1, cardset_id: 1}});
		if (transcriptBonus !== undefined) {
			return TranscriptBonus.find({cardset_id: transcriptBonus.cardset_id, user_id: transcriptBonus.user_id}).count();
		} else {
			return 0;
		}
	}
	if (data.transcriptBonus !== undefined && data.transcriptBonus.stats !== undefined) {
		return data.transcriptBonus.stats.submissions;
	} else {
		return 0;
	}
});
