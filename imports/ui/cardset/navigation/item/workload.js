//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {CardType} from "../../../../api/cardTypes";
import {Leitner, Wozniak} from "../../../../api/learned";
import {Cardsets} from "../../../../api/cardsets";
import {CardsetNavigation} from "../../../../api/cardsetNavigation";
import "../modal/leitner.js";
import "../modal/wozniak.js";
import "../modal/chooseFlashcards.js";
import "./workload.html";

/*
 * ############################################################################
 * cardsetNavigationWorkload
 * ############################################################################
 */

Template.cardsetNavigationWorkload.helpers({
	gotLearningModes: function () {
		if (this.shuffled) {
			for (let i = 0; i < this.cardGroups.length; i++) {
				if (CardType.gotLearningModes(Cardsets.findOne(this.cardGroups[i]).cardType)) {
					return true;
				}
			}
		} else {
			return CardType.gotLearningModes(this.cardType);
		}
	},
	learningLeitner: function () {
		return Leitner.findOne({cardset_id: Router.current().params._id, user_id: Meteor.userId()});
	},
	learningMemo: function () {
		return Wozniak.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId()});
	}
});

Template.cardsetNavigationWorkload.events({
	"click #learnBox": function () {
		CardsetNavigation.addToLeitner(this._id);
		Router.go('box', {
			_id: this._id
		});
	},
	"click #learnMemo": function () {
		Meteor.call("addWozniakCards", this._id);
		Router.go('memo', {
			_id: this._id
		});
	},
	"click #leitnerProgress": function () {
		Router.go('progress', {
			_id: this._id,
			user_id: Meteor.userId()
		});
	}
});
