## How to test the application with chimp and cucumber

## Install chimp
	npm install -g chimp

### Please follow the folling procedure
#### Enter the project directory
    cd flashcards
#### Run Meteor
    meteor --settings settings_test.json
#### Clear the current database
Enter mongo shell with

    meteor mongo

Then

    use meteor
    db.dropDatabase()
Exit mongo shell
#### Load the test data
    mongorestore -h 127.0.0.1 --port 3001 -d meteor tests/dump/meteor
#### Run the tests
    chimp --ddp=http://localhost:3000 --path=tests/features/yourDirectory
    you can add --browser=firefox to run the test on the firefox browser, default browser is chrome
    the ci test run uses firefox, due to chrome and phantomjs are not working in the server,
    chrome stucks and phantom has problems with script injection from chimp

#### Run all chimp tests
In project root start meteor `meteor --settings settings_test.json`.
Then in another shell enter `./tests/runTests.sh`

## Important
For the tests, please login with the user "testuser"

## Helpers
Include the **helper_functions.js** for common functions.

	import {login, logout} from "../helper_functions"

now you can use the helper functions:

	login("testuser");
	...
	logout();

## Useful links
[General info about chimp](https://chimp.readme.io/docs/introduction)
[Chimp cheat sheet](https://chimp.readme.io/docs/cheat-sheet)
[Chimp github page](https://github.com/xolvio/chimp)
[Webdriver the API](http://webdriver.io/api.html)
