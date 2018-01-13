import * as cardset from "../../features_helper/cardset.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	this.Given(/^user is logged in$/, function () {
		navigation.login("standardLogin");
	});

	this.When(/^change to cardset$/, function () {
		navigation.selectMyCardset();
		navigation.selectCardsetLink(8);
	});

	this.Then(/^they are on the cardset$/, function () {
		cardset.collapseCardsetInfo(false);
	});

	this.Then(/^they change the view to cardlist$/, function () {
		cardset.cardList(true);
	});

	this.Then(/^they change the view back to cardset$/, function () {
		cardset.cardDetail(true);
	});

	this.Then(/^they log out$/, function () {
		navigation.logout();
	});
};
