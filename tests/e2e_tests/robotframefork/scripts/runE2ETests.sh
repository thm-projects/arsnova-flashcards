robot -d reports/arsNovaCards/ \
  -v ENV_USE_GUI_BROWSER:"True" \
  -v ENV_BROWSER_TIMEOUT:"30" \
  -v ENV_CARDS_URL:"http://localhost:3000" \
  -P lib/ \
  -i e2e \
  tests/
