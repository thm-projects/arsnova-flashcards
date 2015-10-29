Template.pool.helpers({
  getCategories: function() {
    return Categories.find({}, {
      sort: {
        name: 1
      }
    });
  }
});
