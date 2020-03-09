'use strict';

const mongoose = require('mongoose');
const csv = require('csvtojson');
mongoose.set('useFindAndModify', false);
const loadExams = require('../test/loadExams.js');
let sampleExams = require('../test/sampleExams.json');
const exams = require('./exams.js');
const filters = require('./filters.js');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = function (app) {
  const Schema = mongoose.Schema;
  mongoose.connect(CONNECTION_STRING || 'mongodb://localhost/exercise-track' )
  //from quick start guide in mongoose docs
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, 'connection error'));
  db.once('open', function (){
    console.log("DB sucess using mongoose!")
  });
  
  //LOAD EXAMS FOR TESTING
  //loadExams(sampleExams);
  
  
  /*
  EXAM ROUTES
  */
  exams.examRoutes(app);
  
  /* 
  FILTER ROUTES
  */
  filters.filters(app);
  
  /*
  COURSE ROUTES
  */
  
  //course schema and model
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
    courseStartTime: {type: String, required: true},
    courseEndTime: {type: String, required: true},
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
      {semester: "9909"}, //TODO: replace 9909 with req.query.semester
      function(err, doc){
        if(err){console.error(err)};
        res.json(doc);
      })
      
      //return list of courses with only required fields via JSON
      
      //res.send(`Sucess, you requested courses for ${ req.query.semester}`)
    })
    
    //upload a CSV set of courses to database
    .post(function (req, res){
      
      //save uploade file to a location
      const file = req.files.courses;
      file.mv('coursesUpload.csv');
      
      //convert uploaded csv to json
      async function convertAndUploadCSV() {
        let jsonCourses = await csv().fromFile('coursesUpload.csv');
        console.log(jsonCourses);
        
        let arrayCourseUploads = [];
        for(let i = 0; i < jsonCourses.length; i++){
          const newCourse = new Course(jsonCourses[i]);
          let savedCourse = await newCourse.save()
          arrayCourseUploads.push( `Saved ${jsonCourses[i].courseTitle} with id ${savedCourse._id}`)
        }
        
        res.send(`Completed Saves: ${arrayCourseUploads}`)
        //TODO: Write try catch
      }
      
      convertAndUploadCSV();
      
    })
  }
  
  
  