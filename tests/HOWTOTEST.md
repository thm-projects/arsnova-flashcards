# ARSNova Cards Testing guide

The tests of ARSNova Cards are divided into different test categories:

 - End-To-End-Tests (E2E-Tests) Automating a webbrowser and clicking through the web portal, thus testing all components of the system.
 - Integration-Tests (TODO: Yannik & Jan Beschreibung Adden)

## E2E-Testing
The E2E-Tests consist of Robotframework Tests which automate a webbrowser. With
the automated webbrowser the ARSNova Cards frontend is loaded. Afterwards the
tests complete different use cases through the webportal of ARSNova cards (
such as add cardset, add card, login, logout, etc.) and compare the behaviour
of the system to the expected behaviour. By doing so we are testing:
 - Frontend-GUI
 - Frontend-Business logic
 - Frontend-Backend connection
 - Backend logic
 - Database functionality

You can run the E2E-Tests either on your local machine or using [docker](https://docs.docker.com).

### E2E-Testing using docker:

*Prerequisites*:
    - Docker should be installed

1. Clone the repository
```bash
    $ git clone git@git.thm.de:arsnova/cards.git
```

2. Change into the root directory (/cards) of the project
```bash
    $ cd cards/
```

3. Run the E2E bash script:
```bash
    $ chmod +x ./run_e2e_tests.sh && ./run_e2e_tests.sh
```

4. The results will be stored in the [E2E reports directory](./tests/e2e_tests/robotframefork/reports/e2e_tests) (tests/e2e_tests/robotframefork/reports/e2e_tests).

### E2E-Testing on your local machine

#### Prerequisites
    - Git
    - NodeJS
    - npm
    - [Meteor](https://www.meteor.com/install)
    - mongo-tools: `sudo apt-get install mongo-tools`
    - python
    - Google Chrome

#### Preparations

1. Clone the repository
```bash
    $ git clone git@git.thm.de:arsnova/cards.git
```

2. Change into the root directory (/cards) of the project
```bash
    $ cd cards/
```

3. Install [Robotframefork](https://robotframework.org/)
```bash
    $ pip install -U \
        robotframework \
        robotframework-seleniumlibrary
```

4. Download the [Google Chrome Driver](https://chromedriver.chromium.org/) for your google Chrome version and **include it as executable in your $PATH**.

5. Install the npm dependencies
```bash
    $ meteor npm install
```

6. Run the server
```bash
    $ meteor --settings settings_debug.json
```


#### Running the E2E Tests

Given you have the meteor server running, you can run the E2E-Tests with the following commands.

*Note*: you can automate an GUI Browser for demonstration purposes by changing ```-v ENV_USE_GUI_BROWSER:"False"``` to ```-v ENV_USE_GUI_BROWSER:"True"```
in all of the commands.

*Note*: setting ```-v ENV_DEBUG_MODE:"True"``` will order the test suites to not close the browser
when the test fails and suspent further test execution. This can be combined with ```-v ENV_USE_GUI_BROWSER:"True"```
for faster debugging and maintainaning of the test cases.

**Run all E2E-Tests**:
```bash
    $   robot -d "tests/e2e_tests/robotframefork/reports/e2e_tests" \
        -P "tests/e2e_tests/robotframefork/lib" \
        -v ENV_USE_GUI_BROWSER:"False" \
        -v ENV_BROWSER_TIMEOUT:"30" \
        -v ENV_LOAD_TESTDB_PATH:"./tests/loadTestDatabase.sh" \
        -v ENV_DEBUG_MODE:"False" \
        -v ENV_CARDS_URL:"http://localhost:3000" \
        -i "e2e" \
        "tests/e2e_tests/robotframefork/tests"
```

**Run specific test suite**
```bash
    $   robot -d "tests/e2e_tests/robotframefork/reports/e2e_tests" \
        -P "tests/e2e_tests/robotframefork/lib" \
        -v ENV_USE_GUI_BROWSER:"False" \
        -v ENV_BROWSER_TIMEOUT:"30" \
        -v ENV_LOAD_TESTDB_PATH:"./tests/loadTestDatabase.sh" \
        -v ENV_DEBUG_MODE:"False" \
        -v ENV_CARDS_URL:"http://localhost:3000" \
        -i "SUITE_NAME" \ # Enter the test suite name here <<<<<<<
        "tests/e2e_tests/robotframefork/tests"
```

The test suite name is included in every test suite file. **Every** test suite of the
E2E-Tests does have the tag "e2e". Thus if you pass ```-i "e2e"``` every E2E-Test will be run.
Additionally every test suite (every test file) does have an individual tag. So for example
the test suite [authentication](./tests/e2e_tests/robotframefork/tests/e2e-tests/authentication/authentication_test.robot)
does include the tags:
 1. e2e (included for all e2e tests)
 2. authentication (unique for this test file)
 3. browser (included for all browserbased tests)
in the Force Tags section to the top of the file.

So if you want to run only the authentication test suite, you can change the argument
 ```-i "SUITE_NAME"``` to ```-i "authentication"``` in the command above. Likewise for every other test suite.

**Run single test case**:
Suppose you dont want to run all the E2E-Tests, nor a whole test suite, then you can run a single test case instead.
This may be useful for debugging and developing test cases. If you take a look at the [authentication test suite](./tests/e2e_tests/robotframefork/tests/e2e-tests/authentication/authentication_test.robot) and scroll down to the '\*\*\* Tests \*\*\*' section you can see the test names.

For the authentication test suite, these are:
    1. Login As THM CAS Student Test
    2. Logout As THM CAS Student Test
    3. etc.

If you want to **run a single test case**, you can use the following command:
```bash
    $   robot -d "tests/e2e_tests/robotframefork/reports/e2e_tests" \
        -P "tests/e2e_tests/robotframefork/lib" \
        -v ENV_USE_GUI_BROWSER:"False" \
        -v ENV_BROWSER_TIMEOUT:"30" \
        -v ENV_LOAD_TESTDB_PATH:"./tests/loadTestDatabase.sh" \
        -v ENV_DEBUG_MODE:"False" \
        -v ENV_CARDS_URL:"http://localhost:3000" \
        -i "e2e" \
        -t "Login As THM CAS Student Test" \
        "tests/e2e_tests/robotframefork/tests"
```
By including ```-t "Login As THM CAS Student Test"```, only the named test case will be run. All other
tests will be ignored.

# Ab hier alte README vom Projekt. Können wir am Ende noch verwerfen

1. Install the npm package dependencies inside the local repository **"flashcards folder"** `meteor npm install`
1. Install the mongodb-tools: `sudo apt-get install mongo-tools`
1. Install the latest stable release of Node.js **"10 LTS"**. You can check your current version with the command `node -v`.
1. [Install the latest OpenJDK](https://wiki.ubuntuusers.de/Java/Installation/OpenJDK/)
1. Install the latest Version of Firefox

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
Include the files in the **features_helper folder** for common functions.

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
