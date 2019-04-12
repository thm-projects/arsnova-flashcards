import * as global from "./global.js";

function agreeCookies() {
	browser.waitForExist('.cc-dismiss', global.threshold);
	browser.setCookie({name: 'cookieconsent_dismissed', value: 'yes'});
	browser.click('.cc-dismiss');
}

function setResolution() {
	browser.windowHandleMaximize('current');
}

module.exports = {
	login: function (userLogin) {
		browser.url(global.baseURL);
		setResolution();
		agreeCookies();
		userLogin += "Login";
		browser.waitForVisible('#TestingBackdoorUsername', global.threshold);
		this.clickElement('#TestingBackdoorUsername', global.threshold);
		browser.waitForVisible('#' + userLogin);
		this.clickElement('#' + userLogin);
		browser.waitForVisible('#BackdoorLogin', global.threshold);
		this.clickElement('#BackdoorLogin');
		browser.waitForVisible('.useCasesCancel', global.threshold);
		this.clickElement('.useCasesCancel', global.threshold);
		if (browser.isVisible(".bert-alert")) {
			this.clickElement(".bert-alert");
		}
	},
	logout: function () {
		browser.waitForVisible('.logout-main', global.threshold);
		browser.click('.logout-main');
	},
	selectMyCardset: function () {
		browser.waitForVisible('#navbar-personal', global.threshold);
		browser.click('#navbar-personal');
		browser.waitForVisible('#navbar-personal-cardsets', global.threshold);
		browser.click('#navbar-personal-cardsets');
		this.checkUrl(global.createRoute);
	},
	selectLearnset: function () {
		browser.waitForVisible('#navbar-learn-decks', global.threshold);
		browser.click('#navbar-learn-decks');
		this.checkUrl(global.learnRoute);
		browser.waitForVisible('#browseCardset', global.threshold);
		browser.click('#browseCardset');
	},
	selectPool: function () {
		browser.waitForVisible('#pool', global.threshold);
		browser.click('#pool');
		this.checkUrl(global.poolRoute);
	},
	selectCardsetLink: function (number) {
		number = number - 1;
		if (browser.isVisible('#showMoreResults')) {
			browser.click('#showMoreResults', global.threshold);
		}
		browser.waitForVisible('#cardsetLink' + number, global.threshold);
		browser.click('#cardsetLink' + number);
	},
	checkCardsetCardQuantity: function () {
		browser.waitForExist("#collapseCardsetInfoButton", global.threshold);
		browser.click('#collapseCardsetInfoButton');
		browser.waitForExist(".cardsetCardCount", global.threshold);
		return browser.getAttribute(".cardsetCardCount", "data-count");
	},
	checkUrl: function (url) {
		browser.waitUntil(function () {
			return (global.baseURL + url) === browser.getUrl();
		}, global.threshold, 'expected URL to be ' + browser.getUrl() + ' but got ' + (global.baseURL + url) + global.thresholdText);
	},
	compareUrl: function (url1, url2) {
		browser.waitUntil(function () {
			return url1 === url2;
		}, global.threshold, 'expected URL to be ' + url1 + ' but got ' + url2 + global.thresholdText);
	},
	firstLogin: function (username) {
		this.login(username);
		browser.waitForExist('#accept_checkbox', global.threshold);
		browser.$('#accept_checkbox').click();
		browser.click('button[id="accept_button"]');
	},
	logoutAdmin: function () {
		browser.waitForExist('#logout_admin', global.threshold);
		browser.click('#logout_admin');
	},
	leitnerWozniakBackButton: function (click = true) {
		browser.waitForVisible('.backToCardset', global.threshold);
		if (click) {
			browser.click('.backToCardset');
		}
	},
	back: function (click = true) {
		browser.waitForVisible('#backButton', global.threshold);
		if (click) {
			browser.click('#backButton');
		}
	},
	switchToBackEnd: function (click = true) {
		browser.waitForVisible("#adminpanel", global.threshold);
		if (click) {
			browser.click('#adminpanel');
		}
	},
	backendCardset: function (click = true) {
		browser.waitForVisible("a[href='/admin/cardsets']", global.threshold);
		if (click) {
			browser.click("a[href='/admin/cardsets']");
		}
	},
	backendCollege: function (click = true) {
		browser.waitForVisible("a[href='/admin/university']", global.threshold);
		if (click) {
			browser.click("a[href='/admin/university']");
		}
	},
	newCardset: function (click = true) {
		browser.waitForVisible('#newCardSet', global.threshold);
		if (click) {
			browser.click('#newCardSet');
		}
	},
	compareContent: function (content1, content2, dataType, attribute = 0, isTrue = true) {
		let errorMessage = '';
		let receivedContent = '';
		if (dataType < 4) {
			browser.waitForVisible(content1, global.threshold);
			errorMessage = 'Expected content of ' + content1 + ' to be ' + content2 + ' but got ';
		} else {
			errorMessage = 'Expected content ' + content1 + ' to be ' + content2;
		}
		browser.waitUntil(function () {
			switch (dataType) {
				case 0:
					browser.waitForVisible(content1, global.threshold);
					receivedContent = browser.getText(content1);
					return (receivedContent === content2) === isTrue;
				case 1:
					browser.waitForVisible(content1, global.threshold);
					receivedContent = browser.elements(content1).value.length;
					return (receivedContent === content2) === isTrue;
				case 2:
					browser.waitForVisible(content1, global.threshold);
					receivedContent = browser.getAttribute(content1, attribute);
					return (receivedContent === content2) === isTrue;
				case 3:
					browser.waitForVisible(content1, global.threshold);
					receivedContent = browser.getAttribute(content1, attribute);
					return (parseInt(receivedContent) === parseInt(content2)) === isTrue;
				case 4:
					return (content1 === content2) === isTrue;
				case 5:
					return (parseInt(content1) === parseInt(content2)) === isTrue;
				case 6:
					browser.waitForVisible(content1, global.threshold);
					receivedContent = browser.getText(content1);
					return (parseInt(receivedContent) === parseInt(content2)) === isTrue;
			}
		}, global.threshold, errorMessage + receivedContent + global.thresholdText);
	},
	getContent: function (content, dataType, attribute = 0) {
		browser.waitForVisible(content, global.threshold);
		switch (dataType) {
			case 0:
				return browser.getText(content);
			case 1:
				return browser.elements(content).value.length;
			case 2:
				return browser.getAttribute(content, attribute);
		}
	},
	contentVisible: function (element, isVisible = true) {
		let notVisible = '';
		if (!isVisible) {
			notVisible = 'not ';
		}
		browser.waitUntil(function () {
			return browser.isVisible(element) === isVisible;
		}, global.threshold, 'expected ' + element + ' to be ' + notVisible + 'visible' + global.thresholdText);
	},
	setContent: function (content, text) {
		browser.waitForVisible(content, global.threshold);
		browser.setValue(content, text);
	},
	clickElement: function (element) {
		browser.waitForVisible(element, global.threshold);
		browser.click(element);
	},
	resetPool: function () {
		this.selectPool();
		browser.waitForVisible('.resetBtn', global.threshold);
		browser.click('.resetBtn');
	},
	waitForModalBackdrop: function () {
		browser.waitUntil(function () {
			return browser.isVisible(".modal-backdrop") === false;
		}, global.threshold, 'expected Modal to be not visible' + global.thresholdText);
	}
};
