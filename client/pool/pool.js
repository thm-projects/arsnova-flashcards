PoolList = new Mongo.Collection('poollist');



if (Meteor.isClient) {
  // This code only runs on the client
  Template.pool.helpers({
    getpool: function () {
      return PoolList.find({});
    }
  });
}
