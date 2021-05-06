import {ServerStyle} from "./styles";
import {Route} from "./route";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "./mainNavigation";

export let ThemeSwitcher = class ThemeSwitcher {
	static changeToBackgroundStyle (name, cssClass = undefined) {
		ThemeSwitcher.setBackground(ServerStyle.getBackground(name), cssClass);
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
				ThemeSwitcher.changeToBackgroundStyle("demoIndex", "presentation-list");
			} else {
				ThemeSwitcher.changeToBackgroundStyle("demo", "demo");
			}
		} else if (Route.isAGB()) {
			ThemeSwitcher.changeToBackgroundStyle("agb");
		} else if (Route.isDatenschutz()) {
			ThemeSwitcher.changeToBackgroundStyle("datenschutz");
		} else if (Route.isImpressum()) {
			ThemeSwitcher.changeToBackgroundStyle("impressum");
		} else if (Route.isAbout()) {
			ThemeSwitcher.changeToBackgroundStyle("about");
		} else if (Route.isLearning()) {
			ThemeSwitcher.changeToBackgroundStyle("learning");
		} else if (Route.isFaq()) {
			ThemeSwitcher.changeToBackgroundStyle("faq");
		} else if (Route.isHelp()) {
			ThemeSwitcher.changeToBackgroundStyle("help");
		} else {
			ThemeSwitcher.changeToBackgroundStyle("landing-page");
		}
	}

	static setTheme () {
		if (Route.isRouteWithoutMainNavigation()) {
			Session.set('displayMainNavigation', false);
		} else {
			Session.set('displayMainNavigation', true);
		}
		if (ServerStyle.getAppThemes().length > 1 && Meteor.user()) {
			//Check if the user got a saved theme or if the saved theme is still available
			let savedTheme = ServerStyle.getSavedTheme();
			if (savedTheme !== undefined) {
				Session.set("theme", savedTheme.theme);
			} else {
				let defaultThemeID = ServerStyle.getDefaultThemeID();
				Session.set("theme", defaultThemeID);
				Meteor.call("updateUserTheme", defaultThemeID);
			}
		}
		ThemeSwitcher.displayTheme();
	}

	static displayTheme () {
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
		this.setBackgroundStyle();
	}

	static setBackgroundStyle () {
		//Background
		if (Route.isLandingPageRoutes()) {
			ThemeSwitcher.landingPageBackgrounds();
		} else if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
			if (Route.isBackend()) {
				ThemeSwitcher.changeToBackgroundStyle("backend", "backend");
			} else {
				let internal = 'internal';
				if (Route.isProfile()) {
					if (Route.isProfileSettings()) {
						ThemeSwitcher.changeToBackgroundStyle("profileSettings", internal);
					} else if (Route.isProfileMembership()) {
						ThemeSwitcher.changeToBackgroundStyle("profileMembership", internal);
					} else if (Route.isProfileRequests()) {
						ThemeSwitcher.changeToBackgroundStyle("profileRequests", internal);
					} else {
						ThemeSwitcher.changeToBackgroundStyle("profileBilling", internal);
					}
				} else if (Route.isPublic()) {
					ThemeSwitcher.changeToBackgroundStyle("pool", internal);
				} else if (Route.isWorkload()) {
					ThemeSwitcher.changeToBackgroundStyle("workload", internal);
				} else if (Route.isPersonal()) {
					ThemeSwitcher.changeToBackgroundStyle("personal", internal);
				} else if (Route.isMyTranscripts() || Route.isMyBonusTranscripts()) {
					ThemeSwitcher.changeToBackgroundStyle("transcripts", internal);
				} else if (Route.isAll()) {
					ThemeSwitcher.changeToBackgroundStyle("allPool", internal);
				} else if (Route.isCardset()) {
					ThemeSwitcher.changeToBackgroundStyle("cardset", internal);
				} else if (Route.isCardsetLeitnerStats()) {
					ThemeSwitcher.changeToBackgroundStyle("cardsetLeitnerStats", internal);
				} else if (Route.isTranscriptBonus()) {
					ThemeSwitcher.changeToBackgroundStyle("cardsetTranscriptBonus", internal);
				} else if (Route.isPresentation()) {
					if (Route.isPresentationViewList()) {
						ThemeSwitcher.changeToBackgroundStyle("presentationIndex", "presentation-list");
					} else {
						ThemeSwitcher.changeToBackgroundStyle("presentation", "presentation");
					}
				} else if (Route.isBox() || Route.isMemo()) {
					let learning = 'learning';
					if (Route.isBox()) {
						ThemeSwitcher.changeToBackgroundStyle("leitner", learning);
					} else {
						ThemeSwitcher.changeToBackgroundStyle("wozniak", learning);
					}
				} else if (Route.isEditMode()) {
					ThemeSwitcher.changeToBackgroundStyle("editor", "editor");
				} else if (Route.isLandingPageRoutes()) {
					ThemeSwitcher.landingPageBackgrounds();
				} else if (Route.isNotFound()) {
					ThemeSwitcher.changeToBackgroundStyle("notFound", internal);
				} else {
					ThemeSwitcher.changeToBackgroundStyle("internal", "internal");
				}
			}
		} else {
			let landingPage;
			if (!Route.isLandingPageRoutes()) {
				landingPage = 'landing-page';
			}
			ThemeSwitcher.changeToBackgroundStyle("landing-page", landingPage);
		}
	}
};
