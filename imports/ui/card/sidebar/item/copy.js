import "./copy.html";

/*
 * ############################################################################
 * cardSidebarItemCopy
 * ############################################################################
 */

Template.cardSidebarItemCopy.events({
	"click .copyCard": function () {
		$('#copyCard').children().addClass("pressed");
		$('#showCopyCardModal').modal('show');
	}
});
