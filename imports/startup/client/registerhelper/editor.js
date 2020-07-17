import {Route} from "../../../api/route";
import {Session} from "meteor/session";

Template.registerHelper("isMobilePreview", function () {
	return (Route.isNewCard() || Route.isEditCard()) && Session.get('mobilePreview');
});
