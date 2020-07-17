import {Cardsets} from "../api/subscriptions/cardsets";
import {Cards} from "../api/subscriptions/cards";

export let disableAnswersOption = {fields: {answers: 0}};

export function getPreviewCards(cardset_id) {
	let cardset = Cardsets.findOne({_id: cardset_id}, {fields: {_id: 1, owner: 1, cardGroups: 1, kind: 1}});
	let filterQuery = {
		$or: [
			{cardset_id: cardset._id},
			{cardset_id: {$in: cardset.cardGroups}}
		]
	};
	let count = Cards.find(filterQuery).count();
	let cardIdArray = Cards.find(filterQuery, {_id: 1}).map(function (card) {
		return card._id;
	});
	let limit;

	if (count < 10) {
		limit = 2;
	} else {
		limit = 5;
	}

	let j, x, i;
	for (i = cardIdArray.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = cardIdArray[i];
		cardIdArray[i] = cardIdArray[j];
		cardIdArray[j] = x;
	}
	while (cardIdArray.length > limit) {
		cardIdArray.pop();
	}
	return Cards.find({_id: {$in: cardIdArray}, disableAnswersOption});
}
