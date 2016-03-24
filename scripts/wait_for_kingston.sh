#!/bin/bash
serialNumber="$1"

# Wait for safe USB drive to be ready
counter=0
usb_path=""
while [[ -z "$usb_path" || "$usb_path" == *"by-id"* && "$counter" -lt 20 ]]
do
  usb_path=$(echo | readlink -f /dev/disk/by-id/*$serialNumber*)
  let counter=counter+1
  sleep 1
done

# Check if safe USB drive connected successfully
if [ "$counter" -ge 20 ]
then
  exit 1
fi

exit 0
