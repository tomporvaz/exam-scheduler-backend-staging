'use strict';

const mongoose = require('mongoose');
const csv = require('csvtojson');
mongoose.set('useFindAndModify', false);

const loadExams = require('../test/loadExams.js');
let sampleExams = require('../test/sampleExams.json');
const exams = require('./exams.js');
const filters = require('./filters.js');
const exportRoute = require('./export-exams.js');


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
  EXPORT EXAMS ROUTES
  */
  exportRoute.exportExams(app);
  
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
    building: {type: String, required: false},
    room: {type: String, required: false},
    program: {type: String, required: false},
    level: {type: String, required: false},
    examsoft: {type: String, required: false},
    final: {type: String, required: false},
    enrollment: Number,
    sectionNickname: {type: String, required: false}
  })
  
  const Course = mongoose.model('Course', courseSchema);
  
  
  app.route('/api/courses')
  
  .get(function (req, res){
    
    //retrieve list of courses from mongo based on semester query
    Course.find({semester: req.query.semester})
      .sort({'unit': 'asc', 'subject': 'asc', 'course': 'asc', 'section': 'asc'}) //sort courses before sending to frontend
      .exec(function(err, doc){
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
        let newCourse = {};
        let arrayCourseUploads = [];

        try{
        let jsonCourses = await csv().fromFile('coursesUpload.csv');
        console.log(jsonCourses);
        
        for(let i = 0; i < jsonCourses.length; i++){
          newCourse = new Course(jsonCourses[i]);

          //if course semester and index match a record already in database, then update record, otherwise, add new course
          let originalCourse = await Course.findOne({ semester: newCourse.semester, index: newCourse.index }).exec();

          if(originalCourse){
            originalCourse.overwrite({
              uniqueId: newCourse.uniqueId,
              semester: newCourse.semester,
              unit: newCourse.unit,
              subject: newCourse.subject,
              course: newCourse.course,
              section: newCourse.section,
              index: newCourse.index,
              courseTitle: newCourse.courseTitle,
              assignedInstructor: newCourse.assignedInstructor,
              day: newCourse.day,
              courseStartTime: newCourse.courseStartTime,
              courseEndTime: newCourse.courseEndTime,
              building: newCourse.buidling,
              room: newCourse.room,
              program: newCourse.program,
              level: newCourse.level,
              examsoft: newCourse.examsoft,
              final: newCourse.final,
              enrollment: newCourse.enrollment,
              sectionNickname: newCourse.sectionNickname
            })
            let updatedCourse = await originalCourse.save();
            console.log(`Update and save ${originalCourse.courseTitle}`);
            arrayCourseUploads.push( `Updated ${newCourse.semester} - 
              ${newCourse.unit}:${newCourse.subject}:${newCourse.course}:${newCourse.section} ${newCourse.courseTitle} 
              (${updatedCourse.index})`)//push to log array after update
          } else {
            let savedCourse = await newCourse.save() //save newCourse to database
            arrayCourseUploads.push( `Saved ${jsonCourses[i].courseTitle} with id ${savedCourse._id}`) //add saved course to log to return to user
          }

          
        }
      } catch (err){
        console.error(err);
          res.send(`An error occured, possibly while saving ${newCourse}..........SUCESSFULLY SAVED ${arrayCourseUploads}`)
      }
        
        res.send(`Completed Saves: ${arrayCourseUploads}`)
      }
      
      //call async function
      convertAndUploadCSV();
      
    })
  }
  
  
  