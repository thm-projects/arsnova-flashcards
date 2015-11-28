Meteor.publish("categories", function() {
  return Categories.find();
});

Meteor.publish("cardsets", function() {
  return Cardsets.find();
});

Meteor.publish("cards", function() {
  return Cards.find();
});

Meteor.publish("learned", function() {
  return Learned.find();
});

Meteor.publish("ratings", function(){
  return Ratings.find();
});

Meteor.publish("experience", function(){
  return Experience.find();
});

Meteor.publish('userData', function() {
   return Meteor.users.find();
});
