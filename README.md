arsnova.cards
---

The [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) arsnova.cards offers students a modern and intuitive access to one of the most successful and evidence based learning methods, i.e., [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition).

## Initial setup

1. Clone this repo `git clone git@git.thm.de:arsnova/flashcards.git`

### Settings

1. For development you can use  `settings.json`
2. Change it according to your needs
3. Set your initial admin user

> Warning: Never publish your production settings file!

### Authentication setup
1. [Create your Google api keys](https://console.developers.google.com/)
2. [Create your Facebook api keys](https://developers.facebook.com/)
3. [Create your Twitter api keys](https://apps.twitter.com/)


### Braintree setup
1. [Create a Braintree sandbox account](https://www.braintreepayments.com/get-started)
2. [Login](https://sandbox.braintreegateway.com/login) to the braintree sandbox
3. Retrieve your api keys (navigate to: My User > View Authorizations)
4. Insert the keys into `settings.json`
5. Inside Braintree sandbox, navigate to Plans from left menu under `Reccuring Billing`
6. Create one plan with id "pro" and your preferred price (lowercase for Plan ID, Plan Name's should be "Pro")


### Firebase setup (web push notifications)
1. [Create a Firebase project](https://console.firebase.google.com/)
2. Get the FCM api key from Firebase project (project settings > cloud messaging > server key)
3. Insert the key into `settings.json` (_private.FCM_API_KEY_)


## Getting Started

To start arsnova.cards on localhost use `meteor --settings settings.json` inside the repository. You can then access the app from your host machine by opening http://localhost:3000.

## CI Pipeline

[![build status](https://git.thm.de/arsnova/flashcards/badges/staging/build.svg)](https://git.thm.de/arsnova/flashcards/commits/staging)


- [Staging](http://cards-staging.mni.thm.de)
- [Production](https://arsnova.cards)

## Documentation 

The documentation can be found [here](https://cards-staging.mni.thm.de/jsdoc/).

## Credits


arsnova.cards is powered by Technische Hochschule Mittelhessen - University of Applied Sciences.
