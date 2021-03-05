import "./flipCard.html";
import {Template} from "meteor/templating";
import {CardVisuals} from "../../../util/cardVisuals";
import {CardNavigation} from "../../../util/cardNavigation";

Template.flipCard.onRendered(function () {
	CardVisuals.changeFlipCardClasses();
	let id = CardNavigation.getCardSideNavigationIndex();
	CardNavigation.getCardSideNavigationIndex();
	if (id !== undefined) {
		id--;
	}
	CardVisuals.flipCard(id, true);
	CardVisuals.setTextZoom();
	$('body').addClass('main3DOverflowContainer');
});

Template.flipCard.onDestroyed(function () {
	$('body').removeClass('main3DOverflowContainer');
	$('.carousel-inner').removeClass('flip-card-overflow');
	CardVisuals.changeFlipCardClasses(false);
});

Template.flipCard.helpers({
	forceSide: function (side) {
		let card = JSON.parse(JSON.stringify(this));
		card.forceSide = side;
		return card;
	}
});

