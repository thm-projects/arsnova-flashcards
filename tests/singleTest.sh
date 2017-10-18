#!/bin/bash

DIRECTORY=`dirname $0`
CALLED_FROM_SCRIPT=true

source $DIRECTORY/helpers/scriptSettings.sh

checkDirectory

# Show a list of a available chimp-tests and let the user choose one
TESTING=0
while [ "0" -lt "1" ]; do
    COUNTER=0

    if [ "$TESTING" -eq "0" ] ; then
        echo -e $GREEN"\nID  Chimp-Test"$NC
    fi

    for testDir in $searchDir; do
        ((COUNTER+=1))
        if [[ "$TESTING" -eq "1" && "$SELECTION" -eq "$COUNTER" ]] ; then
                # Drop and Restore the Test-Database
		        source tests/loadTestDatabase.sh
                # Run chimp
                getTestName
                echo -e $GREEN"\nRunning chimp-test: $NC$CHIMPTESTNAME..."
                source tests/helpers/chimpTest.sh
        elif [ "$TESTING" -eq "0" ] ; then
            getTestName
            if [ "$COUNTER" -lt "10" ] ; then
       		    echo -e $BLUE"$COUNTER:  $NC$CHIMPTESTNAME"
            else
          		echo -e $BLUE"$COUNTER: $NC$CHIMPTESTNAME"
            fi
        fi
    done

    echo -e $RED"\nPlease select your chimp-test: $GREEN(0 = exit | 1-99 = run test | a-Z = show list)"$NC
    read SELECTION

    if [[ "$SELECTION" != *[a-z]* ]];then
        if [ "$SELECTION" -eq "0" ] ; then
            exit 0
        else
            TESTING=1
        fi
    else
        TESTING=0
    fi
done
