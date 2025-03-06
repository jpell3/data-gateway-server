const crypto = require('crypto')

function generateHash(hashObj) {
  const hashString = JSON.stringify(hashObj)
  return crypto.createHash('sha1').update(hashString).digest('hex')
};

function packageData(data) {
  return {
    "data": data,
    "hash": generateHash(data)
  }
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    
  };
};

module.exports = { generateHash, packageData };