import {Cardsets} from "../../api/cardsets.js";
import {Cards} from "../../api/cards.js";
import {Leitner, Wozniak} from "../../api/learned";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";
import {CardVisuals} from "../../api/cardVisuals.js";
import {Route} from "../../api/route.js";
import {CardEditor} from "../../api/cardEditor";
import {Filter} from "../../api/filter";
import {MarkdeepEditor} from "../../api/markdeepEditor";

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
	template: 'welcome',
	data: function () {
		Session.set('helpFilter', Router.current().route.getName());
		return Cardsets.findOne({_id: Session.get('wordcloudItem')});
	}
});

Router.route('about', {
	name: 'about',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('learning', {
	name: 'learning',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('help', {
	name: 'help',
	template: 'contact'
});

Router.route('faq', {
	name: 'faq',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('impressum', {
	name: 'impressum',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('demo', {
	name: 'demo',
	template: 'demo',
	subscriptions: function () {
		return [Meteor.subscribe('demoCards')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('demolist', {
	name: 'demolist',
	template: 'demo',
	subscriptions: function () {
		return [Meteor.subscribe('demoCards')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({kind: 'demo', name: "DemoCardset", shuffled: true});
	}
});

Router.route('agb', {
	name: 'agb',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('datenschutz', {
	name: 'datenschutz',
	template: 'contact',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('/alldecks', {
	name: 'alldecks',
	template: 'cardsets',
	data: function () {
		Session.set('helpFilter', undefined);
		Filter.resetMaxItemCounter();
	}
});

Router.route('/create', {
	name: 'create',
	template: 'cardsets',
	data: function () {
		Session.set('helpFilter', "create");
		Filter.resetMaxItemCounter();
	}
});

Router.route('/repetitorium', {
	name: 'repetitorium',
	template: 'cardsets',
	data: function () {
		Session.set('helpFilter', "repetitorium");
		Filter.resetMaxItemCounter();
	}
});

Router.route('/learn', {
	name: 'learn',
	template: 'cardsets',
	loadingTemplate: 'cardsets',
	waitOn: function () {
		return [Meteor.subscribe('userLeitner'), Meteor.subscribe('userWozniak')];
	},
	data: function () {
		Session.set('helpFilter', "workload");
		Filter.setActiveFilter();
	}
});

Router.route('/shuffle', {
	name: 'shuffle',
	template: 'cardsets',
	data: function () {
		Session.set('helpFilter', "shuffle");
		Session.set('isNewCardset', true);
		Filter.resetMaxItemCounter();
	}
});

Router.route('/cardset', function () {
	this.redirect('learn');
});

Router.route('/cardset/:_id', {
	name: 'cardsetdetailsid',
	template: 'cardsetAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/card/:card_id', {
	name: 'cardsetcard',
	template: 'cardsetAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		Session.set('activeCard', this.params.card_id);
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/editshuffle', {
	name: 'editshuffle',
	template: 'shuffle',
	data: function () {
		Session.set('helpFilter', "shuffle");
		Filter.resetMaxItemCounter();
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/editors', {
	name: 'cardseteditors',
	template: 'cardsetManageEditors',
	data: function () {
		Session.set('helpFilter', "cardset");
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/stats', {
	name: 'cardsetstats',
	template: 'cardsetLearnActivityStatistic',
	data: function () {
		Session.set('helpFilter', "workloadProgress");
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardsetlist', function () {
	this.redirect('create');
});

Router.route('/cardsetlist/:_id', {
	name: 'cardsetlistid',
	template: 'cardsetAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardset");
		Session.set('isNewCardset', false);
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/newcard', {
	name: 'newCard',
	template: 'newCard',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardEditor");
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/cardset/:_id/editcard/:card_id', {
	name: 'editCard',
	template: 'editCard',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', "cardEditor");
		CardEditor.loadEditModeContent(Cards.findOne({_id: this.params.card_id}));
	}
});

Router.route('/pool', {
	name: 'pool',
	template: 'pool',
	data: function () {
		Session.set('helpFilter', "pool");
	}
});

Router.route('/progress/:_id/:user_id', {
	name: 'progress',
	template: 'progress',
	subscriptions: function () {
		return [Meteor.subscribe('userCardsetLeitner', this.params._id, this.params.user_id)];
	},
	action: function () {
		if (this.ready()) {
			this.render();
		}
	},
	data: function () {
		Session.set('helpFilter', "workloadProgress");
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/box/:_id', {
	name: 'box',
	template: 'learnAlgorithmAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetLeitner', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "leitner");
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/memo/:_id', {
	name: 'memo',
	template: 'learnAlgorithmAccess',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id), Meteor.subscribe('cardsetWozniak', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', "wozniak");
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/presentationlist/:_id', {
	name: 'presentationlist',
	template: 'presentation',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('/presentation/:_id', {
	name: 'presentation',
	template: 'presentation',
	subscriptions: function () {
		return [Meteor.subscribe('cardsetCards', this.params._id)];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({_id: this.params._id});
	}
});

Router.route('makingofcards', {
	name: 'making',
	template: 'makingOfCards',
	subscriptions: function () {
		return [Meteor.subscribe('demoCards')];
	},
	data: function () {
		MarkdeepEditor.changeMobilePreview(true);
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({kind: 'demo', name: "MakingOfCardset", shuffled: true});
	}
});

Router.route('makingofcardslist', {
	name: 'makinglist',
	template: 'makingOfCards',
	subscriptions: function () {
		return [Meteor.subscribe('demoCards')];
	},
	data: function () {
		Session.set('helpFilter', undefined);
		return Cardsets.findOne({kind: 'demo', name: "MakingOfCardset", shuffled: true});
	}
});

Router.route('/profile/:_id/overview', {
	name: 'profileOverview',
	template: 'profile',
	subscriptions: function () {
		return [Meteor.subscribe('userLeitner')];
	},
	action: function () {
		if (this.ready()) {
			this.render();
		}
	},
	data: function () {
		Session.set('helpFilter', "workloadProgress");
	}
});
Router.route('/profile/:_id/billing', {
	name: 'profileBilling',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "billing");
	}
});
Router.route('/profile/:_id/membership', {
	name: 'profileMembership',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "membership");
	}
});
Router.route('/profile/:_id/notifications', {
	name: 'profileNotifications',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "notifications");
	}
});
Router.route('/profile/:_id/settings', {
	name: 'profileSettings',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "settings");
	}
});
Router.route('/profile/:_id/requests', {
	name: 'profileRequests',
	template: 'profile',
	data: function () {
		Session.set('helpFilter', "requests");
	}
});

Router.route('/admin/dashboard', {
	name: 'admin_dashboard',
	template: 'admin_dashboard',
	layoutTemplate: 'admin_main',
	loadingTemplate: 'admin_dashboard',
	waitOn: function () {
		return [Meteor.subscribe("serverInventory")];
	},
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('/admin/users', {
	name: 'admin_users',
	template: 'admin_users',
	layoutTemplate: 'admin_main',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('/admin/user/:_id', {
	name: 'admin_user',
	template: 'admin_user',
	layoutTemplate: 'admin_main',
	data: function () {
		Session.set('helpFilter', undefined);
		return Meteor.users.findOne({_id: this.params._id});
	}
});

Router.route('/admin/learningStatistics', {
	name: 'admin_learningStatistics',
	template: 'admin_learningStatistics',
	layoutTemplate: 'admin_main',
	subscriptions: function () {
		return [Meteor.subscribe('allLeitner')];
	},
	action: function () {
		if (this.ready()) {
			this.render();
		}
	},
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('/admin/apiAccess', {
	name: 'admin_apiAccess',
	template: 'admin_apiAccess',
	layoutTemplate: 'admin_main'
});

Router.route('/admin/notifications', {
	name: 'admin_notifications',
	template: 'admin_notifications',
	layoutTemplate: 'admin_main',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('/admin/university', {
	name: 'admin_university',
	template: 'admin_university',
	layoutTemplate: 'admin_main',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});

Router.route('/admin/settings', {
	name: 'admin_settings',
	template: 'admin_settings',
	layoutTemplate: 'admin_main',
	data: function () {
		Session.set('helpFilter', undefined);
	}
});


var isSignedIn = function () {
	CardVisuals.checkFullscreen();
	if (Meteor.user()) {
		Route.setFirstTimeVisit();
	}
	if (!(Meteor.user() || Meteor.loggingIn())) {
		Router.go('home');
	} else {
		let language;
		if (Meteor.user() !== undefined) {
			language = Meteor.user().profile.locale;
		} else {
			language = "de";
		}
		TAPi18n.setLanguage(language);
		Session.set('activeLanguage', language);
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
					type: 'warning',
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
		if (!Roles.userIsInRole(Meteor.userId(), ['firstLogin'])) {
			firstLoginBertAlert();
		}
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
	} else {
		this.next();
	}
};

Router.onBeforeAction(isSignedIn, {
	except: [
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
	]
});

Router.onBeforeAction(goToCreated, {
	only: ['home']
});
