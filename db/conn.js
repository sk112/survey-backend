
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
const Db = process.env.ATLAS_URI;

const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (errcallback, populatecallback) {
    client.connect(async function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("survey");
        console.log("Successfully connected to MongoDB."); 
        await populatecallback();
      }
      return errcallback(err);
    });
  },

  getDb: function () {
    return _db;
  },

};
