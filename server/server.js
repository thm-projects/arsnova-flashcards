Cardsets = new Mongo.Collection('cardsets');

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
