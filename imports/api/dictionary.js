import {Session} from "meteor/session";
import {CardVisuals} from "./cardVisuals";

/*
Modes:
1 = Beolingus
2 = Linguee
3 = Google
4 = DeepL
*/
export let Dictionary = class Dictionary {

	static setMode (mode) {
		if (Session.get('dictionaryMode') === mode) {
			Session.set('dictionaryMode', 0);
		} else {
			Session.set('dictionaryMode', mode);
		}
		$('#contentEditor').focus();
	}

	static checkMode (mode) {
		return Session.get('dictionaryMode') === mode;
	}

	static getQuery (card, mode) {
		let searchText;
		switch (Session.get('activeCardContentId')) {
			case 1:
				searchText = card.front.trim();
				break;
			case 2:
				searchText = card.back.trim();
				break;
			case 3:
				searchText = card.hint.trim();
				break;
			case 4:
				searchText = card.lecture.trim();
				break;
			case 5:
				searchText = card.top.trim();
				break;
			case 6:
				searchText = card.bottom.trim();
				break;
		}
		let rawQuery = searchText.split(/\s+/);
		let wordCount = rawQuery.length;
		let queryStart = "&query=";
		let query = "";
		switch (mode) {
			case 1:
			case 2:
				if (wordCount === 1) {
					return queryStart + CardVisuals.removeMarkdeepTags(searchText);
				}
				return;
			case 3:
			case 4:
				queryStart = "";
				for (let i = 0; i < wordCount; i++) {
					if (i !== 0) {
						query +=  "%20";
					}
					query += CardVisuals.removeMarkdeepTags(rawQuery[i]).trim();
				}
				return queryStart + query;
		}
	}
};
