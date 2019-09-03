robot -d reports/arsNovaCards/ \
  -v ENV_USE_GUI_BROWSER:"True" \
  -v ENV_BROWSER_TIMEOUT:"30" \
  -v ENV_DUMP_TESTDB_PATH:"../../../tests/dumpTestDatabase.sh" \
  -v ENV_LOAD_TESTDB_PATH:"../../../tests/loadTestDatabase.sh" \
  -v ENV_DEBUG_MODE:"True" \
  -v ENV_CARDS_URL:"http://localhost:3000" \
  -P lib/ \
  -i cardsets \
  tests/
