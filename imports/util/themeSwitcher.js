import {ServerStyle} from "./styles";
import {Route} from "./route";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "./mainNavigation";
import localStorageConfig from "../config/localStorage";
import {ReactiveVar} from 'meteor/reactive-var';

let savedThemeID = new ReactiveVar();

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

	static getSavedThemeID () {
		if (Meteor.user() && Meteor.user().savedTheme !== undefined) {
			savedThemeID.set(Meteor.user().savedTheme);
		} else {
			savedThemeID.set(localStorage.getItem(localStorageConfig.savedTheme));
		}
		let config = ServerStyle.getConfig().themes;
		let result = config.list.filter(object => {
			return object.theme === savedThemeID.get();
		})[0];
		if (result !== undefined) {
			return result.theme;
		}
	}

	static setTheme () {
		if (Route.isRouteWithoutMainNavigation()) {
			Session.set('displayMainNavigation', false);
		} else {
			Session.set('displayMainNavigation', true);
		}
		if (ServerStyle.getAppThemes().length > 1) {
			//Check if the user got a saved theme or if the saved theme is still available
			let savedThemeID = ThemeSwitcher.getSavedThemeID();
			if (savedThemeID !== undefined) {
				Session.set("theme", savedThemeID);
			} else {
				let defaultThemeID = ServerStyle.getDefaultThemeID();
				Session.set("theme", defaultThemeID);
				if (Meteor.user()) {
					Meteor.call("updateUserTheme", defaultThemeID);
				} else {
					ThemeSwitcher.saveGuestTheme(defaultThemeID);
				}
			}
		}
		ThemeSwitcher.displayTheme();
	}

	static saveGuestTheme (theme) {
		Session.set("theme", theme);
		localStorage.setItem(localStorageConfig.savedTheme, theme);
		savedThemeID.set(theme);
		this.displayTheme();
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
