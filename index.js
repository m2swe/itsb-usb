var usbDetect = require('usb-detection'),
    winston = require('winston'),
    WatchJS = require('watchjs'),
    exec = require('child_process').exec, child;

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
    }),execution
    new (winston.transports.File)({
      name: 'error-file',
      filename: './logs/itsb-usb-error.log',
      level: 'error'
    })
  ]
});

var usb = {
  safe_serialNumber: 'unknown',
  safe_status: 'unknown',
  unsafe_serialNumber: 'unknown',
  unsafe_status: 'unknown'
};

info.info('Waiting for USB devices...');

watch(usb, 'unsafe_serialNumber', function() {
  if(usb.unsafe_serialNumber !== 'unknown') {
    info.info('Copy data from unsafe USB device to local disk and perform a virus scan');
    child = exec('bash ./scripts/copy_unsafe_data_and_perform_virus_scan.sh ' + usb.unsafe_serialNumber, function (error, stdout, stderr) {
      if (error !== null) {
        logger.error('exec error: ' + error);
        info.info('Operation failed, please remove USB device');
        info.info('Cleanup system after failure');
        child = exec('bash ./scripts/cleanup_unsafe_data.sh', function (error, stdout, stderr) {
          if (error !== null) {
            logger.error('exec error: ' + error);
          }
          info.info('Waiting for USB devices...')
          usb.unsafe_status = 'unknown';
        });
      } else {
        logger.debug(stdout);
        info.info('Data is copied and washed and ready to be transfered to safe USB device')
        usb.unsafe_status = 'done';
      }
    });
  }
});

watch(usb, ['safe_serialNumber', 'unsafe_status'], function() {
  if(usb.safe_serialNumber !== 'unknown' && usb.unsafe_status === 'done') {
    info.info('Copy washed data to safe USB device');
    child = exec('bash ./scripts/copy_data_to_safe_usb.sh ' + usb.safe_serialNumber, function (error, stdout, stderr) {
      if (error !== null) {
        logger.error('exec error: ' + error);
        info.info('Operation failed, please remove all USB devices');
        info.info('Cleanup system after failure');
        child = exec('bash ./scripts/cleanup_unsafe_data.sh', function (error, stdout, stderr) {
          if (error !== null) {
            logger.error('exec error: ' + error);
          }
          info.info('Waiting for USB devices...')
          usb.safe_serialNumber = 'unknown';
          usb.unsafe_status = 'unknown';
        });
      } else {
        info.info('Data is copied and ready to be used')
        usb.unsafe_status = 'done';

        info.info('Cleanup system after successfully execution');
        child = exec('bash ./scripts/cleanup_unsafe_data.sh', function (error, stdout, stderr) {
          if (error !== null) {
            logger.error('exec error: ' + error);
          }
          info.info('Done')
          usb.unsafe_status = 'done';
        });
      }
    });
  }
});

usbDetect.on('add', function(device) {
  if (device.vendorId === 2385 && device.productId === 5381 && usb.safe_serialNumber === 'unknown') {
    logger.debug('Added safe USB device');
    logger.debug(device);
    usb.safe_serialNumber = device.serialNumber;
  } else if(device.serialNumber !== '' && usb.unsafe_serialNumber === 'unknown') {
    logger.debug('Added unsafe USB device');
    logger.debug(device);
    usb.unsafe_serialNumber = device.serialNumber;
  }
});

usbDetect.on('remove', function(device) {
  if (device.vendorId === 2385 && device.productId === 5381) {
    logger.debug('Removed safe USB device');
    logger.debug(device);
    usb.safe_serialNumber = 'unknown';
  } else if(device.serialNumber === usb.unsafe_serialNumber) {
    logger.debug('Removed unsafe USB device');
    logger.debug(device);
    usb.unsafe_serialNumber = 'unknown';
    usb.unsafe_status = 'unknown';
  }
});
