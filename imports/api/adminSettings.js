import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const AdminSettings = new Mongo.Collection("adminSettings");

if (Meteor.isServer) {
    Meteor.publish("adminSettings", function() {
        return AdminSettings.find();
    });
}

Meteor.methods({
    updateIntervall: function(){


    }



});