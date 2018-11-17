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
		let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, registrationPeriod: 1, owner: 1, kind: 1}});
		if (Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked'])) {
			return false;
		}
		let roles = ['admin', 'editor', 'lecturer', 'university', 'pro'];
		if (cardset.kind === "free") {
			roles.push('standard');
		}
		if (Roles.userIsInRole(Meteor.userId(), roles)) {
			return !this.isInBonus(cardset._id) && moment(cardset.registrationPeriod).endOf('day') > new Date();
		} else {
			return false;
		}
	}
};
