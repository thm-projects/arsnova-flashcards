Template.cardsets.events({
  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('welcome');
  }
});
