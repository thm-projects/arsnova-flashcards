import {FilterNavigation} from "../../../api/filterNavigation";
import {Session} from "meteor/session";
import * as FilterConfig from "../../../config/filter";

Template.registerHelper('gotResetButton', function () {
	return FilterNavigation.gotResetButton(FilterNavigation.getRouteId());
});

Template.registerHelper('gotDisplayModeButton', function () {
	return FilterNavigation.gotDisplayModeButton(FilterNavigation.getRouteId());
});

Template.registerHelper('gotSortButton', function () {
	return FilterNavigation.gotSortButton(FilterNavigation.getRouteId());
});

Template.registerHelper('gotAuthorFilter', function () {
	return FilterNavigation.gotAuthorFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotCardTypeFilter', function () {
	return FilterNavigation.gotCardTypeFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotDifficultyFilter', function () {
	return FilterNavigation.gotDifficultyFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotBonusFilter', function () {
	return FilterNavigation.gotBonusFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotWordcloudFilter', function () {
	return FilterNavigation.gotWordCloudFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotLecturerAuthorizedFilter', function () {
	return FilterNavigation.gotLecturerAuthorizedFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotUseCaseFilter', function () {
	return FilterNavigation.gotUseCaseFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotKindFilter', function () {
	return FilterNavigation.gotKindFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotTranscriptLectureFilter', function () {
	return FilterNavigation.gotTranscriptLectureFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotRatingFilter', function () {
	return FilterNavigation.gotRatingFilter(FilterNavigation.getRouteId());
});

Template.registerHelper('gotStarsFilter', function () {
	return FilterNavigation.gotStarsFilter(FilterNavigation.getRouteId());
});

Template.registerHelper("gotCardsetsForFilter", function () {
	return Session.get('cardsetIndexResults') > 0;
});

Template.registerHelper("gotAllUnfilteredCardsetsVisible", function () {
	return Session.get('cardsetIndexResults') <= Session.get('maxItemsCounter') || Session.get('cardsetIndexResults') <= FilterConfig.itemStartingValue;
});

Template.registerHelper('isSelectingCardsetToLearn', function () {
	return Session.get("selectingCardsetToLearn");
});

Template.registerHelper('extendContext', function (key, value) {
	let result = _.clone(this);
	result[key] = value;
	return result;
});
