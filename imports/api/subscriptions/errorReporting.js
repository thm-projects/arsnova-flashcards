import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {Cardsets} from "./cardsets";

export const ErrorReporting = new Mongo.Collection("errorReporting");

if (Meteor.isServer) {
	Meteor.publish("getErrorReport", function (error_report_id) {
		if (this.userId) {
			return ErrorReporting.find({error_report_id: error_report_id, user_id: this.userId});
		} else {
			this.ready();
		}
	});
	Meteor.publish("hasCardsetUnresolvedErrors", function (cardset_id) {
		if (this.userId) {
			return Cardsets.find({_id: cardset_id}).unresolvedErrors > 0;
		} else {
			this.ready();
		}
	});
}
