import * as cardset from "../../features_helper/cardset.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';
	let box1, box2, box3, box4, box5, box6, card1, card2;

	this.Given(/^I'm logged in$/, function () {
		navigation.login("standardLogin");
	});

	this.Then(/^I'm at the leitner statistics to check my progress$/, function () {
		navigation.selectLearnset();
		navigation.selectLearnList(1);
		cardset.collapseCardsetInfo(false);
		cardset.leitnerProgress();
		box1 = navigation.getContent('#boxChart', 2,'data-box1');
		box2 = navigation.getContent('#boxChart', 2,'data-box2');
		box3 = navigation.getContent('#boxChart', 2,'data-box3');
		box4 = navigation.getContent('#boxChart', 2,'data-box4');
		box5 = navigation.getContent('#boxChart', 2,'data-box5');
		box6 = navigation.getContent('#boxChart', 2,'data-box6');
	});

	this.Then(/^I'll go to the leitner learning box and answer a card$/, function () {
		navigation.back();
		cardset.learnBox();
		navigation.clickElement('#cardCarousel');
		navigation.clickElement('#known');
	});

	this.Then(/^I'll go back to the leitner statistics view to check my progress$/, function () {
		navigation.back();
		cardset.leitnerProgress();
		navigation.compareContent('#boxChart', --box1, 3,'data-box1');
		navigation.compareContent('#boxChart', ++box2, 3,'data-box2');
		navigation.compareContent('#boxChart', box3, 3,'data-box3');
		navigation.compareContent('#boxChart', box4, 3,'data-box4');
		navigation.compareContent('#boxChart', box5, 3,'data-box5');
		navigation.compareContent('#boxChart', box6, 3,'data-box6');
	});

	this.Given(/^I went to the super memo view of the cardset$/, function () {
		navigation.back();
		cardset.learnMemo();
	});

	this.Then(/^I'll answer a card$/, function () {
		card1 = navigation.getContent('#cardCarousel > div > div', 2,'data-id');
		navigation.clickElement('#learnShowAnswer');
		navigation.clickElement('#memoRate5');
	});

	this.Then(/^The algorithm should give me a new card$/, function () {
		card2 = navigation.getContent('#cardCarousel > div > div', 2,'data-id');
		navigation.compareContent(card1, card2, 4, '', false);
		navigation.logout();
	});
};
