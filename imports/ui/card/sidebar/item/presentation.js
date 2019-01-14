import "./presentation.html";

/*
 * ############################################################################
 * cardSidebarItemPresentation
 * ############################################################################
 */

Template.cardSidebarItemPresentation.events({
	"click .startPresentation": function () {
		Router.go('presentation', {_id: Router.current().params._id});
	}
});
