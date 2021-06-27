import {ServerStyle} from "../../../../util/styles";
import {Icons} from "../../../../util/icons";
import {Route} from "../../../../util/route";
import {CardType} from "../../../../util/cardTypes";
import {Cards} from "../../../../api/subscriptions/cards";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {TranscriptBonus} from "../../../../api/subscriptions/transcriptBonus";
import {BONUS_STATUS} from "../../../../config/cardset.js";

function getCardErrorCount(card_id) {
	let errorCount = 0;
	Cards.find({_id: card_id}, {unresolvedErrors: 1}).forEach(card => {
		errorCount += card.unresolvedErrors;
	});
	return errorCount;
}

Template.registerHelper("getBonusLabel", function (cardset_id) {
	let cardset = Cardsets.findOne({_id: cardset_id});
	if (cardset !== undefined && ServerStyle.gotNavigationFeature("misc.features.bonus")) {
		switch (cardset.bonusStatus) {
			case BONUS_STATUS.ONGOING_OPEN:
			case BONUS_STATUS.ONGOING_CLOSED:
				return `<span class="label label-bonus-finished" title="${TAPi18n.__('cardset.bonus.long')}">${TAPi18n.__('cardset.bonus.short')}</span>`;
			case BONUS_STATUS.FINISHED:
				return `<span class="label label-bonus" title="${TAPi18n.__('cardset.bonus.long')}">${TAPi18n.__('cardset.bonus.short')}</span>`;
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

Template.registerHelper("getTranscriptBonusLabel", function (target) {
	if (Route.isMyTranscripts() || Route.isMyBonusTranscripts()) {
		let transcriptBonus = TranscriptBonus.findOne({card_id: target._id});
		if (transcriptBonus !== undefined) {
			target = Cardsets.findOne({_id: transcriptBonus.cardset_id});
		}
	}
	if ((target.transcriptBonus !== undefined && target.transcriptBonus.enabled) || Route.isMyBonusTranscripts() || Route.isTranscriptBonus() || Route.isPresentationTranscriptBonus() || Route.isPresentationTranscriptBonusCardset() || Route.isPresentationTranscriptReview()) {
		return '<span class="label label-transcript-bonus" title="' + TAPi18n.__('cardset.transcriptBonus.long') + '">' + TAPi18n.__('cardset.transcriptBonus.short') + '</span>';
	}
});

Template.registerHelper("getErrorReportingLabel", function (card_id) {
	if (getCardErrorCount(card_id) > 0) {
		return '<span class="label label-error-reporting card-error-label" title="' + TAPi18n.__('label.errorReporting.long') + '">' + TAPi18n.__('label.errorReporting.title') + ' (' + getCardErrorCount(card_id) + ')' + '</span>';
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
