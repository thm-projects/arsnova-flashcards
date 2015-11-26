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

Router.route('/newcard/:_id', {
  name: 'newCard',
  data: function() {
    var currentCardset = this.params._id;
    return Cardsets.findOne({_id: currentCardset});
  }
});

Router.route('/editcard/:_id', {
  name: 'editCard',
  data: function() {
    var currentCard = this.params._id;
    return Cards.findOne({_id: currentCard});
  }
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

Router.route('/box/:_id', {
  name: 'box',
  template: 'box',
  data: function() {
    var currentBox = this.params._id;
    return Cardsets.findOne({_id: currentBox});
  }
});

Router.route('/memo/:_id', {
  name: 'memo',
  template: 'memo',
  data: function() {
    var currentMemo = this.params._id;
    return Cardsets.findOne({_id: currentMemo});
  }
});

Router.route('/profile/:_id', {
  name: 'profile',
  template: 'profile',
  data: function() { return Meteor.users.findOne(this.params._id); }
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
