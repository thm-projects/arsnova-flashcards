if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.absoluteUrl.defaultOptions.rootUrl = Meteor.settings.rooturl;
  });
}
