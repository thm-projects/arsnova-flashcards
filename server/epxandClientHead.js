import {Meteor} from "meteor/meteor";
import {onPageLoad} from 'meteor/server-render';
import * as config from "../imports/config/metaTags.js";


onPageLoad((sink) => {
	let headData = config.defaultHeadData;
	if (Meteor.settings.public.dynamicSettings === "linux") {
		headData = config.linuxHeadData;
	}
	headData.forEach(function (item) {
		sink.appendToHead(item);
	});
});
