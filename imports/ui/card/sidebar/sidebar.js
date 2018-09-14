//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../../api/route";
import "./sidebar.html";
import "./item/cardList.js";
import "./item/backToCardset.js";
import "./item/dictionary.js";
import ".//item/endPresentation.js";
import "./item/toggleFullscreen.js";
import "./item/zoomText.js";
import "./item/leftRightNavigation.js";
import "./item/copy.js";
import "./item/delete.js";
import "./item/edit.js";
import {CardNavigation} from "../../../api/cardNavigation";



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
	},
	isFixedSidebar: function () {
		return Session.get('fullscreen') && !Route.isCardset();
	}
});

/*
 * ############################################################################
 * flashcardSidebarDefaultLeft
 * ############################################################################
 */

Template.flashcardSidebarDefaultLeft.helpers({
	isMobileView: function () {
		return CardNavigation.isMobileView();
	}
});


/*
 * ############################################################################
 * flashcardSidebarDefaultRight
 * ############################################################################
 */

Template.flashcardSidebarDefaultRight.helpers({
	isMobileView: function () {
		return CardNavigation.isMobileView();
	}
});

/*
 * ############################################################################
 * flashcardSidebarPresentationLeft
 * ############################################################################
 */

Template.flashcardSidebarPresentationLeft.helpers({
	isMobileView: function () {
		return CardNavigation.isMobileView();
	}
});

/*
 * ############################################################################
 * flashcardSidebarPresentationRight
 * ############################################################################
 */

Template.flashcardSidebarPresentationRight.helpers({
	isMobileView: function () {
		return CardNavigation.isMobileView();
	}
});

/*
 * ############################################################################
 * flashcardSidebarDemoLeft
 * ############################################################################
 */

Template.flashcardSidebarDemoLeft.helpers({
	isMobileView: function () {
		return CardNavigation.isMobileView();
	}
});

/*
 * ############################################################################
 * flashcardSidebarDemoRight
 * ############################################################################
 */

Template.flashcardSidebarDemoRight.helpers({
	isMobileView: function () {
		return CardNavigation.isMobileView();
	}
});
