import {Route} from "../../../util/route";
import {Session} from "meteor/session";

Template.registerHelper("isMobilePreview", function () {
	return (Route.isNewCard() || Route.isEditCard()) && Session.get('mobilePreview');
});
