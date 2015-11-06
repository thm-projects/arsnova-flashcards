Meteor.methods({
  convertMarkdown: function( markdown ){
    check( markdown, String );
    return parseMarkdown( markdown );
  }
});
