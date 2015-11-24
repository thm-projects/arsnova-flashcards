/**
 * ############################################################################
 * btnCard
 * ############################################################################
 */

Template.btnCard.helpers({
  isEditMode: function() {
    return ActiveRoute.name('editCard');
  }
});

Template.btnCard.events({
  "click #cardSave": function(evt, tmpl) {
    front = Session.get('frontText');
    back = Session.get('backText');
    if (ActiveRoute.name('newCard')) {
      Meteor.call("addCard", this._id, front, back);
    } else {
      Meteor.call("updateCard", this._id, front, back);
    }
  },
  "click #cardDelete": function(evt, tmpl) {
    var id = this._id;
    Meteor.call("deleteCard", id);
  }
});

/**
 * ############################################################################
 * frontEditor
 * ############################################################################
 */

Template.frontEditor.rendered = function() {
  $("#frontEditor").markdown({
    autofocus: true,
    hiddenButtons: ["cmdPreview", "cmdImage"],
    fullscreen: false,
    footer: "<p></p>",
    onChange: function(e) {
      content = e.getContent();
      Session.set('frontText', content);
      if (content !== "") {
        Meteor.promise("convertMarkdown", content)
          .then(function(rendered) {
            $("#fronttext .md-footer").html(rendered);
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

  if (ActiveRoute.name('editCard')) {
    front = $('#fronttext').data('content');
    Session.set('frontText', front);
    if (front !== "") {
      Meteor.promise("convertMarkdown", front)
        .then(function(rendered) {
          $("#fronttext .md-footer").html(rendered);
        })
        .catch(function(error) {
          console.log("Error: Can't convert to Markdown");
        });
    }
  } else {
        Session.set('frontText', undefined);
  }
};

/**
 * ############################################################################
 * backEditor
 * ############################################################################
 */

Template.backEditor.rendered = function() {
  $("#backEditor").markdown({
    autofocus: false,
    hiddenButtons: ["cmdPreview", "cmdImage"],
    fullscreen: false,
    footer: "<p></p>",
    onChange: function(e) {
      content = e.getContent();
      Session.set('backText', content);
      if (content !== "") {
        Meteor.promise("convertMarkdown", content)
          .then(function(rendered) {
            $("#backtext .md-footer").html(rendered);
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
  if (ActiveRoute.name('editCard')) {
    back = $('#backtext').data('content');
    Session.set('backText', back);
    if (back !== "") {
      Meteor.promise("convertMarkdown", back)
        .then(function(rendered) {
          $("#backtext .md-footer").html(rendered);
        })
        .catch(function(error) {
          console.log("Error: Can't convert to Markdown");
        });
    }
  } else {
        Session.set('backText', undefined);
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
