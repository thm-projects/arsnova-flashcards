import {ServerStyle} from "../../../../api/styles";
import {Icons} from "../../../../api/icons";
import {Route} from "../../../../api/route";
import {CardType} from "../../../../api/cardTypes";

Template.registerHelper("getBonusLabel", function (learningActive = false, learningEnd = new Date()) {
	if (learningActive && ServerStyle.gotNavigationFeature("misc.features.bonus")) {
		if (learningEnd < new Date()) {
			return '<span class="label label-bonus-finished" title="' + TAPi18n.__('cardset.bonus.long') + '">' + TAPi18n.__('cardset.bonus.short') + '</span>';
		} else {
			return '<span class="label label-bonus" title="' + TAPi18n.__('cardset.bonus.long') + '">' + TAPi18n.__('cardset.bonus.short') + '</span>';
		}
	}
});

Template.registerHelper("getUseCaseLabel", function (cardset) {
	if (cardset.lecturerAuthorized !== undefined && cardset.useCase !== undefined && cardset.useCase.enabled === true) {
		return '<span class="label label-use-case" title="' + TAPi18n.__('label.useCase.long') + '">' + Icons.labels("useCase") + '</span>';
	}
});

Template.registerHelper("getLecturerAuthorizedLabel", function (cardset) {
	if (cardset.lecturerAuthorized !== undefined && cardset.lecturerAuthorized === true) {
		return '<span class="label label-lecturer-authorized" title="' + TAPi18n.__('label.lecturerAuthorized.long') + '">' + Icons.labels("lecturerAuthorized") + '</span>';
	}
});

Template.registerHelper("getWordcloudLabel", function (cardset) {
	if (cardset.wordcloud !== undefined && cardset.wordcloud === true) {
		return '<span class="label label-wordcloud" title="' + TAPi18n.__('serverStatistics.modal.table.header.wordcloud.default') + '">' + Icons.labels("wordcloud") + '</span>';
	}
});

Template.registerHelper("getTranscriptBonusLabel", function (cardset) {
	if ((cardset.transcriptBonus !== undefined && cardset.transcriptBonus.enabled) || Route.isMyBonusTranscripts() || Route.isTranscriptBonus() || Route.isPresentationTranscriptBonus() || Route.isPresentationTranscriptBonusCardset() || Route.isPresentationTranscriptReview()) {
		return '<span class="label label-transcript-bonus" title="' + TAPi18n.__('cardset.transcriptBonus.long') + '">' + TAPi18n.__('cardset.transcriptBonus.short') + '</span>';
	}
});

Template.registerHelper("getCardTypeLabel", function (cardType) {
	return '<span class="label label-card-type" data-id="' + cardType + '" title="' + TAPi18n.__('card.cardType' + cardType + '.longName') + '">' + TAPi18n.__('card.cardType' + cardType + '.name') + '</span>';
});

Template.registerHelper("getDifficultyLabel", function (cardType, difficulty) {
	if (!CardType.gotDifficultyLevel(cardType)) {
		return;
	}
	return '<span class="label label-difficulty label-difficulty' + difficulty + '" data-id="' + difficulty + '" title="' + TAPi18n.__('difficulty' + difficulty) + '">' + TAPi18n.__('difficulty' + difficulty) + '</span>';
});

Template.registerHelper("getShuffleLabel", function (shuffled = false) {
	if (shuffled) {
		return '<span class="label label-shuffled" data-id="shuffled" title="' + TAPi18n.__('cardset.shuffled.long') + '">' + TAPi18n.__('cardset.shuffled.short') + '</span>';
	}
});
