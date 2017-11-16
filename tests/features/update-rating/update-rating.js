import * as cardset from "../../features_helper/cardset.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';

	this.Given(/^User is logged in$/, function () {
		navigation.login("lecturerLogin");
	});

	this.Given(/^I am on a cardset that I don't own and haven't rated$/, function () {
		navigation.selectPoolList(8);
	});

	this.Then(/^the cardset isn't rated by me$/, function () {
		cardset.collapseCardsetInfo(true);
		navigation.compareContent('#userRating', 0, 6);
	});

	this.Then(/^my cardset ratings gets updated to 4$/, function () {
		navigation.clickElement('#rating > div > div:nth-child(2) > span.star-4');
		navigation.compareContent('#userRating', 4, 6);
	});


	this.Then(/^my cardset ratings gets updated to 2$/, function () {
		navigation.clickElement('#rating > div > div:nth-child(4) > span.star-2');
		navigation.compareContent('#userRating', 2, 6);
		navigation.logout();
	});
};
