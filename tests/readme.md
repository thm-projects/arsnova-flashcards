# Getting started with chimp test
## Install chimp
	npm install -g chimp

## Start meteor
Start meteor as usual, **but with** the `settings_test.json`.  
It requires the option **"displayTestingBackdoor": true** for testing.  

	meteor --settings settings_test.json

## Usefull links
[General info about chimp](https://chimp.readme.io/docs/introduction)  
[Chimp cheat sheet](https://chimp.readme.io/docs/cheat-sheet)  
[Chimp github page](https://github.com/xolvio/chimp)  
[Webdriver the API](http://webdriver.io/api.html)  

#1 How to import testdata locally
1. Start meteor
2. mongorestore -h 127.0.0.1 --port 3001 -d meteor tests/dump/meteor
3. Login as "testuser" to be the owner of two cardsets.

