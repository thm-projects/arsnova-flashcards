#!/bin/bash


DIRECTORY=`dirname $0`
CALLED_FROM_SCRIPT=true

source $DIRECTORY/helpers/scriptSettings.sh

checkDirectory

# Exit value, set to -1 when chimp test fails
exitVal=0
successfulTests=0
failedTests=0
failedTestsArray=()

# step through any subdirectory of tests/features and
# - restore meteor database
# - run chimp
# - drop meteor database
for testDir in $searchDir; do
	if [ -d $testDir ]; then
		echo -e $BLUE"\nEntering directory $testDir" $NC

        # Drop and Restore the Test-Database
		source tests/loadTestDatabase.sh

        # Run chimp
        getTestName
        echo -e $GREEN"\nRunning chimp-test: $NC$CHIMPTESTNAME..."
        source tests/helpers/chimpTest.sh
	fi
done

echo -e $BLUE"Testing result:" $NC
echo -e $GREEN"Successfull tests: $successfulTests" $NC
echo -e $RED"Failed tests: $failedTests" $NC

for test in $failedTestsArray; do
	echo -e $RED $test $NC
done

exit $exitVal

