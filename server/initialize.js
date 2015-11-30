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
    "name": "Kritiker",
    "desc": "Kritik ist die höchste Form der Zuneigung. Benutzer, welche sich sachlich mit den Kartensätzen anderer auseinandersetzen und konstruktives Feedback oder Lob aussprechen, werden mit diesem Badge belohnt",
    "rank1": 50,
    "rank2": 25,
    "rank3": 10,
    "unit": "Bewertungen",
    "badge": "kritiker"
  }, {
    "_id": "2",
    "name": "Liebling der Kritiker",
    "desc": "Du erhälst diesen Badge, wenn deine Kartensätze von anderen Lernenden gut bewertet werden. Als Kartensätz zählen alle deine öffentlichen Kartensätze mit mindestens 5 Bewertungen bei einer durchschnittlichen Bewertung von 4,5 Sternen.",
    "rank1": 30,
    "rank2": 15,
    "rank3": 5,
    "unit": "Kartensätze",
    "badge": "krone"
  }, {
    "_id": "3",
    "name": "Stammgast",
    "desc": "Besuche THMcards mehrere Tage am Stück und erhalte den Stammgast Badge!",
    "rank1": 32,
    "rank2": 20,
    "rank3": 3,
    "unit": "Tage",
    "badge": "stammgast"
  }, {
    "_id": "4",
    "name": "Streber",
    "desc": "Strebsamkeit wird belohnt. Lerne unterschiedliche Kartensätze um diesen Badge zu erhalten. Es steht die frei, welche Lernmethode du wählst.",
    "rank1": 30,
    "rank2": 15,
    "rank3": 5,
    "unit": "Kartensätze",
    "badge": "streber"
  }, {
    "_id": "5",
    "name": "Wohltäter",
    "desc": "Erstelle eine bestimmte Anzahl an öffentlichen Kartensätzen, die mindestens 5 Karten beinhalten.",
    "rank1": 15,
    "rank2": 10,
    "rank3": 5,
    "unit": "Kartensätze",
    "badge": "autor"
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
