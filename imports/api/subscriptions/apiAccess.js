import {Mongo} from "meteor/mongo";
import {SimpleSchema} from "meteor/aldeed:simple-schema";

export const APIAccess = new Mongo.Collection("apiAccess");

const APIAccessSchema = new SimpleSchema({
	cardset_id: {
		type: String
	},
	token: {
		type: String
	}
});

APIAccess.attachSchema(APIAccessSchema);
