//------------------------ IMPORTS
import {Template} from "meteor/templating";
import "./item/activeLearners.js";
import "./item/author.js";
import "./item/cardCount.js";
import "./item/cardType.js";
import "./item/dateCreated.js";
import "./item/dateUpdated.js";
import "./item/difficulty.js";
import "./item/kind.js";
import "./item/learningMode.js";
import "./item/license.js";
import "./item/originalAuthor.js";
import "./item/price.js";
import "./item/purchased.js";
import "./item/ratings.js";
import "./item/reviewer.js";
import "./cardset.html";
import {CardsetVisuals} from "../../../../api/cardsetVisuals";

/*
 * ############################################################################
 * cardsetInfoBox
 * ############################################################################
 */

Template.cardsetInfoBox.onRendered(function () {
	$('[data-toggle="tooltip"]').tooltip({
		container: 'body'
	});
});

Template.cardsetInfoBox.helpers({
	getColors: function () {
		switch (this.kind) {
			case "personal":
				return "btn-warning";
			case "free":
				return "btn-info";
			case "edu":
				return "btn-success";
			case "pro":
				return "btn-danger";
			case "demo":
				return "btn-demo";
		}
	},
	getName: function () {
		let shuffled = "";
		if (this.shuffled) {
			shuffled = TAPi18n.__('admin.shuffled') + " ";
		}
		return shuffled;
	}
});


Template.cardsetInfoBox.events({
	"click #collapseCardsetInfoButton": function () {
		CardsetVisuals.changeCollapseElement("#collapseCardsetInfo");
	}
});
