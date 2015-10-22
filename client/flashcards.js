Router.route('/', function (){
  this.redirect('home');
});

Router.configure({
  layoutTemplate: 'impressum'
});

Router.route('/impressum', {
  name: 'impressum',
  layoutTemplate: 'impressum'
});

Router.configure({
  layoutTemplate: 'welcome'
});

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/home', {
  name: 'home',
  action: function(){
    if(Meteor.userId()){
      this.layout('main');
      this.render('cardsets');
    } else {
      this.layout('welcome');
    }
  }
});

Router.route('/home/created-cardsets', {
  name: 'created',
  template: 'created'
});

Router.route('/pool', {
  name: 'pool',
  template: 'pool'
});

Router.route('/profile', {
  name: 'userprofile',
  template: 'userprofile'
});


getUserLanguage = function () {
  return navigator.language.substr(0,2);
};

// Returns username
Template.registerHelper("usernameFromId", function () {
    var service = _.keys(Meteor.user().services)[0];
    // Google and Facebook
    if (service == 'google' || service == 'facebook') {
      return Meteor.user().services[service].email;
    }
    // Twitter
    else if (service == 'twitter') {
      return Meteor.user().services[service].screenName;
    }
    // CAS
    else {
      return Meteor.user().profile.name;
    }
});

if (Meteor.isClient) {
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
}
