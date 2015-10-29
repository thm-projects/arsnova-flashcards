Template.registerHelper("getCategories", function() {
  return Categories.find({}, {sort: {name: 1}});
});

Template.registerHelper("getCategory", function(value) {
  var id = value.toString()
  if (id.length == 1) id = "0" + id;
  return Categories.findOne(id).name;
});

Template.category.helpers ({
  getDecks: function() {
    return Cardsets.find({ category : this._id });
  }
})
