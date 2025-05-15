//  Farrel OPCUA Data Gateway Server
//  Farrel Corporation © 2025
//  Author: JPelletier

import crypto from 'crypto'

/* -------------------------------------------------------------------------- */

/**
 * Generates a SHA-1 hash from a JSON object.
 *
 * @param {Object} hashObj - The object to hash.
 * @returns {string} - The resulting SHA-1 hash in hexadecimal format.
 */
function generateHash(hashObj) {
  const hashString = JSON.stringify(hashObj);
  return crypto.createHash('sha1').update(hashString).digest('hex');
}

/* -------------------------------------------------------------------------- */

/**
 * Packages data with a generated SHA-1 hash.
 *
 * @param {any} data - The data to package.
 * @returns {{ data: any, hash: string }} - An object containing the data and its hash.
 */
function packageData(data) {
  return {
    data,
    hash: generateHash(data)
  };
}

/* -------------------------------------------------------------------------- */

/**
 * Fetches JSON data from a given URL.
 *
 * @param {string} url - The endpoint to fetch data from.
 * @returns {Promise<any|null>} - The parsed JSON data, or null on error.
 */
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */

/**
 * Generates a random number between a preset minimum and maximum value.
 *
 * @param {number} min - The minimum acceptable value.
 * @param {number} max - The maximum acceptable value.
 * @returns {number} - A random number between the min and max.
 */
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

/* -------------------------------------------------------------------------- */

/**
 * Generates temporary data for the PROCSS object.
 *
 * @param {object} dataObj - An object instance of PROCESS.
 */
function generateTempProcessData(dataObj) {
      dataObj.data.mixer.drive.setpoint = getRandomNumber(0, 650)
      dataObj.data.mixer.drive.speed = getRandomNumber(0, 650)
      dataObj.data.mixer.drive.torque = getRandomNumber(0, 125)
      dataObj.data.mixer.drive.current = getRandomNumber(0, 300)
      dataObj.data.mixer.drive.specificEnergy = getRandomNumber(0, 0.4)
      dataObj.data.mixer.drive.power = getRandomNumber(0, 185)
      dataObj.data.extruder.drive.setpoint = getRandomNumber(0, 95)
      dataObj.data.extruder.drive.speed = getRandomNumber(0, 95)
      dataObj.data.extruder.drive.torque = getRandomNumber(0, 125)
      dataObj.data.extruder.drive.current = getRandomNumber(0, 150)
      dataObj.data.extruder.drive.specificEnergy = getRandomNumber(0, 0.2)
      dataObj.data.extruder.drive.power = getRandomNumber(0, 75)
}

export { generateHash, packageData, fetchData, getRandomNumber, generateTempProcessData};