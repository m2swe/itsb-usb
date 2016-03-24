# itsb-usb

## Purpose

## Install

Set root permission on itsb-usb user
```javascript
sudo visudo
<user> ALL=(ALL) NOPASSWD: ALL
```

Installation of node js on CentOS 7
```javascript
sudo curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
```

Installation of libudev on CentOS 7
```javascript
sudo yum install libudev-devel
```

Installation of dependencies node modules
```javascript
From root directory of itsb-usb:
npm install
```

Installation and configuration of ClamAV on CentOS 7
```javascript
sudo yum install -y epel-release
sudo yum install -y clamav clamav-update

cp /etc/freshclam.conf /etc/freshclam.conf.bak
sed -i ‘/^Example/d’ /etc/freshclam.conf
sudo freshclam
```

## Run
```javascript
node index.js
```

## Changelog

### v0.9.0

This marks the beginning of development on version 1.0
