ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.remove({
    service: 'twitter'
});

ServiceConfiguration.configurations.remove({
    service: 'google'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '162760697401847',
    secret: '151daa9c4bc95310e9e1fb90accd70f8'
});

ServiceConfiguration.configurations.insert({
    service: 'twitter',
    consumerKey: 'I8LcQC0NetusL9c5F3EFJUXMl',
    secret: '2z0kNAtYcSU5lQKk6FDRR60gxuFawB4TM7tWvnU7yKk6EHHpYh'
});

ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: '131328643116-j00jrgjupbbfeft1a9o0p5ling05vsus.apps.googleusercontent.com',
    secret: '2-P5Vy6VI0eOrKIlOCZZq8cR'
});
