Template.registerHelper("getCategories", function(id) {
  return Categories.find({}, {
    sort: {
      name: 1
    }
  });
});
