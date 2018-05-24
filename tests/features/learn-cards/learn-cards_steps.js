import * as cardset from "../../features_helper/cardset.js";
import * as navigation from "../../features_helper/navigation.js";

module.exports = function () {
	'use strict';
	let box1Before, box1After, box2Before, box2After, box3Before, box3After, box4Before, box4After, box5Before,
		box5After, box6Before, box6After, card1, card2;

	this.Given(/^I'm logged in$/, function () {
		navigation.login("standardLogin");
	});

	this.Then(/^I'm at the leitner statistics to check my progress$/, function () {
		navigation.selectLearnset();
		navigation.selectCardsetLink(1);
		cardset.collapseCardsetInfo(false);
		cardset.leitnerProgress();
		box1Before = navigation.getContent('#boxChart', 2, 'data-box1');
		box2Before = navigation.getContent('#boxChart', 2, 'data-box2');
		box3Before = navigation.getContent('#boxChart', 2, 'data-box3');
		box4Before = navigation.getContent('#boxChart', 2, 'data-box4');
		box5Before = navigation.getContent('#boxChart', 2, 'data-box5');
		box6Before = navigation.getContent('#boxChart', 2, 'data-box6');
	});

	this.Then(/^I'll go to the leitner learning box and answer a card$/, function () {
		navigation.back();
		cardset.learnBox();
		navigation.clickElement('#learnShowAnswer');
		navigation.clickElement('#known');
	});

	this.Then(/^I'll go back to the leitner statistics view to check my progress$/, function () {
		navigation.back();
		cardset.leitnerProgress();
		box1After = navigation.getContent('#boxChart', 2, 'data-box1');
		box2After = navigation.getContent('#boxChart', 2, 'data-box2');
		box3After = navigation.getContent('#boxChart', 2, 'data-box3');
		box4After = navigation.getContent('#boxChart', 2, 'data-box4');
		box5After = navigation.getContent('#boxChart', 2, 'data-box5');
		box6After = navigation.getContent('#boxChart', 2, 'data-box6');
		navigation.compareContent(box1Before, box1After, 4);
		navigation.compareContent(box2Before, box2After, 4);
		navigation.compareContent(box3Before, box3After, 4);
		navigation.compareContent(box4Before, box4After, 4);
		navigation.compareContent(box5Before, box5After, 4);
		navigation.compareContent(box6Before, box6After, 4);
	});

	this.Given(/^I went to the super memo view of the cardset$/, function () {
		navigation.back();
		cardset.learnMemo();
	});

	this.Then(/^I'll answer a card$/, function () {
		card1 = navigation.getContent('#cardCarousel > div > div', 2, 'data-id');
		navigation.clickElement('#learnShowAnswer');
		navigation.clickElement('#memoRate5');
	});

	this.Then(/^The algorithm should give me a new card$/, function () {
		card2 = navigation.getContent('#cardCarousel > div > div', 2, 'data-id');
		navigation.compareContent(card1, card2, 4, '', false);
		navigation.logout();
	});
};
