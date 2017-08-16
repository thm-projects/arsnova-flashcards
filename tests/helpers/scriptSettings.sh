#!/bin/bash

DIRECTORY=`dirname $0`

#colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color

# Check if the script was startet from the project root direcotry
function checkDirectory
{
	if [ $(basename $PWD) == "tests" ]; then
		echo -e $RED"$0 must be called from project root!" $NC
		exit 5
	fi
}

# confirm calling pid
function calledFromScript
{
    if [ -z "$CALLED_FROM_SCRIPT" ] ; then
        echo -e  $RED"Script needs to be called by another script"$NC
        exit 0
    fi
}

function getTestName
{
   CHIMPTESTFILE="$testDir/"*".feature"
   CHIMPTESTNAME="$(grep -m '1' "" $CHIMPTESTFILE | cut -c 10- | tr -d '\n\r')"
}

checkDirectory
calledFromScript

# Default path definitions
searchDir="tests/features/*/"
restoreDir="tests/testDatabaseDump/meteor"
dumpDir="tests/testDatabaseDump/"

if [ -z "$POST" ]; then
	PORT=3000
fi
if [ -z "$MONGO_HOST" ]; then
	MONGO_HOST=localhost
	MONGO_PORT=3001
	MONGO_DB=meteor
elif [ -z "$MONGO_PORT" ]; then
	MONGO_PORT=27017
fi

