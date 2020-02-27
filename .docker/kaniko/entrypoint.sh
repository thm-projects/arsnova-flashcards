#!/bin/sh

export NODE_ENV=production
export PORT=3000
export METEOR_SETTINGS="`cat settings.json`"

node /usr/app/bundle/main.js
