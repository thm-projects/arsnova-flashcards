Meteor.publish("categories", function() {
  return Categories.find();
});

Meteor.publish("cardsets", function() {
  return Cardsets.find();
});

Meteor.publish("cards", function(){
  return Cards.find();
});

Meteor.publish("learned", function(){
  return Learned.find();
});
