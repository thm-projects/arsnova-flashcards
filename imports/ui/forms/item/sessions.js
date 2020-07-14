import "./sessions.html";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";


Template.cardsetFormItemSessions.helpers({
	isShuffledCardset: function () {
		return Session.get('useRepForm');
	}
});
