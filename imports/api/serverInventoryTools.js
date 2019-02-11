import {ReactiveVar} from "meteor/reactive-var";
import * as fakeInventory from "../../public/fakeStatistics/inventory";
import {Meteor} from "meteor/meteor";
import {Session} from "meteor/session";

export let ServerInventoryTools = class ServerInventoryTools {
	static getServerInventory (type) {
		let inventory = new ReactiveVar(fakeInventory);
		switch (type) {
			case "cards":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					console.log(this.splitLargeNumbers(inventory.curValue.cards));
					return this.splitLargeNumbers(inventory.curValue.cards);
				} else {
					return this.splitLargeNumbers(Counts.get('cardsCounter'));
				}
				break;
			case "cardsets":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.cardsets.total);
				} else {
					return this.splitLargeNumbers(Counts.get('cardsetsCounter'));
				}
				break;
			case "cardsetsPrivate":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.cardsets.private);
				} else {
					return this.splitLargeNumbers(Counts.get('cardsetsPrivateCounter'));
				}
				break;
			case "cardsetsFree":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.cardsets.free);
				} else {
					return this.splitLargeNumbers(Counts.get('cardsetsFreeCounter'));
				}
				break;
			case "cardsetsEdu":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.cardsets.edu);
				} else {
					return this.splitLargeNumbers(Counts.get('cardsetsEduCounter'));
				}
				break;
			case "cardsetsPro":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.cardsets.pro);
				} else {
					return this.splitLargeNumbers(Counts.get('cardsetsProCounter'));
				}
				break;
			case "repetitorium":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.repetitorium.total);
				} else {
					return this.splitLargeNumbers(Counts.get('repetitoriumCounter'));
				}
				break;
			case "repetitoriumPrivate":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.repetitorium.private);
				} else {
					return this.splitLargeNumbers(Counts.get('repetitoriumPrivateCounter'));
				}
				break;
			case "repetitoriumFree":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.repetitorium.free);
				} else {
					return this.splitLargeNumbers(Counts.get('repetitoriumFreeCounter'));
				}
				break;
			case "repetitoriumEdu":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.repetitorium.edu);
				} else {
					return this.splitLargeNumbers(Counts.get('repetitoriumEduCounter'));
				}
				break;
			case "repetitoriumPro":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.repetitorium.pro);
				} else {
					return this.splitLargeNumbers(Counts.get('repetitoriumProCounter'));
				}
				break;
			case "wordcloud":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.wordcloud.total);
				} else {
					return this.splitLargeNumbers(Counts.get('wordcloudCounter'));
				}
				break;
			case "wordcloudPrivate":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.wordcloud.private);
				} else {
					return this.splitLargeNumbers(Counts.get('wordcloudPrivateCounter'));
				}
				break;
			case "wordcloudFree":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.wordcloud.free);
				} else {
					return this.splitLargeNumbers(Counts.get('wordcloudFreeCounter'));
				}
				break;
			case "wordcloudEdu":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.wordcloud.edu);
				} else {
					return this.splitLargeNumbers(Counts.get('wordcloudEduCounter'));
				}
				break;
			case "wordcloudPro":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.wordcloud.pro);
				} else {
					return this.splitLargeNumbers(Counts.get('wordcloudProCounter'));
				}
				break;
			case "user":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.user.total);
				} else {
					return this.splitLargeNumbers(Counts.get('userCounter'));
				}
				break;
			case "userPro":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.user.pro);
				} else {
					return this.splitLargeNumbers(Counts.get('userProCounter'));
				}
				break;
			case "userOnline":
				if (Meteor.settings.public.welcome.fakeStatistics) {
					return this.splitLargeNumbers(inventory.curValue.user.online);
				} else {
					return this.splitLargeNumbers(Counts.get('userOnlineCounter'));
				}
				break;
		}
	}

	static splitLargeNumbers (number) {
		let separator;
		if (Session.get('activeLanguage') === "de") {
			separator = ".";
		} else {
			separator = ",";
		}
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	}
};
