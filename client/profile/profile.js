Meteor.subscribe("userData");
Meteor.subscribe("experience");

Template.registerHelper("getUser", function() {
  var user = Meteor.users.findOne(this._id);
  return user;
});

/**
 * ############################################################################
 * profile
 * ############################################################################
 */

Template.profile.helpers({
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

/**
 * ############################################################################
 * profileInfo
 * ############################################################################
 */

Template.profileInfo.helpers({
  getService: function() {
    var user = Meteor.users.findOne(this._id);
    var service = _.keys(user.services)[0];
    service = service.charAt(0).toUpperCase() + service.slice(1);
    return service;
  },
  isUser: function() {
    return this._id === Meteor.userId();
  }
});

/**
 * ############################################################################
 * profileXp
 * ############################################################################
 */

Template.profileXp.helpers({
  getXpTotal: function() {
    var allXp = Experience.find({
      owner: this._id
    });
    var result = 0;
    allXp.forEach(function(xp) {
      result = result + xp.value;
    });
    return result;
  },
  getXpToday: function() {
    var date = new Date();
    date.setHours(0, 0, 0, 0);

    var allXp = Experience.find({
      owner: this._id,
      date: {
        $gte: date
      }
    });
    var result = 0;
    allXp.forEach(function(xp) {
      result = result + xp.value;
    });
    return result;
  },
  getXpYesterday: function() {
    var minDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    minDate.setHours(0, 0, 0, 0);
    var maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);

    var allXp = Experience.find({
      owner: this._id,
      date: {
        $gte: minDate,
        $lte: maxDate
      }
    });
    var result = 0;
    allXp.forEach(function(xp) {
      result = result + xp.value;
    });
    return result;
  },
  getXpWeek: function() {
    var minDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    minDate.setHours(0, 0, 0, 0);
    var maxDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    maxDate.setHours(0, 0, 0, 0);

    var allXp = Experience.find({
      owner: this._id,
      date: {
        $gte: minDate,
        $lte: maxDate
      }
    });
    var result = 0;
    allXp.forEach(function(xp) {
      result = result + xp.value;
    });
    return result;
  },
  getLast: function() {
    var last = Experience.findOne({
      owner: this._id,
    }, {
      sort: {
        date: -1
      }
    });

    var name = '';
    if (last !== undefined) {
      switch (last.type) {
        case 1:
          name = 'Login';
          break;
        case 2:
          name = 'Kartensatz angelegt';
          break;
        case 3:
          name = 'Karte angelegt';
          break;
        case 4:
          name = 'Kartensatz bewertet';
          break;
        default:
          name = 'Error';
          break;
      }
    }
    return name + " (+" + last.value + ")";
  }
});
