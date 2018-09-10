//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Route} from "../../../api/route";
import "./sidebar.html";
import "./item/cardList.js";
import "./item/contrast.js";
import "./item/backToCardset.js";
import "./item/dictionary.js";
import ".//item/endPresentation.js";
import "./item/toggleFullscreen.js";
import "./item/zoomText.js";
import "./item/leftRightNavigation.js";
import "./item/copy.js";
import "./item/delete.js";
import "./item/edit.js";



/*
 * ############################################################################
 * flashcardSidebar
 * ############################################################################
 */

Template.flashcardSidebar.helpers({
	isCardset: function () {
		return Route.isCardset();
	},
	isPresentation: function () {
		return Route.isPresentation();
	},
	isMakingOf: function () {
		return Route.isMakingOf();
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
