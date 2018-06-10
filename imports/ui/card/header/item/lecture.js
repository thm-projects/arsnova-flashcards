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
	"click #showLecture": function (evt) {
		setTimeout(function () {
			$('html, body').animate({
				scrollTop: $($(evt.target).data('target')).offset().top
			}, 1000);
		}, 500);
		if (!$('#showLecture').children().hasClass("pressed")) {
			$('#showLecture').children().addClass("pressed");
		} else {
			$('#showLecture').children().removeClass("pressed");
		}
	}
});
