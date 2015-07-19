var crypto = require('crypto');
console.log(crypto.createHash('sha1').update("12345").digest('hex'));