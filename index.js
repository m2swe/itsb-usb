var usbDetect = require('usb-detection'),
    WatchJS = require('watchjs'),
    util = require('util'),
    exec = require('child_process').exec, child;

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

var usbStatus = {
  safe_usb: 'unknown',
  unsafe_usb: 'unknown'
};

console.log('Waiting for USB devices...')

watch(usbStatus, ['safe_usb', 'unsafe_usb'], function() {
  if(usbStatus.safe_usb !== 'unknown' && usbStatus.unsafe_usb === 'safe') {
    child = exec('bash copy_data_to_safe_usb.sh', function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      console.log('Done!');
    });
  } else if(usbStatus.unsafe_usb !== 'unknown' && usbStatus.unsafe_usb !== 'safe') {
    child = exec('bash copy_unsafe_data_and_perform_virus_scan.sh', function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      } else {
        usbStatus.unsafe_usb = 'safe';
      }
    });
  }
});

usbDetect.on('add', function(device) {
  console.log(device)
  if (device.manufacturer === 'Kingston') {
    usbStatus.safe_usb = device;
  } else {
    usbStatus.unsafe_usb = device;
  }
});

usbDetect.on('remove', function(device) {
  if (device.manufacturer === 'Kingston') {
    usbStatus.safe_usb = 'unknown';
  } else {
    usbStatus.unsafe_usb = 'unknown';
  }
});
