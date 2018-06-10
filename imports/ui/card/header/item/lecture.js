import "./lecture.html";
import {CardType} from "../../../../api/cardTypes";

/*
 * ############################################################################
 * cardHeaderItemLecture
 * ############################################################################
 */

Template.cardHeaderItemLecture.helpers({
	gotLecture: function () {
		return CardType.gotLecture(this.cardType) && this.lecture !== "" && this.lecture !== undefined;
	}
});

Template.cardHeaderItemLecture.events({
	"click .showLecture": function () {
		let showLecture = $('.item.active .showLecture');
		if (showLecture.hasClass("pressed")) {
			showLecture.removeClass("pressed");
		} else {
			showLecture.addClass("pressed");
		}
	}
});
