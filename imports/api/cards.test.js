import '../../imports/api/cards.js';
import {Meteor} from "meteor/meteor";
import {assert} from "chai";

if (Meteor.isServer) {
	describe('addCard', function () {
					it('can create a new card', function () {
									assert.equal(1, 1);
								});
				});
}

