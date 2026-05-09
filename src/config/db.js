const mongoose = require('mongoose');
const env = require('./env');

async function initializeDatabase() {
  await mongoose.connect(env.mongodbUri);
}

module.exports = initializeDatabase;
