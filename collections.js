//------------------------ ACCESS DATABASE

Cardsets = new Mongo.Collection('cardsets');
Cards = new Mongo.Collection('cards');
Learned = new Mongo.Collection('learned');
Ratings = new Mongo.Collection("ratings");
Experience = new Mongo.Collection("experience");
Badges = new TAPi18n.Collection("badges");
Categories = new TAPi18n.Collection("categories");

CardsetsIndex = new EasySearch.Index({
  collection: Cardsets,
  fields: ['name', 'description'],
  engine: new EasySearch.Minimongo({
    selector: function(searchObject, options, aggregation) {
      // Default selector
      defSelector = this.defaultConfiguration().selector(searchObject, options, aggregation);

      // Filter selector
      selector = {};
      selector.$and = [defSelector, {
        $or: [{
          owner: Meteor.userId()
        }, {
          visible: true
        }]
      }];
      return selector;
    }
  })
});

CardsetsSchema = new SimpleSchema({
  name: {
    type: String
  },
  category: {
    type: Number,
    min: 1,
    max: 13
  },
  description: {
    type: String
  },
  date: {
    type: Date
  },
  owner: {
    type: String
  },
  username: {
    type: String
  },
  visible: {
    type: Boolean
  },
  ratings: {
    type: Boolean
  }
});

CardsSchema = new SimpleSchema({
  front: {
    type: String,
    max: 700
  },
  back: {
    type: String,
    max: 700
  },
  cardset_id: {
    type: String
  }
});

Cardsets.attachSchema(CardsetsSchema);
Cards.attachSchema(CardsSchema);
