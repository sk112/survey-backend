const { Console } = require("console");
const csvparser = require("csv-parser")
const fs = require("fs");
const { connect } = require("http2");

// This will help us connect to the database
const dbo = require("./db/conn");

async function populateQuestions(){

    let collections = await queries.getCollections()

    if(collections.length === 0){
        fs.createReadStream('questions.csv')
        .pipe(csvparser())
        .on('data', (data) => {
            let connect_db = dbo.getDb()
            
            connect_db
            .collection("questions")
            .insertOne(data, function (err, res) {
                if (err) throw err;
                questions.push(data)
            });
        })
        .on('end', () => {
            console.log("Questions Loaded Successfully");
        });
    }
}

var queries = {

    getCollections: async () => {
        const db_connect = dbo.getDb();
        const response = await db_connect
                                .listCollections({name: 'questions'})
                                .toArray()
        
        return response;
    },
    getQuestions : async () => {
        const db_connect = dbo.getDb();
        const response = await db_connect
                                .collection("questions")
                                .find({})
                                .toArray()
        
        return response;
    },
    getAnswers : async () => {
        const db_connect = dbo.getDb();
        const response = await db_connect
                                .collection("answers")
                                .find({})
                                .toArray();

        return response
    },
    checkUid :async (u_id) => {
        console.log(u_id)
        const db_connect = dbo.getDb();
        await db_connect
                .collection("uids")
                .findOne({u_id: u_id}, function (err, result) {
                    if(err){
                        console.log(err)
                    }
                    console.log('checkUid: ', result)
                    if(result === null)return false;
                    return true;
                })
    },
    insertUid: async (u_id) => {

        const db_connect = dbo.getDb();
        await db_connect
        .collection("uids")
        .insert({"u_id": u_id}, function(err, result){
            if(err)console.log(err)
            console.log('insertUid: ', result)
            return result
        })
    },
    insertManyAnswers: async (records) => {
        const db_connect = dbo.getDb();
        await db_connect
        .collection("answers")
        .insertMany(records, function(err){console.log(err)})
    }
}

module.exports = {populateQuestions, queries}