import "./backToCardset.html";

/*
 * ############################################################################
 * cardHeaderItemBackToCardset
 * ############################################################################
 */

Template.cardHeaderItemBackToCardset.events({
	"click .backToCardset": function () {
		Router.go('cardsetdetailsid', {
			_id: Router.current().params._id
		});
	}
});
