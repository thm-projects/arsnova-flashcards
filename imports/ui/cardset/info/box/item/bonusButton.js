//------------------------ IMPORTS
import {Session} from "meteor/session";
import {Template} from "meteor/templating";
import {Bonus} from "../../../../../api/bonus";
import {Profile} from "../../../../../api/profile";
import "./bonusButton.html";

/*
* ############################################################################
* cardsetInfoBoxItemBonusButton
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusButton.helpers({
	canJoinBonus: function () {
		return Bonus.canJoinBonus(Session.get('activeCardset')._id);
	},
	isInBonus: function () {
		return Bonus.isInBonus(Session.get('activeCardset')._id);
	},
	isProfileCompleted: function () {
		return Profile.isCompleted();
	}
});
