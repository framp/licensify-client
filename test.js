var client = require('./index')
var assert = require('assert')
var http = require('http')

var encryptedRandom = 'AqmdeeCne1Maa5FaQSfCaL7KeSElugbrn5p4GbvaKdtY1TSZbikybCd+isHtjRZ6yFZ8Ln6CYJR40B0y2/cGiym3MX333CCxgCi8YkmPYQi7wDtFbrtvk1BNIEBRnjdgorBM+6y5Cx55i15iIMpY7/VVxM6sCGH7UzhRM/hCH4Hy839ZAiKM4Kh/9Ikw2mh2MEvqcSb8vStPD8gL8P3zT8nufTzRDwnjhfUVPfq+U5N6UiH4K7SWERgi7u4QthflUCPUkmNdL8OfBV0g0sWcCbOmuopvQbUvotvo764h7AXWSCFRMbifAYIICfvXakvVkFTyUeP1NwkL8x9lwFu+AA=='
var validPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA19Pfu7A1DXiZ4AX1IKOp9v9LDjByBArRBHUmlohvl8V1TYPn\n3WyZLNfAnwier7ew298it+w9bBRvRB2sfT3JRm6YOcRIyewnnCng1vnmAcyMPV6X\nYq+jRPOXSqBadWBXI2d+7HnsuPTM42o10ffMpGbuGqxnsdlgyssplxRpc4BPmt4P\nwSxtz6XVN6G902oib1mtlK5WRV2uYwr5qrOC7tWiVcuIvqXbIltoAoA7EA4vo0V2\nt7+M1ur0rzRwZZItUqWFtThiVcRGTwACdiT63l6IQa1UJ5MFajRSpWZLcZubOslh\nfiRT5HA3jVu/lQfT8w89Vj3uy62GUNO6WACI3wIDAQABAoIBAFPbxvquJG7vhRo+\nNlhQPyHxX8BLooFfkocg3bVvnaxi1Ikhz12BbKK30ef4+W9c+CL2OA8ug08TQYg9\n319qOmJbZlpLodyTHXDX9LySrIPWbkcKEdgOVmncG9SrKXqhzDm9ZNuNJCVZOKLE\nCdVjaugV9j327vNzeuBQwAArti1h3oN/m0IUrEwJd0mKBpxRtFQX1jqnpJd+UBl/\npy2p5M/bDTv/UoTC1di3IYOz2zwNzyQuzP+WosqphhGCkFSLfiWFuYNSXFFH3Cis\nlK0yBlF3/iZt5pIoJtsIgAOWQSwz9KTQuf8bOXFv4Ym2CUO2BZ2Zp2PlavepZt7F\nOqP6oAECgYEA+onJ478jaqV4kvP9pjFD6huwo9oJhf/Ch0T9aENqf2/8I4bwseHU\nb6iLkYaqRl1sBFiez8Z30hTdIboo3KwwxXGpMEJmHcAKFRfhnkiBtI9st9sv1UCs\nq0W4VXgij3eTS5jx2CLv0DDUnfpoSfoU3gKsxOvoXtxM05+3VNKiegECgYEA3Ihf\nD+v/svi8i/xehW7p+TaqJAD1aMVLnURWv/9xXP5UA+y6XJJzDWuv4sK395gU/LRF\nzkmiGxjKqPGUm0sThm5WgKCgPusZXQr06uBHofXZIHD8R3yrESm39QM38a1qBY0J\np5k+FGx/Ld2sFyqE16l0hC6wdNxFxQcL5REEQt8CgYBaeLtxBKrTbiGWX4lvJEc0\nGP+2i5v4yZ0DoAQqTH3+uv/ADJCKi9Rc5e5QhOKkOkQxZZcjzLWkJWidL05mMcAC\n7MJ97NxXTevWJiORNvmvrENEOWCSj6JKzwh7xMAmMrX8DKT4udUDxz5gNfbHEAnN\nCgY9rjrhVohfu0NG3DFUAQKBgFeqTj/CDM9UWX88P0bDpHbQ6CmPx/5yD3Dg7as9\nHA9fen5k6GBMRzgairyVsxPVfOJHt0gdtTcYT9eA0RY6bfSOgAx5zbm1M0vtQxbr\nOQ6E8F8ZCvBP+qDD+MCJGwATc4XpXuEk5aywxI2zBOngmRYx4oN5G+QYfBOqjWvt\nq8f5AoGBAMU9ORAZ8iBW+8Hy9+Pz0/CPKZTBBLVFsN+t25rNKrPwBvCLZLloYl6E\n9dby9otYh02uCQy8Q2E1kzNeOQnedqGsK0gtbcCdzGU1XrWAwuyDB+UGdBNp1ZMe\nCdS1ErhCMvuJ4cHF8Z55ijE/p/9JRL+wkyPJPbiz1WCbtOuVrUdf\n-----END RSA PRIVATE KEY-----\n'
var invalidPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpgIBAAKCAQEAxlCYn+JcCXKernXqx2em4XrHV10PvMMOci86bedzmtuRTCgH\nhQ0xq6i6QPeEkGdsIq+kSuDAKYaMLKj6JcT8KBr31hAbSjZoskrW7VoU9V5GRHsQ\nwFSwFR+/uQhgdu8Q+tyrH5mjrKz0AjEOaeqXavAaDHmmPjA8OwB+tqUA1dmn9VZq\n0edIFSpBdWEm6FnVjBiMIC7kapTggXpMl3IbzfUqcqtLKKC2tRBkgpXjeYkbVboE\nDH4A81GPjqvisj9okKRFCRiAj93Z6zcJbr8h1IIlbG1W9ckQTBPGRGBRTG+rrsvY\nRyDFO0YNaKTuIQ9n/KB+rW9BpC3l4OxvVtj23QIDAQABAoIBAQCkXoLR6fzcu8q3\n0PZCRi/0LR5x06lKi+U6UNi95RtVW+1G0NrCtZfYrmWJmV2fjoj7CtdCVJwRDvq5\nvWhvy6Av4YJPQ1RLI2ONeyg+2+4JHRVihxnwP4EeUQ1IYKALk8RgGGwhKeeWJFeu\nRVisAwtzUARXGLDoVHRndtaPrZ1OoL3QcvW3/eb+rLyQ+gMWgaafx7IWDEwh9jK7\nAwY3+J8Ba6/KX0ypJkT+dI+gonDHnO1GRyoofJ/xAW5RVLxCB8QjvjLoNULTs6KT\nVmn5hhcN3VAGxbGRHsEjSfnsWmtZ02AJ7CtMwSmKpePaLDHRQ8zbQRIqWMrynolT\nYu5+JtxBAoGBAOafUIiYoi7JsBoYbmTqgRyksWcBXLcKKpZwsBxXV2T3yESFAmEx\nTeOUXfOZfBMh6w6cVvLrOUcwG1Uy/FtTQD4g8mjObWgxVpwNnUUfESbjo9fzt/Km\naecO+6z+etXy0bmIoo6x/TNdD0LmlFQD6YE1QBVx/2V3MYVvYj1X9cJRAoGBANwj\nK/8BcB94gWasPXYuoYsEYFXiz1IEqH8Pp7edRQurKrquuSxb/JeU30Kl1ofQsD31\neDw2U6PTY7OCUl7vfUqlhh8acgk0DHqO+H6hnibPC//Zg0mTG9TVyqLx2E5TmseL\nBWSXsiSegy9OqTl/S8YVzedlAA33L5GJxINms5zNAoGBALy379HnfQfmeVnRVjz0\nfPTwfE87GSCbjCARVLvMaTKxZMtVQI5CJ2es2Hjnx1VsswoAu1ILVJLBdgxxLXqa\nFH8CvPswuOzDOwl2RpTyiDmXnFKyGHvS2+R9KUv17pS3IBHAEq3MTtNCOqPXRde+\nX80gwzEJWSIxuG9lpzFlkjERAoGBAI8Lo9kuvAcXLS7kmYOkRYCqNVdZ7NIlCMCY\nEan03hr4/OkWBGnY1EhDitgqHz9d0khQq/KkcrEv+cd51cCu6sGI0aCAdL2aPsmd\nAch3iOc6/1cfpno2x40D54r+kEpFdXxY0AZPtIirIB+rg7dDCqALJyNHtENe7mAq\nH7IrGGe5AoGBAKKCAucs8ZtSQs94ZkG7np7oYbvVtieGlXvYeqftL0bzoXn4omO/\n00tHsA6trx5nQbVJTQCG0tNHxmkwP3FOilJEjCgT50uiwcLNDOrtbQ++ITS81fT0\n5OHh4HyjhokNkEcUduKkK0VfJ1mQ7cN2Qx1lt8OWo13gLvMB84eDyjiB\n-----END RSA PRIVATE KEY-----\n'
var validPublicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAonM0U2mNx6gEBRcjVwty\nc8WqZpB81+VMArzHDHLaXIQThj/eKclcOh1W/uBvHfadZenTndsVUU1D6tfStkXZ\nr05W+BHrqlZK091bd/TI9OnspH2SWlGs7Xxn3RYJj+OB9aeBcBmYbvKPf83l/w/f\nYa6utNsNwKHsEquFpa90JujgR/8zkOrGey6TFmmS1bJ+8XR6yCiJB3i8SFS/eo31\nMNGeWsFhc8DpwhOFHNjAxNn04XhRtogUT5DHwFQffDs2sldAkryiT2gQ9p30mdEz\nJnCF3gjRMZdabGBIxD7VzVEx2pXw6/c21Lgy8hLEUd8eG391M8On7uPJ3sCAILrY\nuQIDAQAB\n-----END PUBLIC KEY-----\n'
var invalidPublicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsjPIMgZ01h71vTAPWbA9\nZ3YIOpZ9x/42qSMGb4K4M6ahC9VL28plwwMenm0zUgqeuOsG4KdWpCmV/xLb6b3w\nUG2xniQI0DIMDwGoXPSM+SN5ZDwztjsZW7efk8Ls3wxbjeUWib8jDZt3RsYWPfjI\nWpNWqhBIbtjTYuOJFHOsDorDXrpjB195I3KtYDxkWLydDBHg0WAfxFdv110aok5N\nIJ3FpwwOnwTyr1HuwZ+285Uw1NxjlC5l3P5'
var validSignature = 'Btfss/0KWANVPPVUWyD0koUI33HrhmnKJfN/6YOm0oQ4N+9ZM54KU+s4M5rnl2sZ1qCsZLT6eDd0t+KMV/POZtx5eN/Me9q9m0y1GZi7a/HYVFVFk1MQPhxjrDS6/VaxkuIscbGcIgizdrzEAAxfVSDwm2sO5XCfb+wTmuanEeXUYQ4EWnij8dclzmeViDhau5MQR0VwkDBXyoszKGzE8LHOG648qWFiQ2BhVA8R7AGc8qj5WiE9vBMBoo5i/BsWa7juhYqwGuIcXvYyCKFSt35KH+l0presEa4j8VfrHawxQvW46XJ4km/+l8Q/AXZwF7Kty2BgMRDsyutiJjG1Og=='
var invalidSignature = 'Qr7bDMPyizU3ly8CWiAXkRGetB78M3NiMR3bOSMlY1LxUx2iEB1RuYjncW4aBALW3PTDbwQ7inHrdnJmTh6qUiEHDCCGME3UvqHmT16yUdCG1d+dYXqdcmUY7PZfetOTtMJRaTXTk1a2mN6hM57zcMw9eHk0SafGE73Pu6h5/zVTCRjb+3NLp3hXM1G0Udjx/QRusO5iznwYeE92b3OkpWvQ/a8jwovtCFoo9Z4WIU5zK4qHtFUnErBXp7gMXVkOA7/ppmrOpnV4GYXCJJYxtc/D6IkMupJlhBqu1aeLK9oStBcGavpo6ecKPXytT6YY9wmXvdDr23jWQ2h6vXoAyg=='

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'})
  if (req.url.match(/invalid/)) {
    res.end('aswdefgt')
  } else {
    res.end('{ "data": ["1", 1433068286834, "PSmLsjSgPpWLEnsrp8qVvA=="], "signature": "asdfghjkl"}')
  }
})

describe('Licensify', function(){
  describe('main', function(){
    it('passes an error', function(done){
      client.__main(function(data, callback){
        callback(null, { random: encryptedRandom })
      }, function() {}, '9296c75d-d88c-4565-97b6-268d8da768b4', 
          invalidPrivateKey, 'publicKey', function(err, data){
        assert.equal(err.toString(), 'Error: error:0407A079:rsa routines:RSA_padding_check_PKCS1_OAEP:oaep decoding error')
        done()
      })
    })
    it('passes the provided id', function(done){
      client.__main(function(data, callback){
        callback(null, { random: encryptedRandom })
      }, function(data) {
        assert.equal(data.i, '9296c75d-d88c-4565-97b6-268d8da768b4')
        done()
      }, '9296c75d-d88c-4565-97b6-268d8da768b4', validPrivateKey, 'publicKey', function(){})
    })
    it('passes the current date', function(done){
      client.__main(function(data, callback){
        callback(null, { random: encryptedRandom })
      }, function(data) {
        assert.equal(+new Date-data.d<10, true)
        done()
      }, '', validPrivateKey, 'publicKey', function(){})
    })
    it('retrieve a random string from the server', function(done){
      client.__main(function(data, callback){
        callback(null, { random: encryptedRandom })
      }, function(data) {
        assert.equal(!!data.r.length, true)
        done()
      }, '', validPrivateKey, 'publicKey', function(){})
    })
  })
  describe('post', function(){
    before(function() {
      server.listen(1337)
    })
    it('passes an error if JSON returned is not valid', function(done){
      client.__post('localhost', 1337, '/invalid', {}, function(err, result){
        assert.equal(err.toString(), 'SyntaxError: Unexpected token a')
        done()
      })
    })
    it('returns the JSON object if valid', function(done){
      client.__post('localhost', 1337, '/', {}, function(err, result){
        assert.equal(result.data[0], '1')
        done()
      })
    })
    after(function() {
      server.close()
    })
  })
  describe('decrypt', function(){
    it('propagates error to the callback', function(done){
      client.__decrypt('', function(err, result){
        assert.equal(err, 'some-error')
        done()
      }, 'some-error')
    })
    it('passes an error if data is empty', function(done){
      client.__decrypt('', function(err, result){
        assert.equal(err, 'Invalid data')
        done()
      })
    })
    it('passes an error if data is not valid', function(done){
      client.__decrypt('', function(err, result){
        assert.equal(err, 'Invalid data')
        done()
      }, null, { data: { lol: 'cat' } })
    })
    it('return false if the signature doesn\'t match the message', function(done){
      client.__decrypt(validPublicKey, function(err, result){
        assert.equal(result, false)
        done()
      }, null, { 
        data: [ '1', 1433068286834, 'PSmLsjSgPpWLEnsrp8qVvA==' ],
        signature: invalidSignature
      })
    })
    it('return false if the public key is invalid', function(done){
      client.__decrypt(invalidPublicKey, function(err, result){
        assert.equal(result, false)
        done()
      }, null, { 
        data: [ '1', 1433068286834, 'PSmLsjSgPpWLEnsrp8qVvA==' ],
        signature: validSignature
      })
    })
    it('return true if the public key is valid and the signature matches the message', function(done){
      client.__decrypt(validPublicKey, function(err, result){
        assert.equal(result, true)
        done()
      }, null, { 
        data: [ '1', 1433068286834, 'PSmLsjSgPpWLEnsrp8qVvA==' ],
        signature: validSignature
      })
    })
  })
})