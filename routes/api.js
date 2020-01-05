'use strict';

const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  const Schema = mongoose.Schema;
  mongoose.connect(CONNECTION_STRING || 'mongodb://localhost/exercise-track' )
  //from quick start guide in mongoose docs
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, 'connection error'));
  db.once('open', function (){
    console.log("DB sucess using mongoose!")
  });
  
  //schema and model
  const courseSchema = new Schema({
    uniqueId: {type: Number, required: true},
    semester: {type: String, required: true},
    unit: {type: String, required: true},
    subject: {type: String, required: true},
    course: {type: String, required: true},
    section: {type: String, required: true},
    index: {type: String, required: true},
    courseTitle: {type: String, required: true},
    assignedInstructor: {type: String, required: false},
    day: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    building: {type: String, required: true},
    room: {type: String, required: true},
    program: {type: String, required: true},
    level: {type: String, required: true},
    examsoft: Boolean,
    final: Boolean,
    enrollment: Number,
    sectionNickname: {type: String, required: true}
  })
  
  const Course = mongoose.model('Course', courseSchema);
  
  
  app.route('/api/courses')
  
  .get(function (req, res){

    //retrieve list of courses from mongo based on semester query
    Course.find(
      {semester: "9909"},
      function(err, doc){
        if(err){console.error(err)};
        res.json(doc);
      }

    )

    //return list of courses with only required fields via JSON

    res.send(`Sucess, you requested courses for ${ req.query.semester}`)
  })
}