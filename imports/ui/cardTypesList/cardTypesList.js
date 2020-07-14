import "./cardTypesList.html";
import {Template} from "meteor/templating";
import {CardType} from "../../api/cardTypes";
import {Cardsets} from "../../api/subscriptions/cardsets";
import {Filter} from "../../api/filter";
import {Session} from "meteor/session";
import {UserPermissions} from "../../api/permissions";
import {ServerStyle} from "../../api/styles";
import {isNewCardset} from "../forms/cardsetForm";

/*
 * ############################################################################
 * category
 * ############################################################################
 */

Template.cardTypesList.helpers({
	getCardTypes: function () {
		return CardType.getCardTypesOrder();
	},
	getCardTypeLongName: function () {
		return CardType.getCardTypeLongName(this.cardType);
	},
	gotShuffledCardsets: function () {
		let query = Filter.getFilterQuery();
		query.shuffled = true;
		return Cardsets.find(query).count();
	},
	filterCardTypes: function (cardType) {
		if (Session.get("selectingCardsetToLearn") && !CardType.gotLearningModes(cardType)) {
			return;
		}
		let query = Filter.getFilterQuery();
		query.cardType = cardType;
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
