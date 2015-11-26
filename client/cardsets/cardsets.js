Meteor.subscribe("cardsets");
Meteor.subscribe("cards");

Session.setDefault('cardsetSort', {
  name: 1
});

/**
 * ############################################################################
 * created
 * ############################################################################
 */

Template.created.helpers({
  cardsetList: function() {
    return Cardsets.find({
      owner: Meteor.userId()
    }, {
      sort: Session.get('cardsetSort')
    });
  }
});

/**
 * ############################################################################
 * learned
 * ############################################################################
 */

Template.learned.helpers({
  learnedList: function() {
    var learnedCards = Learned.find({
      user_id: Meteor.userId()
    });

    var learnedCardsets = [];
    learnedCards.forEach(function(learnedCard) {
      if ($.inArray(learnedCard.cardset_id, learnedCardsets) === -1)
        learnedCardsets.push(learnedCard.cardset_id);
    });

    return Cardsets.find({
      _id: {
        $in: learnedCardsets
      }
    });
  }
});

/**
 * ############################################################################
 * cardsets
 * ############################################################################
 */

Template.cardsets.events({
  'click #newCardSet': function() {
    var inputValue = $('#new-set-input').val();
    $('#newSetName').val(inputValue);
    $('#new-set-input').val('');
  },
  'click .category': function(evt, tmpl) {
    var categoryName = $(evt.currentTarget).attr("data");
    var categoryId = $(evt.currentTarget).val();
    $('#newSetCategory').text(categoryName);
    tmpl.find('#newSetCategory').value = categoryId;
  },
  'click #newSetModal .save': function(evt, tmpl) {
    if ($('#newSetName').val() === "") {
      $('#newSetNameLabel').css('color', '#b94a48');
      $('#newSetName').css('border-color', '#b94a48');
      $('#helpNewSetName').html(TAPi18n.__('modal-dialog.name_required'));
      $('#helpNewSetName').css('color', '#b94a48');
    }
    if ($('#newSetDescription').val() === "") {
      $('#newSetDescriptionLabel').css('color', '#b94a48');
      $('#newSetDescription').css('border-color', '#b94a48');
      $('#helpNewSetDescription').html(TAPi18n.__('modal-dialog.description_required'));
      $('#helpNewSetDescription').css('color', '#b94a48');
    }
    if ($('#newSetCategory').val() === "") {
      console.log("falsch");
      $('#newSetCategoryLabel').css('color', '#b94a48');
      $('#newSetCategoryDropdown').css('border-color', '#b94a48');
      $('#helpNewSetCategory').html(TAPi18n.__('modal-dialog.category_required'));
      $('#helpNewSetCategory').css('color', '#b94a48');
    }
    if ($('#newSetName').val() !== "" && $('#newSetDescription').val() !== "" && $('#newSetCategory').val() !== "") {
      var name = $('#newSetName').val();
      var category = $('#newSetCategory').val();
      var description = $('#newSetDescription').val();
      var visible = ('true' === $('#newCardSetVisibility > .active > input').val());
      var ratings = ('true' === $('#newCardSetRating > .active > input').val());
      Meteor.call("addCardset", name, category, description, visible, ratings);
      $('#newSetModal').modal('hide');
    }
  }
});

/**
 * ############################################################################
 * cardsetsForm
 * ############################################################################
 */

Template.cardsetsForm.onRendered(function() {
  $('#newSetModal').on('hidden.bs.modal', function() {
    $('#newSetName').val('');
    $('#helpNewSetName').html('');
    $('#newSetName').css('border-color', '');
    $('#newSetNameLabel').css('color', '');

    $('#newSetDescription').val('');
    $('#helpNewSetDescription').html('');
    $('#newSetDescription').css('border-color', '');
    $('#newSetDescriptionLabel').css('color', '');

    if ($('#newSetCategory').val() !== "") {
      $('#newSetCategory').val('');
      $('#newSetCategory').html(TAPi18n.__('modal-dialog.categoryplaceholder'));
    }
    $('#helpNewSetCategory').html('');
    $('#newSetCategoryDropdown').css('border-color', '');
    $('#newSetCategoryLabel').css('color', '');

    if ($('#newCardSetVisibilityoption2').hasClass('active')) {
      $('#newCardSetVisibilityoption2').removeClass('active');
      $('#newCardSetVisibilityoption1').addClass('active');
    }

    if ($('#newCardSetRatingoption2').hasClass('active')) {
      $('#newCardSetRatingoption2').removeClass('active');
      $('#newCardSetRatingoption1').addClass('active');
    }
  });
});

Template.cardsetsForm.events({
  'keyup #newSetName': function() {
    $('#newSetNameLabel').css('color', '');
    $('#newSetName').css('border-color', '');
    $('#helpNewSetName').html('');
  },
  'keyup #newSetDescription': function() {
    $('#newSetDescriptionLabel').css('color', '');
    $('#newSetDescription').css('border-color', '');
    $('#helpNewSetDescription').html('');
  },
  'click .dropdown .category': function() {
    $('#newSetCategoryLabel').css('color', '');
    $('#newSetCategoryDropdown').css('border-color', '');
    $('#helpNewSetCategory').html('');
  }
});
