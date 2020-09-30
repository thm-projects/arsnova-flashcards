import {Session} from "meteor/session";
import {HTTP} from "meteor/http";
import {ServerStyle} from "./styles";

let visitedLandingPage = "visitedLandingPage";

export let LandingPage = class LandingPage {
	static getStatus () {
		return LandingPage.status;
	}
	static checkLandingPageVisit () {
		// check if landing page has already been visited
		if (localStorage.getItem(visitedLandingPage) === undefined || localStorage.getItem(visitedLandingPage) === null || localStorage.getItem(visitedLandingPage) === "false") {
			return true;
		}
		return false;
	}
	static processParams (landingPageVisited, languageChosen) {
		if (landingPageVisited !== undefined) {
			// set landing page as visited in the cash
			localStorage.setItem(visitedLandingPage, landingPageVisited);
			// set language based on the one chosen on the landing page
			Session.set('activeLanguage', languageChosen);
		}
	}
	static visited () {
		localStorage.setItem(visitedLandingPage, 'yes');
	}
	//pings the landing page
	static isOnline () {
		const url = ServerStyle.getConfig().landingPage;
		if (url !== "") {
			// http call to the landing page, timeout after 2sec
			HTTP.call('GET', url, {
				timeout: 2000
			}, function (error, result) {
				if (error) {
					console.log(error);
					LandingPage.status = false;
				}
				if (result) {
					LandingPage.status = result.statusCode === 200;
				}
			});
		}
	}
};
