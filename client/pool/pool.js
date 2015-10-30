Meteor.subscribe("categories");
Meteor.subscribe("cardsets");

Template.registerHelper("getCategories", function() {
  return Categories.find({}, {sort: {name: 1}});
});

Template.registerHelper("getCategory", function(value) {
  var id = value.toString();
  if (id.length == 1) id = "0" + id;
  return Categories.findOne(id).name;
});

Template.category.helpers ({
  getDecks: function(){
    var id = parseInt(this._id);
    return Cardsets.find({category : id});
  }
});

Template.pool.helpers ({
  getCount: function(id){
    return Cardsets.find({category : parseInt(id)}).count();
  }
});
