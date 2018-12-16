import {Cardsets} from "../../api/cardsets.js";
import {Leitner, Wozniak} from "../../api/learned";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {CardVisuals} from "../../api/cardVisuals.js";
import {Route} from "../../api/route.js";
import {Filter} from "../../api/filter";
import {MarkdeepEditor} from "../../api/markdeepEditor";
import {WebPushNotifications} from "../../api/webPushSubscriptions";
import {UserPermissions} from "../../api/permissions";
import {MainNavigation} from "../../api/mainNavigation";

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
	data: function () {
		Session.set('activeRouteTitle', TAPi18n.__('contact.help', {}, Session.get('activeLanguage')));
	},
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
		Session.set('activeRouteTitle', TAPi18n.__('navbar-collapse.alldecks', {}, Session.get('activeLanguage')));
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
		switch (Cardsets.find({owner: Meteor.userId()}).count()) {
			case 0:
				Session.set('activeRouteTitle',  TAPi18n.__('navbar-collapse.noCarddecks', {}, Session.get('activeLanguage')));
				break;
			case 1:
				Session.set('activeRouteTitle',  TAPi18n.__('navbar-collapse.oneCarddeck', {}, Session.get('activeLanguage')));
				break;
			default:
				Session.set('activeRouteTitle',  TAPi18n.__('navbar-collapse.carddecks', {}, Session.get('activeLanguage')));
		}
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
		Session.set('activeRouteTitle', TAPi18n.__('navbar-collapse.course', {}, Session.get('activeLanguage')));
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
		Session.set('activeRouteTitle', TAPi18n.__('navbar-collapse.learndecks', {}, Session.get('activeLanguage')));
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
		Session.set('activeRouteTitle', TAPi18n.__('navbar-collapse.pool', {}, Session.get('activeLanguage')));
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
		Session.set('helpFilter', "workloadProgress");
		Session.set('activeRouteTitle', TAPi18n.__('profile.activity', {}, Session.get('activeLanguage')));
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
		Session.set('activeRouteTitle', TAPi18n.__('profile.billing', {}, Session.get('activeLanguage')));
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
		Session.set('activeRouteTitle', TAPi18n.__('profile.membership', {}, Session.get('activeLanguage')));
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
		Session.set('activeRouteTitle', TAPi18n.__('profile.notifications', {}, Session.get('activeLanguage')));
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
		Session.set('activeRouteTitle', TAPi18n.__('profile.settings.name', {}, Session.get('activeLanguage')));
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
		Session.set('activeRouteTitle', TAPi18n.__('profile.requests', {}, Session.get('activeLanguage')));
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
				Bert.defaults.hideDelay = 97200;
				Bert.alert({
					title: TAPi18n.__('bertAlert.firstLogin.title', {
						firstAppTitle: Meteor.settings.public.welcome.title.first,
						lastAppTitle: Meteor.settings.public.welcome.title.last
					}),
					message: TAPi18n.__('bertAlert.firstLogin.message', {lastAppTitle: Meteor.settings.public.welcome.title.last}),
					type: 'info',
					style: 'growl-top-left',
					icon: 'fa-heart'
				});
				Bert.defaults.hideDelay = 7;
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
			if (Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
				Router.go('alldecks');
			} else {
				Meteor.subscribe("userLeitner", {
					onReady: function () {
						Meteor.subscribe("userWozniak", {
							onReady: function () {
								let actualDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
								actualDate.setHours(0, 0, 0, 0);
								let count = Leitner.find({
									user_id: Meteor.userId(),
									active: true
								}).count() + Wozniak.find({
									user_id: Meteor.userId(), nextDate: {
										$lte: actualDate
									}
								}).count();
								if (count) {
									Router.go('learn');
								} else {
									Router.go('pool');
								}
							}
						});
					}
				});
			}
		}
	} else {
		this.next();
	}
};

Router.onBeforeAction(isSignedIn, {
	except: linksWithNoLoginRequirement
});

Router.onBeforeAction(goToCreated, {
	only: ['home']
});
