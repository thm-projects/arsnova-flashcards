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
        if (!Roles.userIsInRole(this.userId, ['admin', 'editor'])) {
            throw new Meteor.Error("not-authorized");
        }

        Meteor.users.update({
            name: "seqSettings",
            seqOne: 7,
            seqTwo: 30,
            seqThree: 90
        });

    }



});