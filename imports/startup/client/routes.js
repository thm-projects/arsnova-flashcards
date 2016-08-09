import { Cardsets } from '../../api/cardsets.js';
import { Cards } from '../../api/cards.js';
import { Categories } from '../../api/categories.js';

Router.route('/', function () {
  this.redirect('home');
});

Router.route('/admin', function () {
  this.redirect('admin_dashboard');
});

Router.configure({
  layoutTemplate: 'admin_main'
});

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/home', {
  name: 'home',
  template: 'welcome'
});

Router.route('impressum');

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
  name: 'newCard',
  data: function() {
    var currentCardset = this.params._id;
    return Cardsets.findOne({_id: currentCardset});
  }
});

Router.route('/cardset/:_id/editcard/:cardid', {
  name: 'editCard',
  data: function() {
    var currentCard = this.params.cardid;
    return Cards.findOne({_id: currentCard});
  }
});

Router.route('pool');

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

Router.route('/admin/dashboard', {
  name: 'admin_dashboard',
  template: 'admin_dashboard',
  layoutTemplate: 'admin_main',
  onBeforeAction: function() {
    if (!Roles.userIsInRole(Meteor.userId(), ['admin-user']))
    {
      Router.go('created');
    }
    else
    {
      this.next();
    }
  }
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

Router.onBeforeAction(isSignedIn, {
  except: ['home', 'impressum']
});

Router.onBeforeAction(goToCreated, {only: ['home']});
