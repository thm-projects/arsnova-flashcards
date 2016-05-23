import { Meteor } from 'meteor/meteor';
import { Categories } from '../../api/categories.js';
import { Badges } from '../../api/badges.js';

Meteor.startup(function() {
  var categories = [{
    "_id": "01",
    "name": "Agricultural and Forestry Sciences",
    "i18n": {
      "de": {
        "name": "Agrar- und Forstwissenschaften"
      }
    }
  }, {
    "_id": "02",
    "name": "Information and Telecommunications Technology",
    "i18n": {
      "de": {
        "name": "Informations- und Telekommunikationstechnik"
      }
    }
  }, {
    "_id": "03",
    "name": "Engineering Sciences",
    "i18n": {
      "de": {
        "name": "Ingeniuerswissenschaften"
      }
    }
  }, {
    "_id": "04",
    "name": "Cultural and Social Sciences",
    "i18n": {
      "de": {
        "name": "Kultur- und Gesellschaftswissenschften"
      }
    }
  }, {
    "_id": "05",
    "name": "Art and Music",
    "i18n": {
      "de": {
        "name": "Kunst und Musik"
      }
    }
  }, {
    "_id": "06",
    "name": "Mathematics and Natural Sciences",
    "i18n": {
      "de": {
        "name": "Mathematik und Naturwissenschaften"
      }
    }
  }, {
    "_id": "07",
    "name": "Media",
    "i18n": {
      "de": {
        "name": "Medien"
      }
    }
  }, {
    "_id": "08",
    "name": "Medicine and Health",
    "i18n": {
      "de": {
        "name": "Medizin und Gesundheit"
      }
    }
  }, {
    "_id": "09",
    "name": "Education and Teaching",
    "i18n": {
      "de": {
        "name": "Pädagogik und Lehre"
      }
    }
  }, {
    "_id": "10",
    "name": "Jurisprudence",
    "i18n": {
      "de": {
        "name": "Rechtswissenschaften"
      }
    }
  }, {
    "_id": "11",
    "name": "Foreign Languages and Literatures",
    "i18n": {
      "de": {
        "name": "Sprach- und Literaturwissenschaften"
      }
    }
  }, {
    "_id": "12",
    "name": "Social and Behavioral Sciences",
    "i18n": {
      "de": {
        "name": "Sozial- und Verhaltenswissenschaften"
      }
    }
  }, {
    "_id": "13",
    "name": "Economics and Management",
    "i18n": {
      "de": {
        "name": "Wirtschaft und Management"
      }
    }
  }];

  var badges = [{
    "_id": "1",
    "name": "Reviewer",
    "desc": "Criticism is the highest form of affection. Users will be rewarded with this badge if they deal with cardsets of others and give constructive feedback.",
    "rank1": 50,
    "rank2": 25,
    "rank3": 10,
    "unit": "ratings",
    "badge": "kritiker",
    "i18n": {
      "de": {
        "name": "Kritiker",
        "desc": "Kritik ist die höchste Form der Zuneigung. Benutzer, welche sich sachlich mit den Kartensätzen anderer auseinandersetzen und konstruktives Feedback oder Lob aussprechen, werden mit diesem Badge belohnt",
        "unit": "Bewertungen"
      }
    }
  }, {
    "_id": "2",
    "name": "Reviewer's favourite",
    "desc": "You will obtain this badge by earning good feedback of other users. It contains all your public cardsets with at least 5 reviews with an average rating of 4.5 stars.",
    "rank1": 30,
    "rank2": 15,
    "rank3": 5,
    "unit": "carddecks",
    "badge": "krone",
    "i18n": {
      "de": {
        "name": "Liebling der Kritiker",
        "desc": "Du erhältst diesen Badge, wenn deine Kartensätze von anderen Lernenden gut bewertet werden. Als Kartensatz zählen alle deine öffentlichen Kartensätze mit mindestens 5 Bewertungen bei einer durchschnittlichen Bewertung von 4,5 Sternen.",
        "unit": "Kartensätze"
      }
    }
  }, {
    "_id": "3",
    "name": "Patron",
    "desc": "Visit THMcards for several days to obtain this badge!",
    "rank1": 50,
    "rank2": 25,
    "rank3": 10,
    "unit": "days",
    "badge": "stammgast",
    "i18n": {
      "de": {
        "name": "Stammgast",
        "desc": "Besuche THMcards mehrere Tage und erhalte den Stammgast Badge!",
        "unit": "Tage"
      }
    }
  }, {
    "_id": "4",
    "name": "Nerd",
    "desc": "Ambitiousness is rewarded. Learn different cardsets to obtain this badge. It doesn't matter which learning method you use.",
    "rank1": 30,
    "rank2": 15,
    "rank3": 5,
    "unit": "cardsets",
    "badge": "streber",
    "i18n": {
      "de": {
        "name": "Streber",
        "desc": "Strebsamkeit wird belohnt. Lerne unterschiedliche Kartensätze um diesen Badge zu erhalten. Es steht dir frei, welche Lernmethode du wählst.",
        "unit": "Kartensätze"
      }
    }
  }, {
    "_id": "5",
    "name": "Benefactor",
    "desc": "Create a certain number of public cardsets that contain at least 5 cards.",
    "rank1": 15,
    "rank2": 10,
    "rank3": 5,
    "unit": "cardsets",
    "badge": "autor",
    "i18n": {
      "de": {
        "name": "Wohltäter",
        "desc": "Erstelle eine bestimmte Anzahl an öffentlichen Kartensätzen, die mindestens 5 Karten beinhalten.",
        "unit": "Kartensätze"
      }
    }
  }];


  if (Categories.find().count() === 0) {
    console.log("Initialize Categories");
    for (var category in categories) {
      console.log(categories[category]);
      Categories.insert(categories[category]);
    }
  }
  if (Badges.find().count() === 0) {
    console.log("Initialize Badges");
    for (var badge in badges) {
      console.log(badges[badge]);
      Badges.insert(badges[badge]);
    }
  }
});
