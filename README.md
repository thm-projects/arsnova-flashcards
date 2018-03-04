arsnova.cards
---
The [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_app) arsnova.cards offers students a modern and intuitive access to one of the most successful and evidence based learning methods, i.e., [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition).

arsnova.cards uses Meteor as application framework. Download and install [Meteor](https://www.meteor.com/) to get the app running in your local development environment.


## Initial setup
1. Install [Meteor](https://www.meteor.com/)
2. Make sure that you've added a [SSH key](https://git.thm.de/profile/keys)
3. Clone the remote repository `git clone git@git.thm.de:arsnova/flashcards.git`
4. Install the npm package dependencies inside the local repository **"flashcards folder"** `meteor npm install`
5. Set your initial admin user in `settings.json` or `settings_test.json` (cas account)

### Settings
Change `settings.json` or `settings_test.json` according to your needs

> Warning: Never publish your settings file!

## Starting the app
Use one of the following commands inside the repository (flashcards folder), to start arsnova.cards on localhost:

- For development:
  - `meteor --settings settings_test.json`

- For production:
  - `meteor --settings settings.json`

You can then access the app from your host machine by visiting http://localhost:3000.

## Loading the Test Database
1. Make sure that you've installed the [MongoDB Community Tools](https://docs.mongodb.com/manual/administration/install-community/)
2. Start the server with the development settings
2. Open a new terminal in the flashcards folder and load the Test Database with: `./tests/loadTestDatabase.sh`

## Optional features

### Authentication setup (For Google+, Facebook and Twitter logins)
1. [Create your Google+ api keys](https://console.developers.google.com/)
2. [Create your Facebook api keys](https://developers.facebook.com/)
3. [Create your Twitter api keys](https://apps.twitter.com/)


### Braintree setup (For PayPal payments)
1. [Create a Braintree sandbox account](https://www.braintreepayments.com/get-started)
2. [Login](https://sandbox.braintreegateway.com/login) to the braintree sandbox
3. Retrieve your api keys (navigate to: My User > View Authorizations)
4. Insert the keys into `settings.json`
5. Inside Braintree sandbox, navigate to Plans from left menu under `Reccuring Billing`
6. Create one plan with id "pro" and your preferred price (lowercase for Plan ID, Plan Name's should be "Pro")


### Firebase setup (For web notifications)
1. [Create a Firebase project](https://console.firebase.google.com/)
2. Get the FCM api key from Firebase project (project settings > cloud messaging > server key)
3. Insert the key into `settings.json` (`FCM_API_KEY`)

## Contribution guide
The contribution guide can be found [here](https://git.thm.de/arsnova/flashcards/blob/staging/CONTRIBUTING.md).

## Documentation
The documentation can be found [here](https://cards-staging.mni.thm.de/jsdoc/).

### UML Diagrams
- [Activity](https://git.thm.de/arsnova/flashcards/wikis/uml---activity-diagram)
- [Domain model](https://git.thm.de/arsnova/flashcards/wikis/uml---domain-model-diagram)
- [Use case](https://git.thm.de/arsnova/flashcards/wikis/uml---use-case-diagram)

## CI Pipeline
[![build status](https://git.thm.de/arsnova/flashcards/badges/staging/build.svg)](https://git.thm.de/arsnova/flashcards/commits/staging)


- [Staging](http://cards-staging.mni.thm.de)
- [Production](https://arsnova.cards)

## Credits
arsnova.cards is powered by Technische Hochschule Mittelhessen - University of Applied Sciences.
