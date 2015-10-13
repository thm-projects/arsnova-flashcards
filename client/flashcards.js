Router.route('/', function (){
  this.redirect('home');
});

Router.configure({
  layoutTemplate: 'impressum'
});

Router.route('/impressum', {
  name: 'impressum',
  layoutTemplate: 'impressum'
});

Router.configure({
  layoutTemplate: 'welcome'
});

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/home', {
  name: 'home',
  action: function(){
    if(Meteor.userId()){
      this.layout('main');
      this.render('cardsets');
    } else {
      this.layout('welcome');
    }
  }
});

Router.route('/pool', {
  name: 'pool',
  template: 'pool'
});

Router.route('/main/learned', {
  template: 'learned'
});


getUserLanguage = function () {
  return navigator.language.substr(0,2);
};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
  });
}
