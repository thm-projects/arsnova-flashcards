Cardsets = new Mongo.Collection('cardsets');

PoolList = new Mongo.Collection('poollist');

/*
PoolList.insert({name: "Informatik", count: 0});
PoolList.insert({name: "BWL", count: 0});
*/

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
