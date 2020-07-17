//------------------------ IMPORTS

import {Template} from "meteor/templating";
import {CardVisuals} from "../../../util/cardVisuals";
import "./sidebar.html";
import "./item/aspectRatio.js";
import "./item/arsnovaClick.js";
import "./item/arsnovaLite.js";
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
import "./item/leitnerGraph.js";
import "./item/leitnerHistory.js";
import {Route} from "../../../util/route";
import {Bonus} from "../../../util/bonus";
import {NavigatorCheck} from "../../../util/navigatorCheck";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

/*
 * ############################################################################
 * flashcardSidebarLeft
 * ############################################################################
 */

Template.flashcardSidebarLeft.onRendered(function () {
	CardVisuals.setSidebarPosition();
});

Template.flashcardSidebarLeft.helpers({
	gotElements: function () {
		if (Route.isBox() && NavigatorCheck.isSmartphone()) {
			return !Bonus.isInBonus(FlowRouter.getParam('_id'));
		} else {
			return !Route.isTranscript();
		}
	}
});

/*
 * ############################################################################
 * flashcardSidebarRight
 * ############################################################################
 */


Template.flashcardSidebarRight.onRendered(function () {
	CardVisuals.setSidebarPosition();
});
