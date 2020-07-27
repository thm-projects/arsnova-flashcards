import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {UserPermissions} from "../../util/permissions";
import {Cardsets} from "./cardsets";
import {ServerStyle} from "../../util/styles";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {APIAccess} from "./cardsetApiAccess";

export const publishCardsets = new Mongo.Collection("publishCardsets");

if (Meteor.isServer) {
	Meteor.publish("allPublishCardsets", function () {
		if (this.userId && UserPermissions.gotBackendAccess()) {
			let query = {};
			if (!ServerStyle.gotSimplifiedNav()) {
				query.shuffled = false;
			}
			return Cardsets.find(query);
		} else {
			this.ready();
		}
	});
	Meteor.publish("publishCardsets", function () {
		if (Roles.userIsInRole(this.userId, 'admin')) {
			return APIAccess.find();
		}
	});
}

const PublishCardsetsSchema = new SimpleSchema({
	cardsetId: {
		type: String
	},
	requestedKind: {
		type: String
	}
});

Cardsets.attachSchema(PublishCardsetsSchema);

