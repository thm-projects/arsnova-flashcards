#!/usr/bin/env bash

set -e
if [ -n "$DISPLAY" ] ; then
BABEL_ENV=COVERAGE COVERAGE=1 COVERAGE_OUT_LCOVONLY=1 COVERAGE_OUT_HTML=1 COVERAGE_APP_FOLDER=$PWD/tests/unitTests/ meteor test --driver-package meteortesting:mocha --once
else
BABEL_ENV=COVERAGE COVERAGE=1 COVERAGE_OUT_LCOVONLY=1 COVERAGE_OUT_HTML=1 COVERAGE_APP_FOLDER=$PWD/tests/unitTests/ node "$BUNDLE_DIR/main.js"  test --driver-package meteortesting:mocha --once
fi



cd tests/unitTests/errors/
