import {CardNavigation} from "./cardNavigation";
import {Session} from "meteor/session";
import {Cards} from "../api/subscriptions/cards";
import {Cardsets} from "../api/subscriptions/cardsets";

export let ErrorReporting = class ErrorReporting {

	static loadErrorReportingModal (error) {
		let errorReportingMode = Session.get('errorReportingMode');
		if (error && (error.length || error.length === undefined)) {
			let errorItem;
			if (error.length > 0) {
				errorItem = error[0];
			} else {
				errorItem = error;
			}
			$('#sendErrorReport').addClass('hidden');
			$('#saveErrorReport').removeClass('hidden');
			Session.set('activeErrorReport', errorItem._id);
			this.setActiveCardSide(errorItem.cardSide, errorReportingMode);
			this.setErrorsInErrorReportingModal(errorItem.error.type, errorItem.error.content, errorReportingMode);
			this.setErrorStatus(errorItem.status);
		} else {
			$('#sendErrorReport').removeClass('hidden');
			$('#saveErrorReport').addClass('hidden');
			Session.set('activeErrorReport', undefined);
			this.setActiveCardSide(CardNavigation.getCardSideNavigationIndex() - 1, errorReportingMode);
			this.setErrorsInErrorReportingModal([], "", errorReportingMode);
		}
	}

	static setErrorsInErrorReportingModal (checkedErrors, otherErrorText, disabled = false) {
		$('#spellingMistakeCheckbox').prop("checked", checkedErrors.includes(0));
		$('#spellingMistakeCheckbox').prop("disabled", disabled);
		$('#missingPictureCheckbox').prop("checked", checkedErrors.includes(1));
		$('#missingPictureCheckbox').prop("disabled", disabled);
		$('#layoutMistakeCheckbox').prop("checked", checkedErrors.includes(2));
		$('#layoutMistakeCheckbox').prop("disabled", disabled);
		$('#brokenLinkCheckbox').prop("checked", checkedErrors.includes(3));
		$('#brokenLinkCheckbox').prop("disabled", disabled);
		$('#otherErrorTextarea').val(otherErrorText);
		$('#otherErrorTextarea').prop("disabled", disabled);
	}

	static setActiveCardSide (activeIndex, disabled = false) {
		let count = CardNavigation.getCardSideNavigationLength();
		let labelId = "";
		let inputId = "";
		for (let i = 0; i < count; i++) {
			labelId = "#cardNaviionButtonLabel-" + i;
			inputId = "#cardNaviionButton-" + i;
			if (activeIndex === i) {
				$(labelId).addClass('active');
				$(inputId).attr("checked", true);
			} else {
				$(labelId).removeClass('active');
				$(inputId).attr("checked", false);
			}
			$(labelId).attr("disabled", disabled);
			$(inputId).attr("disabled", disabled);
		}
	}

	static setErrorStatus (status) {
		if (Session.get('errorReportingMode')) {
			if (status === 0) {
				$('#openError').attr("checked", true);
				$('#closedError').attr("checked", false);
			} else {
				$('#openError').attr("checked", false);
				$('#closedError').attr("checked", true);
			}
		}
	}

	static hasCardUnresolvedErrors (card_id) {
		let unresolvedErrors = false;
		Cards.find({_id: card_id}).forEach(card => {
			unresolvedErrors = card.unresolvedErrors > 0;
		});
		return unresolvedErrors;
	}

	static getErrorCountFromCardset (cardset_id) {
		let errorCount = 0;
		Cardsets.find({_id: cardset_id}, {unresolvedErrors: 1}).forEach(cardset => {
			errorCount = cardset.unresolvedErrors;
		});
		return errorCount;
	}

	static getErrorCountFromCard (card_id) {
		let errorCount = 0;
		Cards.find({_id: card_id}, {unresolvedErrors: 1}).forEach(card => {
			errorCount = card.unresolvedErrors;
		});
		return errorCount;
	}
};
