import {Meteor} from "meteor/meteor";
import {LeitnerLearningWorkload} from "../api/subscriptions/leitner/leitnerLearningWorkload";

export let LeitnerLearningWorkloadUtilities = class LeitnerLearningWorkloadUtilities {
	static getActiveWorkload (cardset_id, user_id = Meteor.userId()) {
		return LeitnerLearningWorkload.findOne({user_id: user_id, cardset_id: cardset_id, isActive: true});
	}
};
