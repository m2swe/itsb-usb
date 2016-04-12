#!/bin/bash
serialNumber="$1"
options="$2"

# Create temporary working directories
rm -rf /tmp/usb-unsecure /tmp/usb-secure /tmp/usb-infected
mkdir -p /tmp/usb-unsecure/media
mkdir -p /tmp/usb-unsecure/data
mkdir -p /tmp/usb-infected

# Wait for USB device to be ready
usb_path=""
counter=0
while [[ (-z "$usb_path" || "$usb_path" == *"by-id"*) && "$counter" -lt 20 ]]
do
  usb_path=$(echo | readlink -f /dev/disk/by-id/*$serialNumber*part*)
  let counter=counter+1
  sleep 1
done

# Check if USB device connected successfully
if [ "$counter" -ge 20 ]
then
  exit 1
fi

# Mount USB device, copy data and unmount USB device
sudo mount $usb_path /tmp/usb-unsecure/media
cp -r /tmp/usb-unsecure/media/*.* /tmp/usb-unsecure/data
sudo umount $usb_path

# Start virus scan (verbose)
clamscan $options /tmp/usb-unsecure/data
#clamscan -r -i --move=/tmp/usb-infected /tmp/usb-unsecure/data
