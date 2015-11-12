Template.box.helpers({
  inBox: function() {
    // body...
  },
  isFinish: function() {
    // body...
  }
});

Template.boxSide.helpers({
  getDate: function() {
    return moment(this.date).locale(getUserLanguage()).format('LL');
  }
});
