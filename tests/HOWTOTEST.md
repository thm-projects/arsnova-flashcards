## Installing chimp and other required software

### Install NodeJS 6.XX
[https://nodejs.org/en/](https://nodejs.org/en/)

### Install MongoDB
[https://www.mongodb.com](https://www.mongodb.com)

### Install Chrome or Chromium

### Install chimp
	npm install -g chimp

### Additional steps for Windows 
- [Install git for Windows (Shell integration)] (https://git-scm.com/download/win)
- Add your MongoDB bin folder to your `PATH enviormental variable` to gain access to mongodump.exe and mongorestore.exe

## Running a test

### Enter the project directory
    cd flashcards

### Run Meteor
Start meteor (from your project root / flashcards folder):  

    meteor --settings settings_test.json

## Following commands are executed in a shell that isn't running meteor (from your project root / flashcards folder):
### Run all chimp tests
    ./tests/runTests.sh

#### Run a single chimp test
    ./tests/singleTest.sh

### Dump the Test-Database
    ./tests/dumpTestDatabase.sh

### Load the Test-Database
    ./tests/loadTestDatabase.sh

## Logins
You can use following user strings for the login:

(Backend Access)
- "adminLogin"
- "editorLogin"

(Frontend only)
- "standardLogin"
- "universityLogin"
- "lecturerLogin"
- "blockedLogin"
- "firstLogin"

## Helpers
Include the **helper_functions.js** for common functions.

    import {login, logout} from "../helper_functions"

now you can use the helper functions:

    login("LOGINSTRING");
    ...
    logout();

## Useful links
- [General info about chimp](https://chimp.readme.io/docs/introduction)
- [Chimp cheat sheet](https://chimp.readme.io/docs/cheat-sheet)
- [Chimp github page](https://github.com/xolvio/chimp)
- [Webdriver the API](http://webdriver.io/api.html)
