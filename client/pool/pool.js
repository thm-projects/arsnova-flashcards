Template.registerHelper("getpool", function(id) {
  // German
  if (getUserLanguage() == "de"){
    return [
      {"id": "00", "name": "Agrar- und Forstwissenschaften"},
      {"id": "01", "name": "Informations- und Telekommunikationstechnik"},
      {"id": "02", "name": "Ingeniuerswissenschaften"},
      {"id": "03", "name": "Kultur- und Gesellschaftswissenschften"},
      {"id": "04", "name": "Kunst und Musik"},
      {"id": "05", "name": "Mathematik und Naturwissenschaften"},
      {"id": "06", "name": "Medien"},
      {"id": "07", "name": "Medizin und Gesundheit"},
      {"id": "08", "name": "Pädagogik und Lehre"},
      {"id": "09", "name": "Rechtswissenschaften"},
      {"id": "10", "name": "Sprach- und Literaturwissenschaften"},
      {"id": "11", "name": "Sozial- und Verhaltenswissenschaften"},
      {"id": "12", "name": "Wirtschaft und Management"}
    ]
  }
  // English
  else {
    return [
      {"id": "00", "name": "Agricultural and Forestry Sciences"},
      {"id": "01", "name": "Information and Telecommunications Technology"},
      {"id": "02", "name": "Engineering Sciences"},
      {"id": "03", "name": "Cultural and Social Sciences"},
      {"id": "04", "name": "Art and Music"},
      {"id": "05", "name": "Mathematics and Natural Sciences"},
      {"id": "06", "name": "Media"},
      {"id": "07", "name": "Medicine and Health"},
      {"id": "08", "name": "Education and Teaching"},
      {"id": "09", "name": "Jurisprudence"},
      {"id": "10", "name": "Foreign Languages and Literatures"},
      {"id": "11", "name": "Social and Behavioral Sciences"},
      {"id": "12", "name": "Economics and Management"}
    ]
  }
});
