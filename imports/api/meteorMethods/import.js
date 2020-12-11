import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Cardsets } from '../subscriptions/cardsets.js';
import { Cards } from '../subscriptions/cards.js';
import { CardType } from '../../util/cardTypes';
import { ServerStyle } from '../../util/styles';
import { importCards } from '../../util/import';

Meteor.methods({
  importCardset(data) {
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else if (!data[0].name) {
      throw new Meteor.Error(TAPi18n.__('import.failure'));
    } else {
      let originalAuthorName;
      if (data[0].originalAuthor !== undefined) {
        originalAuthorName = {
          legacyName: data[0].originalAuthor,
        };
      } else {
        originalAuthorName = data[0].originalAuthorName;
      }
      if (data[0].sortType !== undefined) {
        data[0].sortType = 0;
      }
      if (data[0].gotWorkload === undefined) {
        data[0].gotWorkload = CardType.getCardTypesWithLearningModes().includes(data[0].cardType);
      }
      if (data[0].lastEditor === undefined) {
        data[0].lastEditor = '';
      }
      if (data[0].fragJetzt === undefined) {
        data[0].fragJetzt = {
          session: '',
          overrideOnlyEmptySessions: true,
        };
      }
      if (data[0].arsnovaClick === undefined) {
        data[0].arsnovaClick = {
          session: '',
          overrideOnlyEmptySessions: true,
        };
      }
      const cardset_id = Cardsets.insert({
        name: data[0].name,
        description: data[0].description,
        date: data[0].date,
        dateUpdated: data[0].dateUpdated,
        editors: [],
        owner: Meteor.userId(),
        visible: false,
        ratings: true,
        kind: 'personal',
        price: 0,
        reviewed: false,
        reviewer: 'undefined',
        request: false,
        rating: 0,
        raterCount: 0,
        quantity: data[0].quantity,
        license: [],
        userDeleted: false,
        learningActive: false,
        maxCards: 0,
        daysBeforeReset: 0,
        learningStart: 0,
        learningEnd: 0,
        registrationPeriod: 0,
        learningInterval: [],
        mailNotification: true,
        webNotification: true,
        wordcloud: false,
        shuffled: false,
        cardGroups: [''],
        cardType: data[0].cardType,
        difficulty: data[0].difficulty,
        noDifficulty: CardType.gotDifficultyLevel(data[0].cardType),
        originalAuthorName,
        sortType: data[0].sortType,
        gotWorkload: data[0].gotWorkload,
        lastEditor: data[0].lastEditor,
        useCase: {
          enabled: false,
          priority: 0,
        },
        fragJetzt: data[0].fragJetzt,
        arsnovaClick: data[0].arsnovaClick,
      }, { trimStrings: false });
      if (cardset_id) {
        data.shift();
        Meteor.call('updateCardsetCount', Meteor.userId());
        return importCards(data, Cardsets.findOne(cardset_id), 0);
      }
      return false;
    }
  },
  importCards(data, cardset_id, importType) {
    if (data[0].name) {
      data.shift();
    }
    check(cardset_id, String);
    check(importType, Number);
    const cardset = Cardsets.findOne(cardset_id);
    if (cardset.owner !== Meteor.userId() && !Roles.userIsInRole(Meteor.userId(), ['admin', 'editor'])) {
      throw new Meteor.Error('not-authorized');
    } else {
      return importCards(data, cardset, importType);
    }
  },
  deleteDemoCardsets() {
    if (Meteor.isServer) {
      const oldDemoCardsets = Cardsets.find({ kind: 'demo' }, { fields: { _id: 1 } }).fetch();
      for (let i = 0; i < oldDemoCardsets.length; i++) {
        Cards.remove({ cardset_id: oldDemoCardsets[i]._id });
      }
      Cardsets.remove({ kind: 'demo' });
    }
  },
  importDemoCardset(type) {
    if (Meteor.isServer) {
      let demoPath;
      let demoCardsetName;
      if (type === 'demo') {
        demoCardsetName = 'DemoCardset';
      } else {
        demoCardsetName = 'MakingOfCardset';
      }
      try {
        const fs = Npm.require('fs');
        const cardGroups = [];
        let totalQuantity = 0;
        if (fs.existsSync(`${process.env.PWD}/private/`)) {
          if (type === 'demo') {
            demoPath = `${process.env.PWD}/public/demo/${ServerStyle.getDemoFolder()}/${ServerStyle.getClientLanguage()}/`;
          } else {
            demoPath = `${process.env.PWD}/public/demo/makingOf/${ServerStyle.getClientLanguage()}/`;
          }
        } else if (type === 'demo') {
          demoPath = `${process.env.PWD}/programs/web.browser/app/demo/${ServerStyle.getDemoFolder()}/${ServerStyle.getClientLanguage()}/`;
        } else {
          demoPath = `${process.env.PWD}/programs/web.browser/app/demo/makingOf/${ServerStyle.getClientLanguage()}/`;
        }
        if (fs.existsSync(demoPath)) {
          const cardsetFiles = fs.readdirSync(demoPath);
          let originalAuthorName;
          for (let i = 0; i < cardsetFiles.length; i++) {
            let cardset;
            const res = fs.readFileSync(demoPath + cardsetFiles[i], 'utf8');
            if (res.charAt(0) === '[' && res.charAt(res.length - 1) === ']') {
              cardset = JSON.parse(res);
            } else {
              cardset = JSON.parse(`[${res}]`);
            }
            if (cardset[0].originalAuthor !== undefined) {
              originalAuthorName = {
                legacyName: cardset[0].originalAuthor,
              };
            } else {
              originalAuthorName = cardset[0].originalAuthorName;
            }
            if (cardset[0].lastEditor === undefined) {
              cardset[0].lastEditor = '';
            }
            if (cardset[0].fragJetzt === undefined) {
              cardset[0].fragJetzt = {
                session: '',
                overrideOnlyEmptySessions: true,
              };
            }
            if (cardset[0].arsnovaClick === undefined) {
              cardset[0].arsnovaClick = {
                session: '',
                overrideOnlyEmptySessions: true,
              };
            }
            if (cardset[0].name !== undefined) {
              totalQuantity += cardset[0].quantity;
              const cardset_id = Cardsets.insert({
                name: cardset[0].name,
                description: cardset[0].description,
                date: cardset[0].date,
                dateUpdated: cardset[0].dateUpdated,
                editors: [],
                owner: '.cards',
                visible: true,
                ratings: false,
                kind: 'demo',
                price: 0,
                reviewed: false,
                reviewer: 'undefined',
                request: false,
                rating: 0,
                raterCount: 0,
                quantity: cardset[0].quantity,
                license: [],
                userDeleted: false,
                learningActive: false,
                maxCards: 0,
                daysBeforeReset: 0,
                learningStart: 0,
                learningEnd: 0,
                registrationPeriod: 0,
                learningInterval: [],
                mailNotification: true,
                webNotification: true,
                wordcloud: false,
                shuffled: false,
                cardGroups: [''],
                cardType: cardset[0].cardType,
                difficulty: cardset[0].difficulty,
                noDifficulty: CardType.gotDifficultyLevel(cardset[0].cardType),
                originalAuthorName,
                sortType: 0,
                lastEditor: cardset[0].lastEditor,
                useCase: {
                  enabled: false,
                  priority: 0,
                },
                fragJetzt: cardset[0].fragJetzt,
                arsnovaClick: cardset[0].arsnovaClick,
              }, { trimStrings: false });
              cardGroups.push(cardset_id);
              cardset.shift();
              Meteor.call('updateLearnerCount', cardset_id);
              importCards(cardset, Cardsets.findOne(cardset_id), 0);
            }
          }
        }
        Cardsets.insert({
          name: demoCardsetName,
          description: '',
          date: new Date(),
          dateUpdated: new Date(),
          editors: [],
          owner: '.cards',
          visible: true,
          ratings: false,
          kind: 'demo',
          price: 0,
          reviewed: false,
          reviewer: 'undefined',
          request: false,
          rating: 0,
          raterCount: 0,
          quantity: totalQuantity,
          license: [],
          userDeleted: false,
          learningActive: false,
          maxCards: 0,
          daysBeforeReset: 0,
          learningStart: 0,
          learningEnd: 0,
          registrationPeriod: 0,
          learningInterval: [],
          mailNotification: true,
          webNotification: true,
          wordcloud: false,
          shuffled: true,
          cardGroups,
          cardType: 0,
          difficulty: 0,
          noDifficulty: CardType.gotDifficultyLevel(0),
          originalAuthorName: '',
          sortType: 0,
          lastEditor: '',
          useCase: {
            enabled: false,
            priority: 0,
          },
          fragJetzt: ServerStyle.getDemoFragJetzt(),
          arsnovaClick: ServerStyle.getDemoArsnovaClick(),
        }, { trimStrings: false });
      } catch (error) {
        throw new Meteor.Error(error);
      }
    }
  },
});
