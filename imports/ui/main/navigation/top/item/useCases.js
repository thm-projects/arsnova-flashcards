import {MainNavigation} from "../../../../../util/mainNavigation";
import {Template} from "meteor/templating";
import "./useCases.html";

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
