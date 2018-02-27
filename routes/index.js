var express = require('express');
const path = require('path');
var router = express.Router();

var moment = require('moment-timezone');
//moment().format();

/* GET home page. */
/*router.get('/', function(request, response, next) {
  var ind = moment().tz("Asia/Jakarta")
//console.log(moment.locale());         // en
//console.log(moment().format('LT'));   // 11:34 AM
  response.send(ind.format('l') +"clock"+ ind.format('HH:mm:ss'));
});*/

router.get('/upload', function(request, response, next) {
  response.sendFile(path.join( __dirname  ,'../public/upload.html'));
});


module.exports = router;