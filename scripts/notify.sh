#!/bin/sh

APP_NAME="$1"
input=$2

# Convert the string to an array
IFS=',' read -ra array <<< "$input"

# Create an empty array for the formatted objects
formatted_array=()
text=""
# Iterate over the elements of the array
for item in "${array[@]}"; do
  text+="\n$item"
done


curl --location 'URL_HOOK' \
--header 'Content-Type: application/json' \
--data '{
    "text": "'"$APP_NAME"' - Success '"$text"'"
}'

