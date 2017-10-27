import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";

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

Router.route('impressum', {
	name: 'impressum',
	template: 'contact'
});

Router.route('agb', {
	name: 'agb',
	template: 'contact'
});

Router.route('datenschutz', {
	name: 'datenschutz',
	template: 'contact'
});

Router.route('/create', {
	name: 'create',
	template: 'cardsets'
});

Router.route('/learn', {
	name: 'learn',
	template: 'cardsets'
});

Router.route('/shuffle', {
	name: 'shuffle',
	template: 'cardsets'
});

Router.route('/cardset', function () {
	this.redirect('learn');
});

Router.route('/cardset/:_id', {
	name: 'cardsetdetailsid',
	template: 'cardsetAccess',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/editors', {
	name: 'cardseteditors',
	template: 'cardsetManageEditors',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/stats', {
	name: 'cardsetstats',
	template: 'cardsetLearnActivityStatistic',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardsetlist', function () {
	this.redirect('create');
});

Router.route('/cardsetlist/:_id', {
	name: 'cardsetlistid',
	template: 'cardsetAccess',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/newcard', {
	name: 'newCard',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/editcard/:cardid', {
	name: 'editCard',
	data: function () {
		return Cards.findOne({_id: this.params.cardid});
	}
});

Router.route('pool');

Router.route('/progress/:_id', {
	name: 'progress',
	template: 'myProgress',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/box/:_id', {
	name: 'box',
	template: 'boxAccess',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/memo/:_id', {
	name: 'memo',
	template: 'memoAccess',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/profile/:_id/overview', {
	name: 'profileOverview',
	template: 'profile'
});
Router.route('/profile/:_id/billing', {
	name: 'profileBilling',
	template: 'profile'
});
Router.route('/profile/:_id/membership', {
	name: 'profileMembership',
	template: 'profile'
});
Router.route('/profile/:_id/notifications', {
	name: 'profileNotifications',
	template: 'profile'
});
Router.route('/profile/:_id/settings', {
	name: 'profileSettings',
	template: 'profile'
});
Router.route('/profile/:_id/requests', {
	name: 'profileRequests',
	template: 'profile'
});

Router.route('/admin/dashboard', {
	name: 'admin_dashboard',
	template: 'admin_dashboard',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/cardsets', {
	name: 'admin_cardsets',
	template: 'admin_cardsets',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/cardset/:_id', {
	name: 'admin_cardset',
	template: 'admin_cardset',
	layoutTemplate: 'admin_main',
	data: function () {
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/admin/cards', {
	name: 'adminCards',
	template: 'admin_cards',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/card/:_id', {
	name: 'adminCard',
	template: 'admin_card',
	layoutTemplate: 'admin_main',
	data: function () {
		return Cards.findOne({_id: this.params._id});
	}
});

Router.route('/admin/users', {
	name: 'admin_users',
	template: 'admin_users',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/user/:_id', {
	name: 'admin_user',
	template: 'admin_user',
	layoutTemplate: 'admin_main',
	data: function () {
		return Meteor.users.findOne({_id: this.params._id});
	}
});

Router.route('/admin/notifications', {
	name: 'admin_notifications',
	template: 'admin_notifications',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/university', {
	name: 'admin_university',
	template: 'admin_university',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/interval', {
	name: 'admin_interval',
	template: 'admin_interval',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/settings', {
	name: 'admin_settings',
	template: 'admin_settings',
	layoutTemplate: 'admin_main'
});


var isSignedIn = function () {
	if (!(Meteor.user() || Meteor.loggingIn())) {
		Router.go('home');
	} else {
		this.next();
	}
};

var goToCreated = function () {
	if (Meteor.user()) {
		Router.go('pool');
	} else {
		this.next();
	}
};

Router.onBeforeAction(isSignedIn, {
	except: [
		'home',
		'impressum',
		'agb',
		'datenschutz'
	]
});

Router.onBeforeAction(goToCreated, {
	only: ['home']
});
