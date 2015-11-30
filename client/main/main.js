Meteor.subscribe("Users");

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
  'click #searchResults': function(event) {
    $('#searchDropdown').removeClass("open");
    $('#input-search').val('');
  },
  'click #usr-profile': function() {
    Router.go('profile', {
      _id: Meteor.userId()
    });
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

Template.main.onRendered(function() {
  Session.set("searchValue", undefined);

  var user = Meteor.users.findOne({
    _id: Meteor.userId(),
    lvl: {
      $exists: false
    }
  });

  if (user !== undefined){
    Meteor.call("initUser");
  }
});

/*Meteor.users.find({
  "status.online": true
}).observe({
  added: function(user) {
    var lastDate = user.lastOnAt;
    lastDate.setHours(0, 0, 0, 0);

    var actualDate = new Date();
    actualDate.setHours(0, 0, 0, 0);

    if (lastDate < actualDate) {
      Meteor.call("updateUsersDaysInRow", user._id, user.daysInRow + 1);
      Meteor.call("addExperience", 1, 2);
    }

    Meteor.call("updateUsersLast", user._id);
  },
  remove: function(user) {
    Meteor.call("updateUsersLast", user._id);
  }
});*/
