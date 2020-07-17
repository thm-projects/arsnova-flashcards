import {Meteor} from "meteor/meteor";
import {Random} from 'meteor/random';
import {APIAccess} from "../subscriptions/cardsetApiAccess";
import {Cardsets} from "../subscriptions/cardsets.js";
import {check} from "meteor/check";
import {UserPermissions} from "../../util/permissions";

Meteor.methods({
	/**
	 * Create new API access for a given cardset.
	 * Autogenerates token.
	 * @param {String} cardsetId - Database id of the cardset to be accessed via API
	 */
	newAPIAccess: function (cardsetId) {
		check(cardsetId, String);

		if (!UserPermissions.gotBackendAccess()) {
			throw new Meteor.Error("not-authorized");
		} else {
			let cardset = Cardsets.findOne({_id: cardsetId});
			if (!cardset) {
				throw new Meteor.Error("no access to a cardset with id: " + cardsetId);
			} else {
				let token = Random.secret();
				let apiToken = {
					cardset_id: cardsetId,
					token: token
				};
				APIAccess.insert(apiToken);
			}
		}
	},
	/**
	 * Delete selected API access from database if user is auhorized.
	 * @param {String} id - Database id of the api access token to be deleted
	 */
	deleteAPIAccess: function (apiAccessId) {
		check(apiAccessId, String);

		if (!UserPermissions.gotBackendAccess()) {
			throw new Meteor.Error("not-authorized");
		} else {
			APIAccess.remove(apiAccessId);
		}
	}
});
