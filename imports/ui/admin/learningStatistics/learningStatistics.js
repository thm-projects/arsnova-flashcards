//------------------------ IMPORTS
import "../../learn/progress.js";
import "./learningStatistics.html";
import {LearningStatus} from "../../../util/learningStatus";
import {Template} from "meteor/templating";

Template.admin_learningStatistics.onRendered(function () {
	LearningStatus.setupTempData('', '', 'admin');
});


Template.admin_learningStatistics.onDestroyed(function () {
	LearningStatus.clearTempData();
});
