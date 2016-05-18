import { Session } from 'meteor/session';

//------------------------ GET LANGUAGE FROM USER

getUserLanguage = function () {
  return navigator.language.substr(0,2);
};


//------------------------ LOADING I18N

Meteor.startup(function () {
  Meteor.absoluteUrl.defaultOptions.rootUrl = Meteor.settings.public.rooturl;

  Session.set("showLoadingIndicator", true);

  TAPi18n.setLanguage(getUserLanguage())
    .done(function () {
      Session.set("showLoadingIndicator", false);
    })
    .fail(function (error_message) {
      // Handle the situation
      console.log(error_message);
    });
});
