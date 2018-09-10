import "./backToCardset.html";

/*
 * ############################################################################
 * cardSidebarItemBackToCardset
 * ############################################################################
 */

Template.cardSidebarItemBackToCardset.events({
	"click .backToCardset": function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
