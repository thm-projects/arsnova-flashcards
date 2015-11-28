Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("learned");

Session.set('selectedBox', null);
Session.set('isFront', true);
Session.set('maxIndex', 1);
Session.set('isFinish', false);

/**
 * ############################################################################
 * box
 * ############################################################################
 */

 Template.box.onCreated(function() {
   var cardset_id = Router.current().params._id;
   cards = Cards.find({
     cardset_id: cardset_id
   });
   cards.forEach(function(card) {
     Meteor.call("addLearned", card.cardset_id, card._id);
   });
 });

Template.box.helpers({
  boxSelected: function() {
    var selectedBox = Session.get('selectedBox');
    return selectedBox !== null;
  },
  isNotEmpty: function() {
    var notEmpty = Learned.find({
      cardset_id: this._id,
      user_id: Meteor.userId(),
      box: parseInt(Session.get('selectedBox'))
    }).count();
    return notEmpty;
  },
  isFinish: function() {
    return Session.get('isFinish');
  }
});

/**
 * ############################################################################
 * boxMain
 * ############################################################################
 */

Template.boxMain.helpers({
  isFront: function() {
    isFront = Session.get('isFront');
    return isFront === true;
  },
  getCardsByBox: function() {
    selectedBox = parseInt(Session.get('selectedBox'));

    var learnedCardIds = Learned.find({
      cardset_id: this._id,
      user_id: Meteor.userId(),
      box: selectedBox
    }).map(function(card) {
      return card.card_id;
    });

    var learned = Cards.find({
      cardset_id: this._id,
      _id: {
        $in: learnedCardIds
      }
    });

    // _.shuffle(learned.fetch());
    return learned;
  },
  cardActiveByBox: function(index) {
    return 1 === index + 1;
  },
  countBox: function() {
    var maxIndex = Learned.find({
      cardset_id: this._id,
      user_id: Meteor.userId(),
      box: parseInt(Session.get('selectedBox'))
    }).count();
    Session.set('maxIndex', maxIndex);
    return maxIndex;
  },
  boxMarkdownFront: function(front, index) {
    Meteor.promise("convertMarkdown", front)
      .then(function(html) {
        $(".front" + index).html(html);
        var src = $('.front' + index + ' img').attr('src');
        var alt = $('.front' + index + ' img').attr('alt');
        $('.front' + index + ' img').replaceWith($('<a class="card-front btn-showBoxPictureModal" data-toggle="modal" data-target="#boxPictureModal" href="" data-val="' + src + '" data-alt="' + alt + '"><i class="glyphicon glyphicon-picture"></i></a>'));
    });
  },
  boxMarkdownBack: function(back, index) {
    Meteor.promise("convertMarkdown", back)
      .then(function(html) {
        $(".back" + index).html(html);
        var src = $('.back' + index + ' img').attr('src');
        var alt = $('.back' + index + ' img').attr('alt');
        $('.back' + index + ' img').replaceWith($('<a class="card-back btn-showBoxPictureModal" data-toggle="modal" data-target="#boxPictureModal" href="" data-val="' + src + '" data-alt="' + alt + '"><i class="glyphicon glyphicon-picture"></i></a>'));
    });
  }
});

Template.boxMain.events({
  "click .box": function() {
    isFront = Session.get('isFront');
    if (isFront === true) {
      Session.set('isFront', false);
    } else {
      Session.set('isFront', true);
    }
  },
  "click #known": function() {
    var currentCard = $('.carousel-inner > .active').attr('data');
    var currentLearned = Learned.findOne({
      card_id: currentCard,
      user_id: Meteor.userId()
    });

    selectedBox = parseInt(Session.get('selectedBox'));
    if (selectedBox < 5) {
      Meteor.call('updateLearned', currentLearned._id, selectedBox + 1);
    }

    if (1 === parseInt(Session.get('maxIndex'))) {
      Session.set('isFinish', true);
    }
    Session.set('isFront', true);

  },
  "click #notknown": function() {
    var currentCard = $('.carousel-inner > .active').attr('data');
    var currentLearned = Learned.findOne({
      card_id: currentCard,
      user_id: Meteor.userId()
    });
    Meteor.call('updateLearned', currentLearned._id, 1);

    if (1 === parseInt(Session.get('maxIndex'))) {
      Session.set('isFinish', true);
    }
    Session.set('isFront', true);
  },
  'click .item.active .block a': function(evt, tmpl) {
    evt.stopPropagation();
    evt.preventDefault();
    var src = $(evt.currentTarget).data('val');
    var alt = $(evt.currentTarget).data('alt');
    $("#boxPictureModal .modal-title").html(alt);
    $("#setdetails-boxPictureModal-body").html("<img src='" + src + "' alt='" + alt + "'>");
    $('#boxPictureModal').modal('show');
  }
});

/**
 * ############################################################################
 * boxSide
 * ############################################################################
 */

Template.boxSide.events({
  "click .learn-box": function(event, template) {
    var box = $(event.currentTarget).val();
    Session.set('selectedBox', box);
    Session.set('isFront', true);
    Session.set('isFinish', false);
  }
});

Template.boxSide.helpers({
  selectedBox: function(boxId) {
    var selectedBox = Session.get('selectedBox');
    if (boxId == selectedBox) {
      return "active";
    }
  },
  countBox: function(boxId) {
    return Learned.find({
      cardset_id: this._id,
      user_id: Meteor.userId(),
      box: boxId
    }).count();
  }
});

Template.boxSide.onDestroyed(function() {
  Session.set('selectedBox', null);
});

/**
 * ############################################################################
 * boxEnd
 * ############################################################################
 */

Template.boxEnd.events({
  "click #endscreenBack": function() {
    Session.set('selectedBox', null);
    Session.set('isFinish', false);
    Router.go('cardsetdetailsid', {_id: this._id});
  }
});
