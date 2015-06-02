'use strict'

var ursa = require('ursa')
var querystring = require('querystring')
var http = require('http')

var host = 'localhost'
var port = 3000
var validatePath = '/api/Services/validate'
var randomPath = '/api/Services/random'


var validate = post.bind(0, host, port, validatePath)
var random = post.bind(0, host, port, randomPath)
module.exports = main.bind(0, random, validate)

function main(random, validate, id, extraData, privateKey, publicKey, callback) {
  random({ i: id }, function(err, data) {
    if (err) return callback(err)
    try {
      var key = ursa.createPrivateKey(privateKey)
      validate({ 
        i: id, 
        d: +new Date, 
        r: key.decrypt(data.random, 'base64', 'utf8'),
        x: extraData
      }, decrypt.bind(0, publicKey, callback))
    } catch (exc) {
      callback(exc)
    }
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