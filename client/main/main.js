Template.main.events({
  'click #logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('home');
  },
  'keyup #input-search': function(event) {
    event.preventDefault();
    Session.set("searchValue", $(event.currentTarget).val());
    if ($(event.currentTarget).val() && CardsetsIndex.search(Session.get("searchValue")).count()) {
      $('#searchDropdown').addClass("open");
    } else {
      $('#searchDropdown').removeClass("open");
    }
  },
  'click #searchResults': function (event) {
    $('#searchDropdown').removeClass("open");
    $('#input-search').val('');

  }
});

Template.main.helpers({
  getUsername: function() {
    if (Meteor.user()) {
      return Meteor.user().profile.name;
    }
  },
  searchCategories: function() {
    if (Session.get("searchValue")) {
      results = CardsetsIndex.search(Session.get("searchValue")).fetch();
      return results;
    } else {
      return undefined;
    }
  }
});

Template.main.rendered = function() {
  Session.set("searchValue", undefined);
};
