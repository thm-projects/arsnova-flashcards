import {Cardsets} from "./cardsets";
import {Meteor} from "meteor/meteor";
import {Workload} from "./learned";

export let Bonus = class Bonus {
	static isInBonus (cardset_id, user_id = undefined) {
		if (user_id === undefined) {
			user_id = Meteor.userId();
		}
		let workload = Workload.findOne({user_id: user_id, cardset_id: cardset_id}, {fields: {'leitner.bonus': 1}});
		if (workload !== undefined && workload.leitner !== undefined && workload.leitner.bonus !== undefined) {
			return workload.leitner.bonus === true;
		} else {
			return false;
		}
	}

	static canJoinBonus (cardset_id) {
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, registrationPeriod: 1, owner: 1}});
		if (Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked']) || cardset.owner === Meteor.userId()) {
			return false;
		}
		if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor', 'lecturer', 'university', 'pro'])) {
			return !this.isInBonus(cardset._id) && cardset.registrationPeriod > new Date();
		} else {
			return false;
		}
	}
};
