Meteor.subscribe("userData");

Template.profile.helpers({
  rendered: function() {
    return this._id;
  },
  getUser: function() {
    var user = Meteor.users.findOne(this._id);
    return user;
  },
  getService: function() {
    var user = Meteor.users.findOne(this._id);
    var service = _.keys(user.services)[0];
    service = service.charAt(0).toUpperCase() + service.slice(1);
    return service;
  },
  isUser: function() {
    return this._id === Meteor.userId();
  },
  isVisible: function() {
    return Meteor.users.findOne(this._id).visible || this._id === Meteor.userId();
  }
});

Template.profile.events({
  "click #profilepublicoption1": function(event, template) {
    Meteor.call("updateUsersVisibility", true);
  },
  "click #profilepublicoption2": function(event, template) {
    Meteor.call("updateUsersVisibility", false);
  },
  "keyup #inputEmail": function(event, template) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var email = $(event.currentTarget).val();
    var check = re.test(email);

    if (check === false && email !== "") {
      $(event.currentTarget).parent().parent().addClass('has-error');
    } else {
      $(event.currentTarget).parent().parent().removeClass('has-error');
      $(event.currentTarget).parent().parent().addClass('has-success');
      Meteor.call("updateUsersEmail", email);
    }
  }
});
