import * as cardset from "../../features_helper/cardset.js";
import * as navigation from "../../features_helper/navigation.js";
import * as learn from "../../features_helper/learn.js";

module.exports = function () {
	'use strict';

	this.Given(/^user is logged in$/, function () {
		navigation.login("standardLogin");
	});

	this.When(/^change to cardset$/, function () {
		navigation.selectMyCardset();
		navigation.selectCardsetList(1);
	});

	this.Then(/^they are on the cardset$/, function () {
		cardset.collapseCardsetInfo(false);
	});

	this.Then(/^they start the SuperMemo mode$/, function () {
		cardset.learnMemo(true);
	});

	this.Then(/^they see the SuperMemo view$/, function () {
		learn.memoView();
	});

	this.Then(/^they change the view back to cardset$/, function () {
		navigation.back(true);
	});

	this.Then(/^they see the cardset again$/, function () {
		cardset.collapseCardsetInfo(false);
	});

	this.Then(/^they log out$/, function () {
		navigation.logout();
	});
};
