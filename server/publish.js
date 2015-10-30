Meteor.publish("categories", function() {
  return Categories.find();
});

Meteor.publish("cardsets", function() {
  return Cardsets.find();
});
