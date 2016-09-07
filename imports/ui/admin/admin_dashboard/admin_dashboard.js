//------------------------ IMPORTS

import {Meteor } from 'meteor/meteor';
import {Template } from 'meteor/templating';

import {Cardsets } from '../../../api/cardsets.js';
import {Cards } from '../../../api/cards.js';
import {allUsers } from '../../../api/allusers.js';

import './admin_dashboard.html';

/**
 * ############################################################################
 * admin_dashboard
 * ############################################################################
 */

Template.admin_dashboard.helpers({
	totalCardsets: function () {
		return Cardsets.find().count();
	},
	totalCards: function () {
		return Cards.find().count();
	},
	totalUser: function () {
		return Meteor.users.find().count();
	},
	getOnlineStatusTotal: function () {
		return Meteor.users.find({'status.online': {$ne: false} }).count();
	}
});
