//------------------------ IMPORTS
import {Meteor} from "meteor/meteor";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
		let workload = Workload.findOne({cardset_id: FlowRouter.getParam('_id'), user_id: Meteor.userId()});
		if (workload !== undefined && workload.leitner !== undefined && workload.leitner.active !== undefined) {
			return workload.leitner.active;
		}
	},
	learningMemo: function () {
		return Wozniak.findOne({
			cardset_id: FlowRouter.getParam('_id'),
			user_id: Meteor.userId()});
	},
	learningBoth: function () {
		let learningLeitner = false;
		let learningWozniak = false;
		let workload = Workload.findOne({cardset_id: FlowRouter.getParam('_id'), user_id: Meteor.userId()});
		if (workload !== undefined && workload.leitner !== undefined && workload.leitner.active !== undefined) {
			learningLeitner = workload.leitner.active;
		}
		learningWozniak = Wozniak.findOne({
			cardset_id: FlowRouter.getParam('_id'),
			user_id: Meteor.userId()});
		return learningLeitner && learningWozniak;
	}
});

Template.cardsetNavigationWorkload.events({
	"click #learnBox": function () {
		FlowRouter.go('box', {
			_id: this._id
		});
	},
	"click #learnMemo": function () {
		FlowRouter.go('memo', {
			_id: this._id
		});
	},
	"click #leitnerProgress": function () {
		FlowRouter.go('progress', {
			_id: this._id,
			user_id: Meteor.userId()
		});
	}
});
