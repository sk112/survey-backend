const express = require("express");
const {questions, queries} = require("../vars");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const converter = require('json-2-csv');

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Parse CSV File.

router.route("/questions").get(async function (req, res) {

  const questions = await queries.getQuestions()
  let max = (questions.length);
  let result = {}

  result['id'] = uuidv4();
  result['questions'] = []

  let added = Array(max).fill(false);

  let count = 0;
  while(count < 10){
    let ind = Math.floor(Math.random() * max);
    if(added[ind] === false){
        result.questions.push(questions[ind])
        added[ind] = true;
        count++;
    }
  }
  result.total = result.questions.length;
  res.send(result);
});


// Update answers in the DB.
router.route("/submit").post(async function (req, res){

  const reqbody = req.body
  
  // Check if UId already exists 
  let uid_exists = await queries.checkUid(reqbody['u_id'])
  if(uid_exists === true){
    res.send({"error": 'uid already exists! try again!!'}).status(400)
    return;
  }
  
  // Update Uid record 
  let result = await queries.insertUid(reqbody['u_id'])
  
  // Insert Answer records
  let r2 = await queries.insertManyAnswers(reqbody['as'])

  res.send({success: true}).status(200)
})

router.route("/download").get(async (req, res) => {

  let qs ={}
 
  let questions  = await queries.getQuestions()

  questions.map(e => {
    qs[e['varname']] = e['questiontext']
  })

  console.log(qs)
  let ans = await queries.getAnswers()

  let result = []

  ans.map(e => {
    result.push({
      "Id": e['u_id'],
      "Question": qs[e['q_id']],
      "Answer": e['answer']
    })
  })

  const csv = await converter.json2csvAsync(result)

  // const csv = JSONToCSV(result)
    console.log(csv)
  res.type("text/csv").attachment("test.csv").send(csv)
})




module.exports = router;
 