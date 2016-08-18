//------------------------ IMPORTS

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Cards } from '../../../api/cards.js';
import { Cardsets } from '../../../api/cardsets.js';

import './admin_card.html';

/**
 * ############################################################################
 * admin_card
 * ############################################################################
 */

Template.admin_card.helpers({
  getUsername: function(cardset_id) {
    var cardset = Cardsets.findOne({ _id: cardset_id});
    return cardset.username;
  },
  getCardsetname: function(cardset_id) {
    var cardset = Cardsets.findOne({ _id: cardset_id});
    return cardset.name;
  }
});

Template.admin_card.events({
  "click #cardSaveAdmin": function(evt, tmpl) {
    if ($('#editCardFrontAdmin').val() === '') {
      $('#frontAdmin .md-editor').css('border-color', '#b94a48');
      $('#helpEditCardFrontAdmin').html(TAPi18n.__('admin.card.front_required'));
      $('#helpEditCardFrontAdmin').css('color', '#b94a48');
    }
    if ($('#editCardBackAdmin').val() === '') {
      $('#backAdmin .md-editor').css('border-color', '#b94a48');
      $('#helpEditCardBackAdmin').html(TAPi18n.__('admin.card.back_required'));
      $('#helpEditCardBackAdmin').css('color', '#b94a48');
    }
    if ($('#editCardFrontAdmin').val().length > 10000) {
      $('#frontAdmin .md-editor').css('border-color', '#b94a48');
      $('#helpEditCardFrontAdmin').html(TAPi18n.__('text_max'));
      $('#helpEditCardFrontAdmin').css('color', '#b94a48');
    }
    if ($('#editCardBackAdmin').val().length > 10000) {
      $('#backAdmin .md-editor').css('border-color', '#b94a48');
      $('#helpEditCardBackAdmin').html(TAPi18n.__('text_max'));
      $('#helpEditCardBackAdmin').css('color', '#b94a48');
    }
    if ($('#editCardFrontAdmin').val() !== '' && $('#editCardBackAdmin').val() !== '' && $('#editCardFrontAdmin').val().length <= 10000 && $('#editCardBackAdmin').val().length <= 10000)
    {
      var front = Session.get('frontText');
      var back = Session.get('backText');
      Meteor.call("updateCard", this._id, front, back);
      window.history.go(-1);
    }
  },
  'click #cardCancelAdmin': function() {
    window.history.go(-1);
  },
  'click #cardDeleteAdmin': function() {
    $("#cardDeleteAdmin").css('display', "none");
    $("#cardConfirmAdmin").css('display', "");
  },
  'click #cardConfirmAdmin': function() {
    var id = this._id;
    Meteor.call("deleteCard", id);
    window.history.go(-1);
  },
  'keyup #editCardFrontAdmin': function() {
    $('#frontAdmin .md-editor').css('border-color', '');
    $('#helpEditCardFrontAdmin').html('');
  },
  'keyup #editCardBackAdmin': function() {
    $('#backAdmin .md-editor').css('border-color', '');
    $('#helpEditCardBackAdmin').html('');
  }
});

Template.admin_card.rendered = function() {
  $("#editCardFrontAdmin").markdown({
    autofocus: false,
    hiddenButtons: ["cmdPreview", "cmdImage"],
    fullscreen: false,
    footer: "<p></p>",
    onChange: function(e) {
      var content = e.getContent();
      Session.set('frontText', content);
      if (content !== "") {
        Meteor.promise("convertMarkdown", content)
          .then(function(rendered) {
            $("#frontAdmin .md-footer").html(rendered);
          });
      }
    },
    additionalButtons: [
      [{
        name: "groupCustom",
        data: [{
          name: 'cmdPics',
          title: 'Image',
          icon: 'glyphicon glyphicon-picture',
          callback: image
        }, {
          name: "cmdTex",
          title: "Tex",
          icon: "glyphicon glyphicon-usd",
          callback: tex
        }]
      }]
    ]
  });

  var front = String($('#frontAdmin').data('content'));
  Session.set('frontText', front);
  if (front !== "") {
    Meteor.promise("convertMarkdown", front)
      .then(function(rendered) {
        $("#frontAdmin .md-footer").html(rendered);
      })
      .catch(function(error) {
        throw new Meteor.Error(error, "Can't convert to Markdown");
      });
  }

  $("#editCardBackAdmin").markdown({
    autofocus: false,
    hiddenButtons: ["cmdPreview", "cmdImage"],
    fullscreen: false,
    footer: "<p></p>",
    onChange: function(e) {
      var content = e.getContent();
      Session.set('backText', content);
      if (content !== "") {
        Meteor.promise("convertMarkdown", content)
          .then(function(rendered) {
            $("#backAdmin .md-footer").html(rendered);
          });
      }
    },
    additionalButtons: [
      [{
        name: "groupCustom",
        data: [{
          name: 'cmdPics',
          title: 'Image',
          icon: 'glyphicon glyphicon-picture',
          callback: image
        }, {
          name: "cmdTex",
          title: "Tex",
          icon: "glyphicon glyphicon-usd",
          callback: tex
        }]
      }]
    ]
  });

  var back = String($('#backAdmin').data('content'));
  Session.set('backText', back);
  if (back !== "") {
    Meteor.promise("convertMarkdown", back)
      .then(function(rendered) {
        $("#backAdmin .md-footer").html(rendered);
      })
      .catch(function(error) {
        throw new Meteor.Error(error, "Can't convert to Markdown");
      });
  }
};

/**
 * ############################################################################
 * Functions
 * ############################################################################
 */

function tex(e) {
  // Give/remove ** surround the selection
  var chunk, cursor, selected = e.getSelection(),
    content = e.getContent();

  if (selected.length === 0) {
    // Give extra word
    chunk = e.__localize('tex');
  } else {
    chunk = selected.text;
  }

  // transform selection and set the cursor into chunked text
  if (content.substr(selected.start - 2, 2) === '$$' && content.substr(selected.end, 2) === '$$') {
    e.setSelection(selected.start - 2, selected.end + 2);
    e.replaceSelection(chunk);
    cursor = selected.start - 2;
  } else {
    e.replaceSelection('$$' + chunk + '$$');
    cursor = selected.start + 2;
  }

  // Set the cursor
  e.setSelection(cursor, cursor + chunk.length);
}

function image(e) {
  // Give ![] surround the selection and prepend the image link
  var chunk, cursor, selected = e.getSelection(),
      content = e.getContent(),
    link;

  if (selected.length === 0) {
    // Give extra word
    chunk = e.__localize('enter image description here');
  } else {
    chunk = selected.text;
  }

  link = prompt(e.__localize('Insert Image Hyperlink'), 'http://');

  if (link !== null && link !== '' && link !== 'http://' && link.substr(0, 4) === 'http') {
    var sanitizedLink = $('<div>' + link + '</div>').text();

    // transform selection and set the cursor into chunked text
    e.replaceSelection('![' + chunk + '](' + sanitizedLink + ')');
    cursor = selected.start + 2;

    // Set the cursor
    e.setSelection(cursor, cursor + chunk.length);
  }
}
