const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const vars  = require('./vars');

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5003;
app.use(cors());
app.use(express.json());
app.use(require("./routes/questions"));
app.use(bodyParser.json());
// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  }, vars.populateQuestions);

  console.log(`Server is running on port: ${port}`);
});
