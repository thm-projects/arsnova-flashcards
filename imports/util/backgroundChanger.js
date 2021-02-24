import {ServerStyle} from "./styles";
import {Route} from "./route";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "./mainNavigation";

export let BackgroundChanger = class BackgroundChanger {
	static changeToStyle (name, cssClass = undefined) {
		BackgroundChanger.setBackground(ServerStyle.getBackground(name), cssClass);
	}

	static setBackground (backgroundObject, cssClass = undefined) {
		const body = $('body');
		body.removeAttr('class');
		body.removeAttr('style');
		if (cssClass !== undefined) {
			body.addClass(cssClass);
		}
		const keys = Object.keys(backgroundObject);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			body.css(key, backgroundObject[key]);
		}
	}

	static landingPageBackgrounds () {
		if (Route.isDemo() || Route.isMakingOf()) {
			if (Route.isPresentationViewList()) {
				BackgroundChanger.changeToStyle("demoIndex", "presentation-list");
			} else {
				BackgroundChanger.changeToStyle("demo", "demo");
			}
		} else if (Route.isAGB()) {
			BackgroundChanger.changeToStyle("agb");
		} else if (Route.isDatenschutz()) {
			BackgroundChanger.changeToStyle("datenschutz");
		} else if (Route.isImpressum()) {
			BackgroundChanger.changeToStyle("impressum");
		} else if (Route.isAbout()) {
			BackgroundChanger.changeToStyle("about");
		} else if (Route.isLearning()) {
			BackgroundChanger.changeToStyle("learning");
		} else if (Route.isFaq()) {
			BackgroundChanger.changeToStyle("faq");
		} else if (Route.isHelp()) {
			BackgroundChanger.changeToStyle("help");
		} else {
			BackgroundChanger.changeToStyle("landing-page");
		}
	}

	static setTheme () {
		if (Route.isRouteWithoutMainNavigation()) {
			Session.set('displayMainNavigation', false);
		} else {
			Session.set('displayMainNavigation', true);
		}
		if (Meteor.user()) {
			// If there is no selectedColorTheme the Session var "theme" will stay NULL.
			if (Meteor.users.findOne(Meteor.userId())) {
				if (Meteor.users.findOne(Meteor.userId()).selectedColorTheme) {
					Session.set("theme", ServerStyle.getDefaultTheme());
				}
			}
		} else {
			// When user logged out, go back to default Theme
			Session.set("theme", ServerStyle.getDefaultTheme());
		}
		let themeId;
		if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
			if (Session.get('fullscreen') && !Route.isPresentationList()) {
				themeId = 'theme-wrapper-no-nav';
			} else {
				themeId = 'theme-wrapper';
			}
		} else {
			if (!Session.get('fullscreen') && !Route.isPresentationList()) {
				themeId = 'theme-wrapper-no-nav-welcome';
			} else {
				themeId = 'theme-wrapper-no-nav';
			}
		}
		let html = $('html');
		if (Route.isCardset()) {
			themeId = 'theme-wrapper-cardset';
		}
		html.attr('id', themeId);
		html.attr('class', Session.get("theme"));

		//Background
		if (Route.isLandingPageRoutes()) {
			BackgroundChanger.landingPageBackgrounds();
		} else if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
			if (Route.isBackend()) {
				BackgroundChanger.changeToStyle("backend", "backend");
			} else {
				let internal = 'internal';
				if (Route.isProfile()) {
					if (Route.isProfileSettings()) {
						BackgroundChanger.changeToStyle("profileSettings", internal);
					} else if (Route.isProfileMembership()) {
						BackgroundChanger.changeToStyle("profileMembership", internal);
					} else if (Route.isProfileRequests()) {
						BackgroundChanger.changeToStyle("profileRequests", internal);
					} else {
						BackgroundChanger.changeToStyle("profileBilling", internal);
					}
				} else if (Route.isPublic()) {
					BackgroundChanger.changeToStyle("pool", internal);
				} else if (Route.isWorkload()) {
					BackgroundChanger.changeToStyle("workload", internal);
				} else if (Route.isPersonal()) {
					BackgroundChanger.changeToStyle("personal", internal);
				} else if (Route.isMyTranscripts() || Route.isMyBonusTranscripts()) {
					BackgroundChanger.changeToStyle("transcripts", internal);
				} else if (Route.isAll()) {
					BackgroundChanger.changeToStyle("allPool", internal);
				} else if (Route.isCardset()) {
					BackgroundChanger.changeToStyle("cardset", internal);
				} else if (Route.isCardsetLeitnerStats()) {
					BackgroundChanger.changeToStyle("cardsetLeitnerStats", internal);
				} else if (Route.isTranscriptBonus()) {
					BackgroundChanger.changeToStyle("cardsetTranscriptBonus", internal);
				} else if (Route.isPresentation()) {
					if (Route.isPresentationViewList()) {
						BackgroundChanger.changeToStyle("presentationIndex", "presentation-list");
					} else {
						BackgroundChanger.changeToStyle("presentation", "presentation");
					}
				} else if (Route.isBox() || Route.isMemo()) {
					let learning = 'learning';
					if (Route.isBox()) {
						BackgroundChanger.changeToStyle("leitner", learning);
					} else {
						BackgroundChanger.changeToStyle("wozniak", learning);
					}
				} else if (Route.isEditMode()) {
					BackgroundChanger.changeToStyle("editor", "editor");
				} else if (Route.isLandingPageRoutes()) {
					BackgroundChanger.landingPageBackgrounds();
				} else if (Route.isNotFound()) {
					BackgroundChanger.changeToStyle("notFound", internal);
				} else {
					BackgroundChanger.changeToStyle("internal", "internal");
				}
			}
		} else {
			let landingPage;
			if (!Route.isLandingPageRoutes()) {
				landingPage = 'landing-page';
			}
			BackgroundChanger.changeToStyle("landing-page", landingPage);
		}
	}
};
