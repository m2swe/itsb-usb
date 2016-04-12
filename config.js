var lang = require('./lang');
var config = {};

config.clamav = {};
config.clamav.options = '-r -i';
//config.clamav.options = '-r -i --move=/tmp/usb-infected';

config.lang = lang.sv;
config.orig_lang = lang.en;


module.exports = config;
