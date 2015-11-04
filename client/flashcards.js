//------------------------ ROUTING

Router.route('/', function () {
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

Router.route('/learned', {
  name: 'learned',
  template: 'cardsets'
});

Router.route('/cardset', function() {
  this.redirect('created');
});

Router.route('/cardset/:_id', {
  name: 'cardsetdetailsid',
  template: 'cardset',
  data: function() {
    var currentCardset = this.params._id;
    return Cardsets.findOne({_id: currentCardset});
  }
});

Router.route('/cardsetlist', function() {
  this.redirect('created');
});

Router.route('/cardsetlist/:_id', {
  name: 'cardsetlistid',
  template: 'cardset',
  data: function() {
    var currentCardset = this.params._id;
    return Cardsets.findOne({_id: currentCardset});
  }
});

Router.route('/cardset/:_id/newcard', {
  name: 'newcard'
});

Router.route('/pool', {
  name: 'pool'
});

Router.route('/pool/:_id', {
  name: 'category',
  template: 'category',
  data: function() {
    var currentPool = this.params._id;
    return Categories.findOne({_id: currentPool});
  }
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
