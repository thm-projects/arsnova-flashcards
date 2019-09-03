MAX_RETRIES="30"
RETRY_INTERVAL="1"
COUNTER="1"

if [ -z "$1" ]; then
    echo "ERROR: Host variable not set! Please pass the host to ping to"
    exit -2
else
    HOSTNAME="$1"
fi

if [ -z "$2" ]; then
    echo "No timeout specified, taking ${MAX_RETRIES} seconds as default timeout"
else
    MAX_RETRIES="$2"
fi

if [ -z "$3" ]; then
    echo "No polling interval specified, taking ${RETRY_INTERVAL} seconds as default interval"
else
    RETRY_INTERVAL="$3"
fi

echo "Waiting for Host to start..."
echo "Host: $HOSTNAME"
echo "Timeout: $MAX_RETRIES"
echo "Interval: $RETRY_INTERVAL"

while [ "$COUNTER" -le "${MAX_RETRIES}" ]; do
    curl -s "$HOSTNAME" > /dev/null
    EXIT_STATUS="$?"
    if [ $EXIT_STATUS -eq 0 ]; then
        echo "Server up and running!"
        exit 0
    fi
    echo "Waiting for Host [${COUNTER}/${MAX_RETRIES}]";

    COUNTER=$(($COUNTER + 1))
    sleep "${RETRY_INTERVAL}"
done

echo "Server did not respond within ${MAX_RETRIES} seconds!"
exit -1
