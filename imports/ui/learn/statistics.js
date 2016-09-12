//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Cardsets} from '../../api/cardsets.js';

import './statistics.html';

Meteor.subscribe("cardsets");
Meteor.subscribe("cards");
Meteor.subscribe("learned");

var cardset_id;
Template.statistics.onCreated(function () {
	cardset_id = Router.current().params._id;
});

function getFileName() {
	var fileName = "";
	var cardset = Cardsets.find({"_id": cardset_id}).fetch();
	fileName += encodeURIComponent(cardset[0].name) + " Statistics " +
		(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) + ".csv";
	return fileName;
}

Template.statistics.events({
	'click #exportCSV': function () {
		var data = "";
		var hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(data));
		hiddenElement.target = '_blank';
		hiddenElement.download = getFileName();
		document.body.appendChild(hiddenElement);
		hiddenElement.click();
	}
});
