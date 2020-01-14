//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {CardVisuals} from "../../../api/cardVisuals";
import {CardNavigation} from "../../../api/cardNavigation";
import {NavigatorCheck} from "../../../api/navigatorCheck";
import {Session} from "meteor/session";
import './cube.html';

Template.cardCube.onRendered(function () {
	CardVisuals.resizeFlashcard3D();
	let id = CardNavigation.getCardSideNavigationIndex();
	if (id !== undefined) {
		id--;
	} else {
		id = 0;
	}
	CardVisuals.rotateCube(CardNavigation.getCubeSidePosition(id), true);
	CardVisuals.setTextZoom();

	if (!NavigatorCheck.gotFeatureSupport(5)) {
		document.getElementById("cube").addEventListener("transitionend", function () {
			Session.set('is3DTransitionActive', 0);
		});
	}
	$('body').addClass('main3DOverflowContainer');
});

Template.cardCube.onDestroyed(function () {
	$('body').removeClass('main3DOverflowContainer');
});

Template.cardCube.helpers({
	forceSide: function (side) {
		let card = JSON.parse(JSON.stringify(this));
		card.forceSide = side;
		return card;
	}
});
