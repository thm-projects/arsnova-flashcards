//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {CardVisuals} from "../../../api/cardVisuals";
import "./sidebar.html";
import "./item/aspectRatio.js";
import "./item/arsnovaClick.js";
import "./item/arsnovaApp.js";
import "./item/cardList.js";
import "./item/backToCardset.js";
import "./item/dictionary.js";
import ".//item/endPresentation.js";
import "./item/toggleFullscreen.js";
import "./item/hideSidebar.js";
import "./item/zoomText.js";
import "./item/leftRightNavigation.js";
import "./item/copy.js";
import "./item/delete.js";
import "./item/edit.js";
import "./item/pomodoroButton.js";
import "./item/help.js";
import "./item/swapQuestionAnswer.js";
import "./item/presentation.js";
import "./item/toggle3D.js";

/*
 * ############################################################################
 * flashcardSidebarLeft
 * ############################################################################
 */

Template.flashcardSidebarLeft.onRendered(function () {
	CardVisuals.setSidebarPosition();
});

/*
 * ############################################################################
 * flashcardSidebarRight
 * ############################################################################
 */


Template.flashcardSidebarRight.onRendered(function () {
	CardVisuals.setSidebarPosition();
});
