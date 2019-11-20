//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {CardType} from "../../../../api/cardTypes";
import {Workload} from "../../../../api/subscriptions/workload";
import {Wozniak} from "../../../../api/subscriptions/wozniak";
import {Cardsets} from "../../../../api/subscriptions/cardsets";
import "../modal/chooseFlashcards.js";
import "../modal/leitner.js";
import "../modal/wozniak.js";
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
		let workload = Workload.findOne({cardset_id: Router.current().params._id, user_id: Meteor.userId()});
		if (workload !== undefined && workload.leitner !== undefined && workload.leitner.active !== undefined) {
			return workload.leitner.active;
		}
	},
	learningMemo: function () {
		return Wozniak.findOne({
			cardset_id: Router.current().params._id,
			user_id: Meteor.userId()});
	}
});

Template.cardsetNavigationWorkload.events({
	"click #learnBox": function () {
		Router.go('box', {
			_id: this._id
		});
	},
	"click #learnMemo": function () {
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
