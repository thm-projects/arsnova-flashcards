import "./bonusTitle.html";


/*
* ############################################################################
* cardsetInfoBoxItemBonusTitle
* ############################################################################
*/

Template.cardsetInfoBoxItemBonusTitle.helpers({
	gotTitle: function () {
		return this.title !== undefined && this.title.length;
	}
});
