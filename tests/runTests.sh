#!/bin/sh

# Default path definitions
searchDir="tests/features/*"
dumpDir="tests/dump/meteor"


#colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if the script was startet from project root direcotry
function checkDirectory
{
	if [ $(basename $PWD) == "tests" ]; then
		echo -e $RED"$0 musst me called from project root!" $NC
		exit 5
	fi
}


# Exit value, set to -1 when chimp test fails
exitVal=0

checkDirectory

# step through any subdirectory of tests/features and
# - restore meteor database
# - run chimp
# - drop meteor database
for testDir in $searchDir; do
	if [ -d $testDir ]; then
		echo -e $BLUE"Entering directory $testDir" $NC
		
		# Restore the database
		echo -e $GREEN"Restoring database ..." $NC
		if ! mongorestore -h 127.0.0.1 --port 3001 -d meteor $dumpDir ; then
			echo -e $RED"mongorestore failed!" $NC
			exit 2
		fi
		
		# Run chimp
		echo -e $GREEN"Running chimp ..." $NC
		if ! chimp --ddp=http://localhost:3000 --path=$testDir ; then
			echo -e $RED"Chimp test failed!" $NC
			exitVal=1
		fi

		# drop the database
		echo -e $GREEN"Dropping database ..." $NC
		if ! echo "db.dropDatabase()" | meteor mongo --allow-superuser ; then
			echo -e $RED"error dropping meteor database" $NC
			exit 3
		fi
	fi
done

exit $exitVal