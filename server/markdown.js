Meteor.methods({
  convertMarkdown: function( markdown ){
    check( markdown, String );
    kramed.options({katex: true});
    return kramed( markdown );
  }
});
