import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import "./useCases.html";

Template.mainNavigationItemUseCases.helpers({
	isUseCasesModalOpen: function () {
		return Session.get('useCasesModalOpen');
	}
});
