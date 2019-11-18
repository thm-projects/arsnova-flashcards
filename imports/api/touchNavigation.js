import ZingTouch from "zingtouch";
import {Route} from "./route";
import {Session} from "meteor/session";
import {CardNavigation} from "./cardNavigation";
import * as config from "../config/cardNavigation.js";

export let TouchNavigation = class TouchNavigation {
	static cards () {
		let element = document.getElementById('cardCarousel');
		let gesture = new ZingTouch.Swipe({});
		let region = new ZingTouch.Region(document.getElementById('cardCarousel'), false, false);
		region.bind(element, gesture, function (event) {
			if (!$('.input-search').is(":focus") && !$('#lightbox').is(":visible") && !$('.modal').is(":visible")) {
				let threshold = config.swipeThreshold / 2;
				if (event.detail.data[0].currentDirection <= (180 + threshold) && event.detail.data[0].currentDirection >= (180 - threshold)) {
					if (CardNavigation.isVisible()) {
						if ((Route.isBox() || Route.isMemo())) {
							if (Session.get('isQuestionSide')) {
								CardNavigation.skipAnswer();
							}
						} else if (!Route.isEditMode()) {
							CardNavigation.skipAnswer();
						}
					}
				} else if ((event.detail.data[0].currentDirection >= 0 && event.detail.data[0].currentDirection <= threshold) || event.detail.data[0].currentDirection >= (360 - threshold)) {
					if (CardNavigation.isVisible()) {
						if ((Route.isBox() || Route.isMemo())) {
							if (Session.get('isQuestionSide')) {
								CardNavigation.skipAnswer(false);
							}
						} else if (!Route.isEditMode()) {
							CardNavigation.skipAnswer(false);
						}
					}
				}
			}
		}, false);
	}
};
