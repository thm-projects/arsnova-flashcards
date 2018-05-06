import {Session} from "meteor/session";
import {getPlaceholderText, gotSidesSwapped} from "../../api/cardTypes";
import {Template} from "meteor/templating";
import "./content.html";
import {isTextCentered} from "./navigation";
import {courseIterationRoute, newCardsetCourseIterationRoute} from "../forms/cardsetCourseIterationForm";

/*
 * ############################################################################
 * markdeepContent
 * ############################################################################
 */

Template.markdeepContent.rendered = function () {
	isTextCentered();
};

Template.markdeepContent.events({
	'keyup #contentEditor': function () {
		let content = $('#contentEditor').val();
		$('#editor').attr('data-content', content);
		switch (Session.get('activeEditMode')) {
			case 0:
				Session.set('frontText', content);
				break;
			case 1:
				Session.set('backText', content);
				break;
			case 2:
				Session.set('hintText', content);
				break;
			case 3:
				Session.set('lectureText', content);
				break;
		}
	}
});

Template.markdeepContent.helpers({
	getPlaceholder: function () {
		return getPlaceholderText(Session.get('activeEditMode'), Session.get('cardType'), Session.get('learningGoalLevel'));
	},
	gotSidesSwapped: function () {
		return gotSidesSwapped(this.cardType);
	},
	getShuffleDescription: function () {
		if (Session.get("ShuffleTemplate") !== undefined) {
			return ActiveRoute.name('shuffle') ? Session.get("ShuffleTemplate").description : "";
		}
	},
	isCourseIteration: function () {
		return courseIterationRoute();
	},
	isNew: function () {
		return newCardsetCourseIterationRoute();
	}
});
