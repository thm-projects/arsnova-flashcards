#!/bin/bash

# Make the meteor executable available
export PATH=$HOME/.meteor:$PATH

cd $HOME/app

# Install deps if this is first time start or if package-lock has changed
if [[ ! -f $HOME/locksum/locksum ]] || [[ ! $(md5sum $HOME/app/package-lock.json) == $(cat $HOME/locksum/locksum) ]]
then
  echo "----------------"
  echo "This is the first time you starting cards or the package lock has changed."
  echo "Going to install npm dependecies..."
  echo "----------------"
  meteor npm ci
  md5sum $HOME/app/package-lock.json > $HOME/locksum/locksum
fi

/bin/echo -e \
"
\n\
\e[1;32m===================================\e[0m\n\
\n\
\n\
\e[1;33mStarting  cards...\e[0m\n\
\e[1;33mThe start may take a \e[1;36mLONG\e[1;33m time the first time,\e[0m\n\
\e[1;33mdepending on your Internet connection.\e[0m\n\
\e[1;36mPLEASE BE PATIENT...\e[0m\n\
\e[1;33mThe app is ready when the output \"Started your app\" is visible.\e[0m\n\
\n\
\n\
\e[1;32m===================================\e[0m\n\
"

MONGO_URL="mongodb://mongo/meteor" meteor --settings $1
