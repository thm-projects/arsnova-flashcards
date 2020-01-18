//------------------------ IMPORTS
import "./author.html";
import {Template} from "meteor/templating";
import {UserPermissions} from "../../../../../api/permissions";
import {Session} from "meteor/session";

/*
* ############################################################################
* cardsetInfoBoxItemAuthor
* ############################################################################
*/

Template.cardsetInfoBoxItemAuthor.helpers({
	canSeeAuthorLink: function () {
		if (UserPermissions.gotBackendAccess() && !Session.get('isStudentPreviewActive')) {
			return true;
		}
	}
});
