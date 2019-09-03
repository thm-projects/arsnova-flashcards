CALLER_WORKDIR=${PWD##*/}
EXPECTED_CALLER_WORKDIR="cards"
echo "Basename: $CALLER_WORKDIR"

if [ "$CALLER_WORKDIR" != "$EXPECTED_CALLER_WORKDIR" ]; then
    echo "ERROR: Script should be called from the /cards root directory of the project!"
    exit -2
fi

robot -d reports/arsNovaCards/ \
  -v ENV_USE_GUI_BROWSER:"True" \
  -v ENV_BROWSER_TIMEOUT:"30" \
  -v ENV_LOAD_TESTDB_PATH:"./tests/loadTestDatabase.sh" \
  -v ENV_DEBUG_MODE:"True" \
  -v ENV_CARDS_URL:"http://localhost:3000" \
  -P lib/ \
  -i cardsets \
  tests/e2e_tests/robotframefork/tests
