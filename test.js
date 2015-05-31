var client = require('./index')
var assert = require('assert')
var http = require('http')

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
    it('passes the provided id', function(done){
      client.__main(function(data) {
        assert.equal(data.i, '9296c75d-d88c-4565-97b6-268d8da768b4')
        done()
      }, '9296c75d-d88c-4565-97b6-268d8da768b4', 'key', function(){})
    })
    it('passes the current date', function(done){
      client.__main(function(data) {
        assert.equal(+new Date-data.d<10, true)
        done()
      }, '', 'key', function(){})
    })
    it('generates a random string', function(done){
      client.__main(function(data) {
        assert.equal(!!data.r.length, true)
        done()
      }, '', 'key', function(){})
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