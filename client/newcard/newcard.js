/**
 * ############################################################################
 * newcard
 * ############################################################################
 */

Template.newcard.events({
  "click #cardCancel": function() {
    Router.go('cardsetdetailsid', {
      _id: this._id
    });
  },
  "click #cardNewCard": function(evt, tmpl) {
    front = $("#mdText1").html();
    back = $('#mdText2').html();
    Meteor.call("addCard", this._id, front, back);
    Router.go('cardsetdetailsid', {
      _id: this._id
    });
  },
  "click #btnPreview": function(evt, tmpl) {
    console.log(tmpl.find('#fronttext > div > div.panel-body > div.md-editor > textarea').value);
  }
});

/**
 * ############################################################################
 * editor
 * ############################################################################
 */

Template.editor.rendered = function() {
  this.editor = CodeMirror.fromTextArea(this.find("#editor"), {
    mode: "markdown",
    theme: "monokai",
    lineWrapping: true,
    cursorHeight: 0.85,
    lineNumbers: true,
    fixedGutter: false
  });
};

Template.editor.events({
  'keyup #editor-wrap-1 > .CodeMirror': function(evt, tmpl) {
    var text = tmpl.editor.getValue();

    if (text !== "") {
      $("#mdText1").html(text);
      Meteor.promise("convertMarkdown", text)
        .then(function(html) {
          $("#preview1").html(html);
        })
        .catch(function(error) {
          Bert.alert(error.reason, "Error: Can't convert to Markdown");
        });
    }
  },
  'keyup #editor-wrap-2 > .CodeMirror': function(evt, tmpl) {
    var text = tmpl.editor.getValue();

    if (text !== "") {
      $("#mdText2").html(text);
      Meteor.promise("convertMarkdown", text)
        .then(function(html) {
          $("#preview2").html(html);
        })
        .catch(function(error) {
          Bert.alert(error.reason, "Error: Can't convert to Markdown");
        });
    }
  }

});
