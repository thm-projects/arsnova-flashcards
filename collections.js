//------------------------ ACCESS DATABASE

Cardsets = new Mongo.Collection('cardsets');
Cards = new Mongo.Collection('cards');
Learned = new Mongo.Collection('learned');
Categories = new TAPi18n.Collection("categories");

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
