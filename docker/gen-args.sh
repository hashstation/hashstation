#!/bin/bash

while IFS= read -r line
do
  [[ -z "$line" || "${line:0:1}" == "#" ]] && continue

  var_name=$(echo $line | cut -d '=' -f 1)
  echo "ARG $var_name"
done < args
