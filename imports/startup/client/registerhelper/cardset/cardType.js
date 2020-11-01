import {Session} from "meteor/session";
import {CardType as CardTypes} from "../../../../util/cardTypes";

Template.registerHelper('gotArsnovaClick', function (cardType) {
	if (this.shuffled) {
		return true;
	}
	if (cardType === undefined) {
		cardType = Session.get('cardType');
	}
	return CardTypes.gotArsnovaClick(cardType);
});


Template.registerHelper('gotFragJetzt', function (cardType) {
	if (this.shuffled) {
		return true;
	}
	if (cardType === undefined) {
		cardType = Session.get('cardType');
	}
	return CardTypes.gotFragJetzt(cardType);
});


Template.registerHelper('gotNoSideContent', function (cardType) {
	if (cardType === undefined) {
		cardType = Session.get('cardType');
	}
	return CardTypes.gotNoSideContent(cardType);
});
