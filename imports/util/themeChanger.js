import {ServerStyle} from "./styles";
import {Route} from "./route";
import {Session} from "meteor/session";
import {Meteor} from "meteor/meteor";
import {MainNavigation} from "./mainNavigation";

export let ThemeChanger = class ThemeChanger {
	static changeToBackgroundStyle (name, cssClass = undefined) {
		ThemeChanger.setBackground(ServerStyle.getBackground(name), cssClass);
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
				ThemeChanger.changeToBackgroundStyle("demoIndex", "presentation-list");
			} else {
				ThemeChanger.changeToBackgroundStyle("demo", "demo");
			}
		} else if (Route.isAGB()) {
			ThemeChanger.changeToBackgroundStyle("agb");
		} else if (Route.isDatenschutz()) {
			ThemeChanger.changeToBackgroundStyle("datenschutz");
		} else if (Route.isImpressum()) {
			ThemeChanger.changeToBackgroundStyle("impressum");
		} else if (Route.isAbout()) {
			ThemeChanger.changeToBackgroundStyle("about");
		} else if (Route.isLearning()) {
			ThemeChanger.changeToBackgroundStyle("learning");
		} else if (Route.isFaq()) {
			ThemeChanger.changeToBackgroundStyle("faq");
		} else if (Route.isHelp()) {
			ThemeChanger.changeToBackgroundStyle("help");
		} else {
			ThemeChanger.changeToBackgroundStyle("landing-page");
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
		} else {
			// When user logged out, go back to default Theme
			Session.set("theme", ServerStyle.getDefaultThemeID());
		}
		ThemeChanger.displayTheme();
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
			ThemeChanger.landingPageBackgrounds();
		} else if (Meteor.user() || MainNavigation.isGuestLoginActive()) {
			if (Route.isBackend()) {
				ThemeChanger.changeToBackgroundStyle("backend", "backend");
			} else {
				let internal = 'internal';
				if (Route.isProfile()) {
					if (Route.isProfileSettings()) {
						ThemeChanger.changeToBackgroundStyle("profileSettings", internal);
					} else if (Route.isProfileMembership()) {
						ThemeChanger.changeToBackgroundStyle("profileMembership", internal);
					} else if (Route.isProfileRequests()) {
						ThemeChanger.changeToBackgroundStyle("profileRequests", internal);
					} else {
						ThemeChanger.changeToBackgroundStyle("profileBilling", internal);
					}
				} else if (Route.isPublic()) {
					ThemeChanger.changeToBackgroundStyle("pool", internal);
				} else if (Route.isWorkload()) {
					ThemeChanger.changeToBackgroundStyle("workload", internal);
				} else if (Route.isPersonal()) {
					ThemeChanger.changeToBackgroundStyle("personal", internal);
				} else if (Route.isMyTranscripts() || Route.isMyBonusTranscripts()) {
					ThemeChanger.changeToBackgroundStyle("transcripts", internal);
				} else if (Route.isAll()) {
					ThemeChanger.changeToBackgroundStyle("allPool", internal);
				} else if (Route.isCardset()) {
					ThemeChanger.changeToBackgroundStyle("cardset", internal);
				} else if (Route.isCardsetLeitnerStats()) {
					ThemeChanger.changeToBackgroundStyle("cardsetLeitnerStats", internal);
				} else if (Route.isTranscriptBonus()) {
					ThemeChanger.changeToBackgroundStyle("cardsetTranscriptBonus", internal);
				} else if (Route.isPresentation()) {
					if (Route.isPresentationViewList()) {
						ThemeChanger.changeToBackgroundStyle("presentationIndex", "presentation-list");
					} else {
						ThemeChanger.changeToBackgroundStyle("presentation", "presentation");
					}
				} else if (Route.isBox() || Route.isMemo()) {
					let learning = 'learning';
					if (Route.isBox()) {
						ThemeChanger.changeToBackgroundStyle("leitner", learning);
					} else {
						ThemeChanger.changeToBackgroundStyle("wozniak", learning);
					}
				} else if (Route.isEditMode()) {
					ThemeChanger.changeToBackgroundStyle("editor", "editor");
				} else if (Route.isLandingPageRoutes()) {
					ThemeChanger.landingPageBackgrounds();
				} else if (Route.isNotFound()) {
					ThemeChanger.changeToBackgroundStyle("notFound", internal);
				} else {
					ThemeChanger.changeToBackgroundStyle("internal", "internal");
				}
			}
		} else {
			let landingPage;
			if (!Route.isLandingPageRoutes()) {
				landingPage = 'landing-page';
			}
			ThemeChanger.changeToBackgroundStyle("landing-page", landingPage);
		}
	}
};
