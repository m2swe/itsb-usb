# itsb-usb

## Purpose

## Dependencies

Installation of node js on CentOS 7
```javascript
sudo curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
```

Installation of libudev on CentOS 7
```javascript
sudo yum install libudev-devel
```

Installation of node modules
```javascript
npm install
```

## Run
```javascript
node index.js
```

## Parameter 'device'

```javascript
{
  locationId: <id>,
  vendorId: <vendorId>,
  productId: <productId>,
  deviceName: <deviceName>,
  manufacturer: <manufacturer>,
  serialNumber: <serialNumber>,
  deviceAddress: <deviceAddress>
}
```

## Changelog

### v0.9.0

This marks the beginning of development on version 1.0
