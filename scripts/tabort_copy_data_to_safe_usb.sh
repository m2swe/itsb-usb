#!/bin/bash
serialNumber="$1"
rm -rf /tmp/usb-secure/media
mkdir -p /tmp/usb-secure/media

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

# Open secure USB device
./bin/linux64/dtvp_login

# Wait for safe USB device to be ready
counter=0
usb_path=""
while [[ -z "$usb_path" || "$usb_path" == *"by-id"* && "$counter" -lt 20 ]]
do
  usb_path=$(echo | readlink -f /dev/disk/by-id/*$serialNumber*part*)
  let counter=counter+1
  sleep 1
done

# Check if safe USB device connected successfully
if [ "$counter" -ge 20 ]
then
  exit 1
fi

sudo mount $usb_path /tmp/usb-secure/media
cp -r /tmp/usb-unsecure/data/*.* /tmp/usb-secure/media
#sudo umount $usb_path

# Close secure USB device
#./bin/linux64/dtvp_logout
