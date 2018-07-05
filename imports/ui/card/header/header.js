import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import "./header.html";
import "./left/left.js";
import "./right/right.js";
import "./item/cardList.js";
import "./center/center.js";
import "./item/clock.js";
import "./item/copy.js";
import "./item/countCards.js";
import "./item/countCardsLeitner.js";
import "./item/delete.js";
import "./item/dictionary.js";
import "./item/edit.js";
import "./item/endPresentation.js";
import "./item/toggleFullscreen.js";


/*
 * ############################################################################
 * flashcardHeader
 * ############################################################################
 */

Template.flashcardHeader.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isPresentation: function () {
		return Route.isPresentation();
	},
	isDemo: function () {
		return Route.isDemo();
	},
	isEditMode: function () {
		return Route.isEditMode();
	},
	isBox: function () {
		return Route.isBox();
	},
	isMemo: function () {
		return Route.isMemo();
	}
});
