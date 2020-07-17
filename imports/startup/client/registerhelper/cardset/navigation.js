import {ServerStyle} from "../../../../util/styles";
import {Route} from "../../../../util/route";
import {isNewCardset} from "../../../../ui/forms/cardsetForm";
import {Session} from "meteor/session";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import {CardVisuals} from "../../../../util/cardVisuals";

Template.registerHelper("isShuffledCardset", function (cardset_id) {
	if (ServerStyle.gotSimplifiedNav() && Route.isMyCardsets() && !isNewCardset() && Session.get('useRepForm')) {
		return true;
	}
	if (cardset_id !== undefined) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {shuffled: 1}});
		if (cardset !== undefined) {
			return cardset.shuffled;
		} else {
			return false;
		}
	}
});

Template.registerHelper("isCardsetStudentPreviewActive", function () {
	return Session.get('isStudentPreviewActive');
});

Template.registerHelper("isCardsetAndFixedSidebar", function () {
	return Route.isCardset() && CardVisuals.isFixedSidebar();
});
