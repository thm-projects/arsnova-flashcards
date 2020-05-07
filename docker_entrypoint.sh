#!/bin/bash

export PATH=$HOME/.meteor:$PATH

cd app

mkdir -p /home/node/mongo /home/node/app/.meteor/local
rm -rf /home/node/app/.meteor/local/db
ln -fs /home/node/mongo /home/node/app/.meteor/local/db

meteor npm install
meteor --settings $1
