// Check if user has permission to look at a cardset
Template.registerHelper("hasPermission", function() {
  return this.owner === Meteor.userId() || this.visible === true;
});

// Returns the number of cards in a carddeck
Template.registerHelper("cardsCount", function(carddeckId) {
  return Cardsets.findOne({_id: carddeckId}).cards.length;
});
