import "./cardEditor.html";
import "../../card.js";
import {Session} from "meteor/session";
import {CardType} from "../../api/cardTypes";
import {Template} from "meteor/templating";
import {Cards} from "../../api/cards";
import {Cardsets} from "../../api/cardsets";
import {CardEditor} from "../../api/cardEditor.js";
import {Route} from "../../api/route.js";

Template.btnCard.helpers({
	isEditMode: function () {
		return Route.isEditMode();
	},
	learningActive: function () {
		return Cardsets.findOne(Router.current().params._id).learningActive;
	}
});

Template.btnCard.events({
	"click #cardSave": function () {
		CardEditor.saveCard(Router.current().params.card_id, false);
	},
	"click #cardSaveReturn": function () {
		CardEditor.saveCard(Router.current().params.card_id, true);
	}
});
