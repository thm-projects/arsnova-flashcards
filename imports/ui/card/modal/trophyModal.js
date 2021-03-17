import "./trophyModal.html";
import {Template} from "meteor/templating";

Template.learnAlgorithmsTrophyModal.events({
	"click .buttonNextTrophy": function () {
		$('#trophyModal').modal('hide').addClass('hidden');
	}
});

Template.learnAlgorithmsTrophyModal.onDestroyed(function () {
	$('#trophyModal').modal('hide').addClass("hidden");
});

Template.learnAlgorithmsTrophyModalLight.events({
	"click .buttonNextTrophy": function () {
		$('#trophyModalLight').modal('hide').addClass('hidden');
	}
});

Template.learnAlgorithmsTrophyModalLight.onDestroyed(function () {
	$('#trophyModalLight').modal('hide').addClass("hidden");
});
