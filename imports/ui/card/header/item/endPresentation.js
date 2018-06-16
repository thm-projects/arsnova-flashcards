import "./endPresentation.html";

/*
 * ############################################################################
 * cardHeaderItemEndPresentation
 * ############################################################################
 */

Template.cardHeaderItemEndPresentation.events({
	"click .endPresentation": function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
