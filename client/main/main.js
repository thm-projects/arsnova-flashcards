Template.main.events({
  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('welcome');
  }
});
