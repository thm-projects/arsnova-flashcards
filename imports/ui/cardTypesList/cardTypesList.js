import "./cardTypesList.html";
import {Template} from "meteor/templating";
import {CardType} from "../../util/cardTypes";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {Filter} from "../../util/filter";
import {Session} from "meteor/session";
import {UserPermissions} from "../../util/permissions";
import {ServerStyle} from "../../util/styles";
import {isNewCardset} from "../forms/cardsetForm";

/*
 * ############################################################################
 * category
 * ############################################################################
 */

Template.cardTypesList.helpers({
	getCardTypes: function (isFilter = false) {
		let cardTypes = CardType.getCardTypesOrder();
		if (isFilter) {
			return cardTypes;
		} else {
			let filteredCardTypes = [];
			for (let i = 0; i < cardTypes.length; i++) {
				switch (cardTypes[i].cardType) {
					case -1:
						if (cardTypes[i].enabled && ServerStyle.gotSimplifiedNav()) {
							filteredCardTypes.push(cardTypes[i]);
						}
						break;
					default:
						if (this.useCase) {
							if (cardTypes[i].enabled) {
								if (ServerStyle.gotTranscriptsEnabled()) {
									filteredCardTypes.push(cardTypes[i]);
								} else if (!CardType.isTranscriptModeOnlyCardType(cardTypes[i].cardType)) {
									filteredCardTypes.push(cardTypes[i]);
								}
							}
						} else {
							if (cardTypes[i].enabled && !cardTypes[i].useCaseOnly) {
								if (ServerStyle.gotTranscriptsEnabled()) {
									filteredCardTypes.push(cardTypes[i]);
								} else if (!CardType.isTranscriptModeOnlyCardType(cardTypes[i].cardType)) {
									filteredCardTypes.push(cardTypes[i]);
								}
							}
						}
				}
			}
			return filteredCardTypes;
		}
	},
	getCardTypeLongName: function () {
		return CardType.getCardTypeLongName(this.cardType);
	},
	gotShuffledCardsets: function () {
		let query = Filter.getFilterQuery();
		query.shuffled = true;
		delete query.cardType;
		return Cardsets.find(query).count();
	},
	filterCardTypes: function (cardType) {
		if (Session.get("selectingCardsetToLearn") && !CardType.gotLearningModes(cardType)) {
			return;
		}
		let query = Filter.getFilterQuery();
		query.cardType = cardType;
		if (ServerStyle.gotSimplifiedNav()) {
			delete query.shuffled;
		}
		return Cardsets.find(query).count();
	},
	resultsFilterCardType: function (cardType) {
		return Filter.getFilterQuery().cardType === cardType;
	},
	resultFilterShuffled: function () {
		return Filter.getFilterQuery().shuffled === true;
	},
	canCreateCardType: function (cardType) {
		if (CardType.gotTranscriptBonus(cardType)) {
			return (UserPermissions.isLecturer() || UserPermissions.isAdmin());
		} else {
			return true;
		}
	},
	isNotEditCardset: function () {
		if (ServerStyle.gotSimplifiedNav() && isNewCardset()) {
			return true;
		}
	},
	isRepType: function (cardType) {
		return cardType === -1;
	}
});
