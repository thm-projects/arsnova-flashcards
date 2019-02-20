import {Cardsets} from "../../api/cardsets.js";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {CardVisuals} from "../../api/cardVisuals.js";
import {Route} from "../../api/route.js";
import {Filter} from "../../api/filter";
import {MarkdeepEditor} from "../../api/markdeepEditor";
import {WebPushNotifications} from "../../api/webPushSubscriptions";
import {UserPermissions} from "../../api/permissions";
import {MainNavigation} from "../../api/mainNavigation";
import {ServerStyle} from "../../api/styles.js";
import {LoginTasks} from "../../api/login";

let loadingScreenTemplate = 'loadingScreen';

let linksWithNoLoginRequirement = [
	'home',
	'about',
	'learning',
	'faq',
	'help',
	'impressum',
	'demo',
	'demolist',
	'agb',
	'datenschutz',
	'making',
	'makinglist'
];

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

Router.route('/firstLogin', {
	name: 'firstLogin',
	template: 'firstLoginContent'
});

Router.route('/accessDenied', {
	name: 'accessDenied',
	template: 'accessDenied'
});

Router.route('/home', {
	name: 'home',
	template: 'welcome',
	subscriptions: function () {
		return [Meteor.subscribe('wordcloudCardsets')];
	},
	data: function () {
		Session.set('helpFilter', "start");
		return Cardsets.findOne({_id: Session.get('wordcloudItem')});
	},
	action: function () {
		if (this.ready()) {
			CardVisuals.toggleFullscreen(true);
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('about', {
	name: 'about',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('learning', {
	name: 'learning',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('help', {
	name: 'help',
	template: 'contact',
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('faq', {
	name: 'faq',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('impressum', {
	name: 'impressum',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('demo', {
	name: 'demo',
	template: 'demo',
	subscriptions: function () {
		return [Meteor.subscribe('demoCardsets'), Meteor.subscribe('demoCards')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('demolist', {
	name: 'demolist',
	template: 'demo',
	subscriptions: function () {
		return [Meteor.subscribe('demoCardsets'), Meteor.subscribe('demoCards')];
	},
	data: function () {
		Session.set('helpFilter', "cardsetIndex");
		return Cardsets.findOne({kind: 'demo', name: "DemoCardset", shuffled: true});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('agb', {
	name: 'agb',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('datenschutz', {
	name: 'datenschutz',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/alldecks', {
	name: 'alldecks',
	template: 'filterIndex',
	subscriptions: function () {
		return [Meteor.subscribe('allCardsets'), Meteor.subscribe('paidCardsets'), Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', "pool");
		Filter.resetMaxItemCounter();
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/create', {
	name: 'create',
	template: 'filterIndex',
	subscriptions: function () {
		return [Meteor.subscribe('myCardsets')];
	},
	data: function () {
		Session.set('helpFilter', "create");
		Filter.resetMaxItemCounter();
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/repetitorium', {
	name: 'repetitorium',
	template: 'filterIndex',
	subscriptions: function () {
		return [Meteor.subscribe('repetitoriumCardsets'), Meteor.subscribe('paidCardsets')];
	},
	data: function () {
		Session.set('helpFilter', "repetitorium");
		Filter.resetMaxItemCounter();
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/learn', {
	name: 'learn',
	template: 'filterIndex',
	subscriptions: function () {
		return [Meteor.subscribe('workloadCardsets'), Meteor.subscribe('paidCardsets'), Meteor.subscribe('userWorkload'), Meteor.subscribe('userLeitner'), Meteor.subscribe('userWozniak')];
	},
	data: function () {
		Session.set('helpFilter', "workload");
		Filter.resetMaxItemCounter();
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardset', function () {
	this.redirect('learn');
});

Router.route('/cardset/:_id', {
	name: 'cardsetdetailsid',
	template: 'cardsetAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetUserRating', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardset/:_id/card/:card_id', {
	name: 'cardsetcard',
	template: 'cardsetAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetUserRating', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		Session.set('activeCard', this.params.card_id);
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardset/:_id/editshuffle', {
	name: 'editshuffle',
	template: 'filterIndexShuffle',
	subscriptions: function () {
		return [Meteor.subscribe('editShuffleCardsets', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "shuffle");
		Filter.resetMaxItemCounter();
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardset/:_id/editors', {
	name: 'cardseteditors',
	template: 'cardsetManageEditors',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardset");
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardset/:_id/stats', {
	name: 'cardsetstats',
	template: 'cardsetLearnActivityStatistic',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('cardsetUserRating', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "bonusStatistics");
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardsetlist', function () {
	this.redirect('create');
});

Router.route('/cardsetlist/:_id', {
	name: 'cardsetlistid',
	template: 'cardsetAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetUserRating', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardsetIndex");
		Session.set('isNewCardset', false);
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardset/:_id/newcard', {
	name: 'newCard',
	template: 'newCard',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardEditor");
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/cardset/:_id/editcard/:card_id', {
	name: 'editCard',
	template: 'editCard',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardEditor");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/pool', {
	name: 'pool',
	template: 'filterIndex',
	subscriptions: function () {
		return [Meteor.subscribe('poolCardsets'), Meteor.subscribe('paidCardsets')];
	},
	data: function () {
		Session.set('helpFilter', "pool");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/progress/:_id/:user_id', {
	name: 'progress',
	template: 'progress',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('userCardsetLeitner', this.params._id, this.params.user_id)];
	},
	data: function () {
		Session.set('helpFilter', "workloadProgress");
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/box/:_id', {
	name: 'box',
	template: 'learnAlgorithmAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/memo/:_id', {
	name: 'memo',
	template: 'learnAlgorithmAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/presentationlist/:_id', {
	name: 'presentationlist',
	template: 'presentation',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardsetIndex");
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/presentation/:_id', {
	name: 'presentation',
	template: 'presentation',
	subscriptions: function () {
		return [Meteor.subscribe('cardset', this.params._id), Meteor.subscribe('paidCardset', this.params._id), Meteor.subscribe('cardsetWorkload', this.params._id), Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('makingofcards', {
	name: 'making',
	template: 'makingOfCards',
	subscriptions: function () {
		return [Meteor.subscribe('makingOfCardsets'), Meteor.subscribe('demoCards')];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({kind: 'demo', name: "MakingOfCardset", shuffled: true});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('makingofcardslist', {
	name: 'makinglist',
	template: 'makingOfCards',
	subscriptions: function () {
		return [Meteor.subscribe('makingOfCardsets'), Meteor.subscribe('demoCards')];
	},
	data: function () {
		Session.set('helpFilter', "cardsetIndex");
		return Cardsets.findOne({kind: 'demo', name: "MakingOfCardset", shuffled: true});
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/profile/:_id/overview', {
	name: 'profileOverview',
	template: 'profile',
	subscriptions: function () {
		return [Meteor.subscribe('workloadCardsets'), Meteor.subscribe('userWorkload'), Meteor.subscribe('userLeitner')];
	},
	data: function () {
		Session.set('helpFilter', "summativeProgress");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});
Router.route('/profile/:_id/billing', {
	name: 'profileBilling',
	template: 'profile',
	subscriptions: function () {
		return [Meteor.subscribe('paidCardsets')];
	},
	data: function () {
		Session.set('helpFilter', "billing");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});
Router.route('/profile/:_id/membership', {
	name: 'profileMembership',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "membership");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});
Router.route('/profile/:_id/notifications', {
	name: 'profileNotifications',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "notifications");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});
Router.route('/profile/:_id/settings', {
	name: 'profileSettings',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "settings");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});
Router.route('/profile/:_id/requests', {
	name: 'profileRequests',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "requests");
	},
	action: function () {
		if (this.ready()) {
			this.render();
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/dashboard', {
	name: 'admin_dashboard',
	template: 'admin_dashboard',
	layoutTemplate: 'admin_main',
	loadingTemplate: 'admin_dashboard',
	subscriptions: function () {
		return [Meteor.subscribe("serverInventory"), Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/users', {
	name: 'admin_users',
	template: 'admin_users',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/user/:_id', {
	name: 'admin_user',
	template: 'admin_user',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
		return Meteor.users.findOne({_id: this.params._id});
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/learningStatistics', {
	name: 'admin_learningStatistics',
	template: 'admin_learningStatistics',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('allCardsets'), Meteor.subscribe('allLeitner'), Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/apiAccess', {
	name: 'admin_apiAccess',
	template: 'admin_apiAccess',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('allCardsets'), Meteor.subscribe('userData')];
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/notifications', {
	name: 'admin_notifications',
	template: 'admin_notifications',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/university', {
	name: 'admin_university',
	template: 'admin_university',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

Router.route('/admin/settings', {
	name: 'admin_settings',
	template: 'admin_settings',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('userData')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
		WebPushNotifications.subscribeForPushNotification();
	},
	action: function () {
		if (this.ready()) {
			if (UserPermissions.isAdmin()) {
				this.render();
			} else {
				MainNavigation.setLoginTarget(false);
				this.redirect('home');
			}
		} else {
			this.render(loadingScreenTemplate);
		}
	}
});

var isSignedIn = function () {
	CardVisuals.checkFullscreen();
	if (!(Meteor.user() || Meteor.loggingIn())) {
		if (Session.get('activeLanguage') === undefined) {
			let language = "de";
			Session.set('activeLanguage', language);
			TAPi18n.setLanguage(language);
		}
		Session.set('theme', "default");
		if (MainNavigation.getLoginTarget() === undefined) {
			if (linksWithNoLoginRequirement.includes(Router.current().route.getName())) {
				MainNavigation.setLoginTarget(false);
			} else {
				MainNavigation.setLoginTarget(Router.current().url);
			}
		}
		Router.go('home');
	} else {
		Route.setFirstTimeVisit();
		let language;
		if (Meteor.user() !== undefined) {
			language = Meteor.user().profile.locale;
		} else {
			language = "de";
		}
		TAPi18n.setLanguage(language);
		Session.set('activeLanguage', language);
		if (Roles.userIsInRole(Meteor.userId(), ['firstLogin'])) {
			Router.go('firstLogin');
		}
		if (Roles.userIsInRole(Meteor.userId(), ['blocked'])) {
			Router.go('accessDenied');
		}
		this.next();
	}
};

export function firstLoginBertAlert() {
	Meteor.subscribe("userData", {
		onReady: function () {
			let firstTimeLogin = 'displayedFirstLoginBertAlert';
			if (localStorage.getItem(firstTimeLogin) === "true") {
				Bert.defaults.hideDelay = 10000;
				Bert.alert({
					title: TAPi18n.__('bertAlert.firstLogin.title', {
						firstAppTitle: ServerStyle.getFirstAppTitle(),
						lastAppTitle: ServerStyle.getLastAppTitle()
					}),
					message: TAPi18n.__('bertAlert.firstLogin.message', {lastAppTitle: ServerStyle.getLastAppTitle()}),
					type: 'info',
					style: 'growl-top-left',
					icon: 'fa-remove'
				});
				Bert.defaults.hideDelay = 10000;
				localStorage.setItem(firstTimeLogin, "false");
			}
		}
	});
}

var goToCreated = function () {
	if (Meteor.user()) {
		if (!Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked'])) {
			firstLoginBertAlert();
		}
		if (!Roles.userIsInRole(Meteor.userId(), ['firstLogin', 'blocked']) && MainNavigation.getLoginTarget() !== undefined && MainNavigation.getLoginTarget() !== false) {
			Router.go(MainNavigation.getLoginTarget());
			MainNavigation.setLoginTarget(false);
		} else {
			LoginTasks.setLoginRedirect();
		}
	} else {
		this.next();
	}
};

var setBackground = function () {
	let body = $('body');
	body.removeAttr('class');
	body.removeAttr('style');
	if (Route.isPresentation()) {
		body.addClass('presentation');
		body.css('background-image', ServerStyle.getBackground("presentation"));
	} else if (Route.isBox() || Route.isMemo()) {
		body.addClass('learning');
		body.css('background-image', ServerStyle.getBackground("learning"));
	} else if (Route.isEditMode()) {
		body.addClass('editor');
		body.css('background-image', ServerStyle.getBackground("editor"));
	} else if (Route.isDemo() | Route.isMakingOf()) {
		body.addClass('demo');
		body.css('background-image', ServerStyle.getBackground("demo"));
	} else if (Meteor.user()) {
		if (Route.isBackend()) {
			body.addClass('backend');
			body.css('background-image', ServerStyle.getBackground("backend"));
		} else {
			body.addClass('internal');
			body.css('background-image', ServerStyle.getBackground("internal"));
		}
	} else {
		body.addClass('landing-page');
		body.css('background-image', ServerStyle.getBackground("landing-page"));
	}
	this.next();
};

Router.onBeforeAction(setBackground);

Router.onBeforeAction(isSignedIn, {
	except: linksWithNoLoginRequirement
});

Router.onBeforeAction(goToCreated, {
	only: ['home']
});
