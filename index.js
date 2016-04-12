var config = require('./config'),
    usbDetect = require('usb-detection'),
    winston = require('winston'),
    WatchJS = require('watchjs'),
    exec = require('child_process').exec, child;

var lang = config.lang;
var orig_lang = config.orig_lang;
var spawn = require('child_process').spawn;
var watch = WatchJS.watch;

var info = new (winston.Logger)({
  levels: {
    info: 0
  },
  transports: [
    new (winston.transports.Console)({
      name: 'info-console',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: './logs/itsb-usb-info.log',
      level: 'info'
    })
  ]
});

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'debug-file',
      filename: './logs/itsb-usb-debug.log',
      level: 'debug'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: './logs/itsb-usb-error.log',
      level: 'error'
    })
  ]
});

var usb = {
  safe_serialNumber: 'unknown',
  unsafe_serialNumber: 'unknown',
  unsafe_status: 'unknown'
};

info.info(lang.message1 || orig_lang.message1);

watch(usb, 'unsafe_serialNumber', function() {
  if(usb.unsafe_serialNumber !== 'unknown') {
    info.info(lang.message2 || orig_lang.message2);
    child = exec('bash ./scripts/copy_unsafe_data_and_perform_virus_scan.sh ' + usb.unsafe_serialNumber + ' ' + config.clamav.options, function (error, stdout, stderr) {
      if (error !== null) {
        logger.error('exec error: ' + error);
        info.info(lang.message3 || orig_lang.message3);
        spawn('rm', ['-rf', '/tmp/usb-unsecure', '/tmp/usb-secure', '/tmp/usb-infected']);
        info.info(lang.message4 || orig_lang.message4);
        usb.unsafe_status = 'unknown';
        usb.safe_serialNumber = 'unknown';
      } else {
        logger.debug(stdout);
        var result = parseInt(stdout.match(/Infected files: (\d*)/g)[0].split(':')[1]);
        if (result === 0) info.info(lang.message5 || orig_lang.message5);
        else info.info((lang.message6  || orig_lang.message6) + ' ' + result + ' ' + (lang.message7 || orig_lang.message7));
        info.info(lang.message8 || orig_lang.message8);
        usb.unsafe_status = 'done';
      }
    });
  }
});

watch(usb, ['safe_serialNumber', 'unsafe_status'], function() {
  if(usb.safe_serialNumber !== 'unknown' && usb.unsafe_status === 'done') {
    child = exec('bash ./scripts/wait_for_kingston.sh ' + usb.safe_serialNumber, function (error, stdout, stderr) {
      if (error !== null) {
        logger.error('exec error: ' + error);
        info.info(lang.message9 || orig_lang.message9);
        spawn('rm', ['-rf', '/tmp/usb-unsecure', '/tmp/usb-secure', '/tmp/usb-infected']);
        info.info(lang.message10 || orig_lang.message10);
        usb.safe_serialNumber = 'unknown';
        usb.unsafe_status = 'unknown';
      } else {
        spawn('./bin/linux64/dtvp_login',[], { stdio: 'inherit' });
        info.info(lang.message11 || orig_lang.message11);
        child = exec('bash ./scripts/copy_to_kingston.sh ' + usb.safe_serialNumber, function (error, stdout, stderr) {
          if (error !== null) {
            logger.error('exec error: ' + error);
            info.info(lang.message9 || orig_lang.message9);
            spawn('rm', ['-rf', '/tmp/usb-unsecure', '/tmp/usb-secure', '/tmp/usb-infected']);
            info.info(lang.message4 || orig_lang.message4);
            usb.safe_serialNumber = 'unknown';
            usb.unsafe_status = 'unknown';
          } else {
            info.info(lang.message12 || orig_lang.message12);
            spawn('rm', ['-rf', '/tmp/usb-unsecure', '/tmp/usb-secure', '/tmp/usb-infected']);
            info.info(lang.message1 || orig_lang.message1);
            usb.unsafe_status = 'unknown';
            usb.safe_serialNumber = 'unknown';
          }
        });
      }
    });
  }
});

usbDetect.on('add', function(device) {
  if (device.vendorId === 2385 && device.productId === 5381 && usb.safe_serialNumber === 'unknown') {
    logger.debug(lang.message13 || orig_lang.message13);
    logger.debug(device);
    usb.safe_serialNumber = device.serialNumber;
  } else if(device.serialNumber !== '' && usb.unsafe_serialNumber === 'unknown') {
    logger.debug(lang.message14 || orig_lang.message14);
    logger.debug(device);
    usb.unsafe_serialNumber = device.serialNumber;
  }
});

usbDetect.on('remove', function(device) {
  if (device.vendorId === 2385 && device.productId === 5381) {
    logger.debug(lang.message15 || orig_lang.message15);
    logger.debug(device);
    usb.safe_serialNumber = 'unknown';
  } else if(device.serialNumber === usb.unsafe_serialNumber) {
    logger.debug(lang.message16 || orig_lang.message16);
    logger.debug(device);
    usb.unsafe_serialNumber = 'unknown';
    usb.unsafe_status = 'unknown';
  }
});
