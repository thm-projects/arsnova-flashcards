import {MainNavigation} from "../../../../../api/mainNavigation";
import {Template} from "meteor/templating";
import {Session} from "meteor/session";
import {Route} from "../../../../../api/route";
import {LoginTasks} from "../../../../../api/login";
import "./useCases.html";

Session.setDefault('firedUseCaseModal', false);

/*
* ############################################################################
* mainNavigationTopItemUseCases
* ############################################################################
*/

Template.mainNavigationTopItemUseCases.events({
	'click .useCase-Navigation-Button': function () {
		MainNavigation.closeCollapse();
		$('#useCasesModal').modal('show');
	}
});

Template.mainNavigationTopItemUseCases.onRendered(function () {
	if (!Session.get('firedUseCaseModal')) {
		Session.set('firedUseCaseModal', true);
		if (Route.isFilterIndex() && LoginTasks.autoShowUseCasesForUser()) {
			$('.useCase-Navigation-Button').click();
		}
	}
});
