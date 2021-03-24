import {Meteor} from "meteor/meteor";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";

export let LeitnerLearningWorkloadUtilities = class LeitnerLearningWorkloadUtilities {
	static getActiveWorkload (cardset_id) {
		return LeitnerLearningWorkload.findOne({user_id: Meteor.userId(), cardset_id: cardset_id,isActive: true});
	}
};
