'use strict'

var ursa = require('ursa')
var crypto = require('crypto')
var querystring = require('querystring')
var http = require('http')

var host = 'localhost'
var port = 3000
var path = '/api/Services/validate'

module.exports = main.bind(0, post.bind(0, host, port, path))

function main(validate, id, key, callback) {  
  crypto.pseudoRandomBytes(16, function(err, buffer) {
    if (err) callback(err)
    validate({ 
      i: id, 
      d: +new Date, 
      r: buffer.toString('base64')
    }, decrypt.bind(0, key, callback))
  });
}
module.exports.__main = main

function post(host, port, path, data, callback) {
  var postData = querystring.stringify(data)

  var options = {
    hostname: host,
    port: port,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  }

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    var response = ''
    res.on('data', function (chunk) {
      response += chunk
    })
    res.on('end', function (w) {
      try {
        callback(null, JSON.parse(response))
      } catch (exc) {
        callback(exc)
      }
    })
    res.on('error', callback)
  })
  req.on('error', callback)
  req.write(postData)
  req.end()
}
module.exports.__post = post

function decrypt(keyString, callback, err, data) {
  if (err) return callback(err)
  if (!data || !data.data || !data.signature) return callback('Invalid data')
  var message = new Buffer(data.data.toString(), 'ascii')
  try {
    var key = ursa.createPublicKey(keyString)
    var check = key.hashAndVerify('sha256', message, data.signature, 'base64')
    callback(null, check)
  } catch(exc) {
    callback(null, false)
  }
}
module.exports.__decrypt = decrypt