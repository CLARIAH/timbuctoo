#!/bin/bash

cd -P -- "$(dirname -- "$0")" #go to dir of script even if it was called as a symbolic link

cd "$(git rev-parse --show-toplevel)" #go to git root

COMMAND="server"
DEFAULT_YAML="$PWD/timbuctoo-instancev4/example_config.yaml"
YAML="$DEFAULT_YAML"
export DEFAULT_JVM_DEBUG_SUSPEND="n"
FLIGHT_CONTROL=""

OPTIND=1
while getopts ":d:pDf:c:y:hrtC" opt; do
    case "$opt" in
  C)
    CLEAN=true
    ;;
  d)
    DEBUG_PORT=${OPTARG}
    ;;
  f)
    FLIGHT_CONTROL="$OPTARG"
    ;;
  h)
    echo -e "$0: run the timbuctoo command with some easier to remember switches\n\n\
    -C    clean state (throw away database and auth files)\n\
    -d    specify debug port (default is 5005)\n\
    -D    do not expose a debugging port\n\
    -f    make flight recording\n\
    -p    pause until debugger attaches\n\
    -y    YAML config to load (defaults to $DEFAULT_YAML)" >&2
    exit 0
    ;;
  p)
    unset DEFAULT_JVM_DEBUG_SUSPEND
    ;;
  t)
    RUN_TESTS=1
    ;;
  y)
    YAML=$OPTARG
    ;;
  \?)
    echo "Invalid option: -$OPTARG use -h for an overview of valid options" >&2
    exit 1
    ;;
  :)
    if [ $OPTARG = "d" ]; then
      echo "please specify a port for the debugger (the usual port is 5005, so -d 5005)" >&2
      exit 1
    elif [ $OPTARG = "f" ]; then
      echo "please specify a file to store the flight recording (e.g. -f recording.jfr)" >&2
      exit 1
    fi
    ;;
  esac
done

bazel build //:everything
cd ./timbuctoo-instancev4

export timbuctoo_dataPath="./temp_for_debugrun"
export timbuctoo_port="8080"
export timbuctoo_adminPort="8081"

if [ "$CLEAN" = "true" ]; then
  echo "Removing database and auth dirs"
  [ -d ./temp_for_debugrun/authorizations ] && rm -r ./temp_for_debugrun/authorizations
  [ -d ./temp_for_debugrun/database ] && rm -r ./temp_for_debugrun/database
  [ -e ./temp_for_debugrun/logins.json ] && rm ./temp_for_debugrun/logins.json
  [ -e ./temp_for_debugrun/users.json ] && rm ./temp_for_debugrun/users.json
fi

[ -d ./temp_for_debugrun/authorizations ] || mkdir -p ./temp_for_debugrun/authorizations
[ -d ./temp_for_debugrun/database ] || mkdir -p ./temp_for_debugrun/database

[ -e ./temp_for_debugrun/logins.json ] || echo "[]" > ./temp_for_debugrun/logins.json
[ -e ./temp_for_debugrun/users.json ] || echo "[]" > ./temp_for_debugrun/users.json

if [ -n "$DEBUG_PORT" ]; then
  COMMAND_OPTS="--debug=$DEBUG_PORT "
fi
if [ -n "$FLIGHT_CONTROL" ]; then
	JAVA_OPTS="$JAVA_OPTS -XX:+UnlockCommercialFeatures -XX:+FlightRecorder -XX:StartFlightRecording=filename=\"$FLIGHT_CONTROL\",dumponexit=true"
fi

export JAVA_OPTS
CMD="../bazel-bin/everything $COMMAND_OPTS $COMMAND $YAML"

echo "Changed directory to: $PWD"
echo "JAVA_OPTS=\"$JAVA_OPTS\""
echo running "$CMD"
echo ""
$CMD

result="$?"
if [ "$result" = 130 ]; then
	exit 0 #ctrl-c is also a successful shutdown
else
	exit $result
fi
