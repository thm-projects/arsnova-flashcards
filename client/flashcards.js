Router.route('/', function (){
  this.redirect('home');
});

Router.configure({
  layoutTemplate: 'welcome'
});

Router.configure({
  layoutTemplate: 'impressum'
});

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/home', {
  name: 'home',
  layoutTemplate: 'welcome'
});

Router.route('/impressum', {
  name: 'impressum',
  layoutTemplate: 'impressum'
});

Router.route('/created', {
  name: 'created',
  template: 'cardsets'
});

Router.route('/pool', {
  name: 'pool'
});

Router.route('/profile', {
  name: 'userprofile'
});

var isSignedIn = function() {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('home');
  } else {
    this.next();
  }
};

var goToCreated = function() {
  if (Meteor.user()) {
    Router.go('created');
  } else {
    this.next();
  }
};

Router.onBeforeAction(isSignedIn, {except: ['home', 'impressum']});
Router.onBeforeAction(goToCreated, {only: ['home']});
/*
Router.route('/', function (){
  this.redirect('home');
});
*/

/*
Router.configure({
  layoutTemplate: 'welcome'
});

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/home', {
  name: 'home',
  layoutTemplate: 'welcome'
});


Router.route('/created-cardsets', {
  name: 'created',
  onBeforeAction: function(){
    if(!Meteor.userId()){
      Router.go('home');
    }
    else
    {
      this.layout('main');
      this.render('cardsets');

    }
  }
});

Router.route('/pool', {
  name: 'pool',
  template: 'pool'
});

Router.route('/profile', {
  name: 'userprofile',
  template: 'userprofile'
});*/


getUserLanguage = function () {
  return navigator.language.substr(0,2);
};

// Returns username
Template.registerHelper("usernameFromId", function () {
    var service = _.keys(Meteor.user().services)[0];
    // Google and Facebook
    if (service == 'google' || service == 'facebook') {
      return Meteor.user().services[service].name;
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
