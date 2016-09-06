//------------------------ IMPORTS

import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {Session} from 'meteor/session';

import {Cardsets} from '../../api/cardsets.js';
import {Ratings} from '../../api/ratings.js';

import './pool.html';


Meteor.subscribe("categories");
Meteor.subscribe("cardsets");

Session.setDefault('poolSortName', {lastName: 1});
Session.setDefault('poolFilter', ["free", "edu", "pro"]);

/**
 * ############################################################################
 * category
 * ############################################################################
 */

Template.category.helpers({
	getDecks: function () {
		var id = parseInt(this._id);
		return Cardsets.find({
			category: id,
			visible: true,
			kind: {$in: Session.get('poolFilter')}
		}, {
			sort: Session.get('poolSort')
		});
	},
	getAverage: function () {
		var ratings = Ratings.find({
			cardset_id: this._id
		});
		var count = ratings.count();
		if (count !== 0) {
			var amount = 0;
			ratings.forEach(function (rate) {
				amount = amount + rate.rating;
			});
			var result = (amount / count).toFixed(2);
			return result;
		} else {
			return 0;
		}
	},
	getSortUserIcon: function () {
		var sort = Session.get('poolSort');
		if (sort.username === 1) {
			return '<i class="fa fa-sort-asc"></i>';
		} else if (sort.username === -1) {
			return '<i class="fa fa-sort-desc"></i>';
		}
	},
	getSortNameIcon: function () {
		var sort = Session.get('poolSort');
		if (sort.name === 1) {
			return '<i class="fa fa-sort-asc"></i>';
		} else if (sort.name === -1) {
			return '<i class="fa fa-sort-desc"></i>';
		}
	},
	getSortRelevanceIcon: function () {
		var sort = Session.get('poolSort');
		if (sort.relevance === 1) {
			return '<i class="fa fa-sort-asc"></i>';
		} else if (sort.relevance === -1) {
			return '<i class="fa fa-sort-desc"></i>';
		}
	},
	getKind: function () {
		switch (this.kind) {
			case "free":
				return '<span class="label label-default">Free</span>';
			case "edu":
				return '<span class="label label-success">Edu</span>';
			case "pro":
				return '<span class="label label-info">Pro</span>';
			default:
				return '<span class="label label-danger">Undefined!</span>';
		}
	},
	getAuthor: function () {
		return Meteor.users.findOne(this.owner).profile.name;
	},
	getLicense: function () {
		var licenseString = "";

		if (this.license.length > 0) {
			if (this.license.includes('by')) {
				licenseString = licenseString.concat('<img src="/img/by.large.png" alt="Namensnennung" />');
			}
			if (this.license.includes('nc')) {
				licenseString = licenseString.concat('<img src="/img/nc-eu.large.png" alt="Nicht kommerziell" />');
			}
			if (this.license.includes('nd')) {
				licenseString = licenseString.concat('<img src="/img/nd.large.png" alt="Keine Bearbeitung" />');
			}
			if (this.license.includes('sa')) {
				licenseString = licenseString.concat('<img src="/img/sa.large.png" alt="Weitergabe unter gleichen Bedingungen" />');
			}

			return new Spacebars.SafeString(licenseString);
		} else {
			return new Spacebars.SafeString('<img src="/img/zero.large.png" alt="Kein Copyright" />');
		}
	}
});

Template.category.events({
	'click #sortName': function () {
		var sort = Session.get('poolSort');
		if (sort.name === 1) {
			Session.set('poolSort', {name: -1});
		} else {
			Session.set('poolSort', {name: 1});
		}
	},
	'click #sortUser': function () {
		var sort = Session.get('poolSort');
		if (sort.username === 1) {
			Session.set('poolSort', {username: -1});
		} else {
			Session.set('poolSort', {username: 1});
		}
	},
	'click #sortRelevance': function () {
		var sort = Session.get('poolSort');
		if (sort.relevance === 1) {
			Session.set('poolSort', {relevance: -1});
		} else {
			Session.set('poolSort', {relevance: 1});
		}
	},
	'change #filterCheckbox': function () {
		var filter = [];
		$("#filterCheckbox input:checkbox:checked").each(function () {
			filter.push($(this).val());
		});
		Session.set('poolFilter', filter);
	}
});

Template.category.onDestroyed(function () {
	Session.set('poolSort', {relevance: -1});
});

/**
 * ############################################################################
 * helpers
 * ############################################################################
 */

Template.pool.helpers({
  cardsetList: function() {
    return Cardsets.find({
      owner: Meteor.userId()
    }, {
      sort: Session.get('poolSortName')
    });
  }
});

Template.pool.events({
  'click #sortLastName': function() {
    var lastNameFilter = Session.get('poolSortName');
    if(lastNameFilter.lastName === 1){
      Session.set('poolSortName', {lastName: 1});
    } else {
      Session.set('poolSortName', {lastName: -1});
    }
  },
});
