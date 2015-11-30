Meteor.subscribe("userData");
Meteor.subscribe("experience");
Meteor.subscribe("badges");

Template.registerHelper("getUser", function() {
  var user = Meteor.users.findOne(this._id);
  Session.set("user", user._id);
  return user;
});

/**
 * ############################################################################
 * profile
 * ############################################################################
 */

Template.profile.helpers({
  isVisible: function() {
    if (this._id === undefined)
      return null;

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
    if (this._id === undefined || Meteor.user().services === undefined || Meteor.user().services === null)
      return null;

    var user = Meteor.users.findOne(this._id);
    var service = _.keys(Meteor.user().services)[0];
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
    Session.set("totalXp", result);
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

    if (last === undefined)
      return null;

    return name + " (+" + last.value + ")";
  },
  getLvl: function() {
    return Meteor.users.findOne(this._id).lvl;
  },
  getNextLvl: function() {
    return Meteor.users.findOne(this._id).lvl + 1;
  },
  getXp: function() {
    var level = Meteor.users.findOne(this._id).lvl + 1;
    var points = xpForLevel(level);
    var required = points - Session.get("totalXp");

    return required;
  },
  getXpPercent: function() {
    var points = Session.get("totalXp");
    var currentLevel = Meteor.users.findOne(this._id).lvl;
    var nextLevel = Meteor.users.findOne(this._id).lvl + 1;
    var currentPoints = xpForLevel(currentLevel);
    var nextPoints = xpForLevel(nextLevel);

    var res = (points - currentPoints) / (nextPoints - currentPoints) * 100;

    return res + "%";
  }
});

function xpForLevel(level) {
  var points = 0;

  for (i = 1; i < level; i++) {
    points += Math.floor(i + 30 * Math.pow(2, i / 10));
  }
  return Math.floor(points / 4);
}

/**
 * ############################################################################
 * profileBadges
 * ############################################################################
 */

Template.profileBadges.helpers({
  getBadges: function() {
    return Badges.find();
  },
  isGained: function(index, rank) {
    switch (index) {
      case 0:
        return kritiker(rank) >= 100;
      case 1:
        return krone(rank) >= 100;
      case 2:
        return stammgast(rank) >= 100;
      case 3:
        return streber(rank) >= 100;
      case 4:
        return wohltaeter(rank) >= 100;
      default:
        return false;
    }
  },
  getPercent: function(index, rank) {
    switch (index) {
      case 0:
        return kritiker(rank);
      case 1:
        return krone(rank);
      case 2:
        return stammgast(rank);
      case 3:
        return streber(rank);
      case 4:
        return wohltaeter(rank);
      default:
        return 0;
    }
  }
});

function kritiker(rank) {
  var ratings = Ratings.find({
    user: Session.get("user")
  }).count();

  var badge = Badges.findOne("1");
  switch (rank) {
    case 3:
      return ratings / badge.rank3 * 100;
    case 2:
      return ratings / badge.rank2 * 100;
    case 1:
      return ratings / badge.rank1 * 100;
    default:
      return 0;
  }
}

function krone(rank) {
  var cardsets = Cardsets.find({
    owner: Session.get("user")
  });

  var count = 0;

  cardsets.forEach(function(cardset) {
    var ratings = Ratings.find({
      cardset_id: cardset._id
    });
    if (ratings.count() > 1) {
      var total = 0;
      ratings.forEach(function(rating) {
        total += rating.rating;
      });
      if (total / ratings.count() >= 4.5) {
        count++;
      }
    }
  }); 

  var badge = Badges.findOne("2");
  switch (rank) {
    case 3:
      return count / badge.rank3 * 100;
    case 2:
      return count / badge.rank2 * 100;
    case 1:
      return count / badge.rank1 * 100;
    default:
      return 0;
  }
}

function stammgast(rank) {
    var user = Meteor.users.findOne(Session.get("user")).daysInRow;

    var badge = Badges.findOne("3");
    switch (rank) {
      case 3:
        return user / badge.rank3 * 100;
      case 2:
        return user / badge.rank2 * 100;
      case 1:
        return user / badge.rank1 * 100;
      default:
        return 0;
    }
}

function streber(rank) {
  var learned = Learned.find({
    user_id: Session.get("user")
  }).count();

  var badge = Badges.findOne("4");
  switch (rank) {
    case 3:
      return learned / badge.rank3 * 100;
    case 2:
      return learned / badge.rank2 * 100;
    case 1:
      return learned / badge.rank1 * 100;
    default:
      return 0;
  }
}

function wohltaeter(rank) {
  var cardsets = Cardsets.find({
    owner: Session.get("user"),
    visible: true
  });

  var count = 0;

  cardsets.forEach(function(cardset) {
    var cards = Cards.find({
      cardset_id: cardset._id
    });
    if (cards.count() >= 5) {
      count++;
    }
  }); 

  var badge = Badges.findOne("5");
  switch (rank) {
    case 3:
      return count / badge.rank3 * 100;
    case 2:
      return count / badge.rank2 * 100;
    case 1:
      return count / badge.rank1 * 100;
    default:
      return 0;
  }
}
