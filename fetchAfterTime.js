const { setTimeout } = require('timers/promises');
const checkAthletes = require('./checkAthletes');

async function fetchAfterTime(timeout) {
  await setTimeout(timeout);
  return checkAthletes();
}

module.exports = fetchAfterTime;
