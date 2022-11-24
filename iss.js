const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  const myIP = 'https://api.ipify.org?format=json';
  request(myIP, function(error, response, body) {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body);
    return callback(null, data.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const api = 'http://ipwho.is/' + ip;
  request(api, function(error, response, body) {
    if (error) {
      return callback(error, null);
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      return callback(Error(message), null);
    }

    const latitude = parsedBody.latitude;
    const longitude = parsedBody.longitude;
    
    return callback(null, {latitude, longitude});
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};