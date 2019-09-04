import '../../imports/api/cards.js';
import '../../imports/startup/client/routes';
import {Meteor} from "meteor/meteor";

describe('addCard', () => {
    it('can create a new card', () => {
        Meteor.call('addCard', 'id', 'subject', 'content1', 'content2', 'content3', 'content4', 'content5', 'content6', true, 1, Date.now(), 1, 1);
    });
});
