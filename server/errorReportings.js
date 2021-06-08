import {Meteor} from "meteor/meteor";
import {ErrorReporting} from "../imports/api/subscriptions/errorReporting";
import {Cardsets} from "../imports/api/subscriptions/cardsets";
import { MailNotifier } from "./sendmail.js";
import {Cards} from "../imports/api/subscriptions/cards";

function getErrorReportings() {
    if (!Meteor.isServer) {
        throw new Meteor.Error("not-authorized");
    } else {
        return ErrorReporting.find({
            status: 0
        }, { sort: { cardset_id: 1 } });
    }
}

function getCardsetById(cardset_id) {
    if (!Meteor.isServer) {
        throw new Meteor.Error("not-authorized");
    } else {
        return Cardsets.findOne({
            _id: cardset_id
        });
    }
}

function getCardById(card_id) {
    if (!Meteor.isServer) {
        throw new Meteor.Error("not-authorized");
    } else {
        return Cards.findOne({
            _id: card_id
        });
    }
}

Meteor.methods({
    prepareErrorMail: () => {
        if (Meteor.isServer) {
            const reportings = getErrorReportings();
            const map = {};
            for (const reporting of reportings) {
                const cardSet = getCardsetById(reporting.cardset_id);
                if (cardSet) {
                    if (cardSet.owner in map) {
                        map[cardSet.owner].push(cardSet);
                    } else {
                        map[cardSet.owner] = [cardSet];
                    }
                    map[cardSet.owner][map[cardSet.owner].length - 1].reporting = reporting;
                    map[cardSet.owner][map[cardSet.owner].length - 1].card = getCardById(reporting.card_id);
                }
            }
            // für jeden owner in der map
            for (const key in map) {
                if (Object.hasOwnProperty.call(map, key)) {
                    const cardSets = map[key];
                    MailNotifier.prepareErrorReportingsMail(cardSets);
                }
            }
        }
    }
});