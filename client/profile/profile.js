Meteor.subscribe("users");

Template.profile.helpers({
  rendered: function(){
    return this._id;
  },
  getUser: function(){
    var user = Meteor.users.findOne(this._id);
    return user;
  },
  getService: function(){
    var user = Meteor.users.findOne(this._id);
    var service = _.keys(user.services)[0];
    return service;
  }
});
