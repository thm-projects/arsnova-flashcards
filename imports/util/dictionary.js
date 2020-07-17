import {Session} from "meteor/session";
import {Route} from "./route";
import {CardVisuals} from "./cardVisuals";

/*
Modes:
1 = Beolingus
2 = DeepL
*/

Session.setDefault('wordCount', 0);

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

	static getWordCount () {
		return Session.get('wordCount');
	}

	static setBlur () {
		$('.dictionaryFrame').load(function () {
			$('.dictionaryFrame').blur();
			if (Route.isEditMode() && !CardVisuals.isFullscreen()) {
				$('#contentEditor').focus();
			}
		});
	}

	static initializeQuery (card) {
		let searchText = "";
		if (card !== undefined) {
			switch (Session.get('activeCardContentId')) {
				case 1:
					if (card.front !== undefined) {
						searchText = card.front.trim();
					}
					break;
				case 2:
					if (card.back !== undefined) {
						searchText = card.back.trim();
					}
					break;
				case 3:
					if (card.hint !== undefined) {
						searchText = card.hint.trim();
					}

					break;
				case 4:
					if (card.lecture !== undefined) {
						searchText = card.lecture.trim();
					}
					break;
				case 5:
					if (card.top !== undefined) {
						searchText = card.top.trim();
					}
					break;
				case 6:
					if (card.bottom !== undefined) {
						searchText = card.bottom.trim();
					}
					break;
			}
			let rawQuery = searchText.split(/\s+/);
			Session.set('wordCount', rawQuery.length);
		} else {
			Session.set('wordCount', 0);
		}
		return searchText;
	}

	static getQuery (card, mode) {
		let searchText = this.initializeQuery(card);
		let queryStart = "&query=";
		let query = "";
		switch (mode) {
			case 1:
				if (this.getWordCount() === 1) {
					return queryStart + CardVisuals.removeMarkdeepTags(searchText);
				}
				return;
			case 2:
				queryStart = "";
				for (let i = 0; i < this.getWordCount(); i++) {
					if (i !== 0) {
						query +=  "%20";
					}
					let rawQuery = searchText.split(/\s+/);
					query += CardVisuals.removeMarkdeepTags(rawQuery[i]).trim();
				}
				return queryStart + query;
		}
	}
};
