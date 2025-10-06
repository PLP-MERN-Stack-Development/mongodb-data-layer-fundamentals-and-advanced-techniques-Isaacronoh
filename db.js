const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Yesss Connected to MongoDB");
  }
  return client.db(dbName).collection(collectionName);
}

module.exports = { connectDB };
