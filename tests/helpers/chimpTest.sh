#!/bin/bash

DIRECTORY=`dirname $0`

if [ -z "$CALLED_FROM_SCRIPT" ] ; then
    source $DIRECTORY/scriptSettings.sh
    calledFromScript
fi

# confirm calling pid
if [ -z "$CALLED_FROM_SCRIPT" ] ; then
    CALLED_FROM_SCRIPT=false
    source tests/helpers/scriptSettings.sh
    echo -e $RED"Script needs to be called by another script"$NC
    exit 0
fi

if [ $DISPLAY -n ] ; then
        xvfb-run --server-args="-ac -screen 0 1920x1080x24" chimp .config/chimp.js --ddp=http://localhost:3000 --path=$testDir $1 --browser=firefox
else
     ./node_modules/.bin/chimp .config/chimp.js --ddp=http://localhost:$PORT --path=$testDir $1 --browser=firefox
fi
if [ $? -ne 0 ]; then
    failedTests=$((failedTests+1))
    failedTestsArray+=("$testDir")
    echo -e $RED"Chimp test failed!" $NC
    exitVal=1
else
    successfulTests=$((successfulTests+1))
fi