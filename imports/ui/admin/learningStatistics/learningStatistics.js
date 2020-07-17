//------------------------ IMPORTS
import "../../learn/progress.js";
import "./learningStatistics.html";
import {LeitnerProgress} from "../../../util/leitnerProgress";
import {Template} from "meteor/templating";

Template.admin_learningStatistics.onRendered(function () {
	LeitnerProgress.setupTempData('', '', 'admin');
});


Template.admin_learningStatistics.onDestroyed(function () {
	LeitnerProgress.clearTempData();
});
