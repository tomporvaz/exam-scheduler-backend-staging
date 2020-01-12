'use strict';

const mongoose = require('mongoose');
const csv = require('csvtojson');
mongoose.set('useFindAndModify', false);
const loadExams = require('../test/loadExams.js');

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

  loadExams('../test/sampleExams.json')
  

  /*
  EXAM ROUTES
  */
  
  //exam schema and model
  const examSchema = new Schema({
    courseId: {type: ObjectId, required: true},
    examName: {type: String, required: true},
    examDate: {type: String},
    examStart: {type: String},
    examEnd: {type: String},
    exanSoftware: {type: String},
    examSemester: {type: String, required: true},
    examDuration: {type: Number},
    emailFaculty: {type: Boolean},
    facultyConfirmed: {type: Boolean},
    building: {type: String},
    room: {type: String},
    examNotes: {type: String},
    supportPerson: {type: String},
    approved: {type: Boolean}
  })

  const Exam = mongoose.model('Exam', examSchema);

  app.route('/api/exam')

    .post(function (req, res) {
      const newExam = new Exam({
        courseId: req.body.uniqueId,
        examName: req.body.examName,
        examDate: req.body.examDate,
        examStart: req.body.examStart,
        examEnd: req.body.examEnd,
        examSoftware: req.body.examSoftware,
        examSemester: req.body.examSemester,
        examDuration: req.body.examDuration,
        emailFaculty: req.body.emailFaculty,
        facultyConfirmed: req.body.facultyConfirmed,
        building: req.body.building,
        room: req.body.room,
        examNotes: req.body.examNotes,
        supportPerson: req.body.supportPerson,
        approved: req.body.approved
      })

      newExam.save(function (err, doc){
        if(err){console.error(err)}
        else{res.send(`Sucess, exam saved!`)}
      })
    })

    .get(function (req, res) {

    })



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
      })
      
      //return list of courses with only required fields via JSON
      
      //res.send(`Sucess, you requested courses for ${ req.query.semester}`)
    })
    
    //upload a set of courses to database
    .post(function (req, res){
      
      //save uploade file to a location
      const file = req.files.courses;
      file.mv('coursesUpload.csv', function(err) {
        if (err) {
          console.log("Save failed " + err);
        }else{
          console.log(`Success, upload saved.`)
        }
      });
      
      //convert uploaded csv to json
      csv()
      .fromFile('coursesUpload.csv')
      .then((jsonObj) => {
        saveUploadedCourses(jsonObj);
      })
      .then(() => res.send(`Completed Saves`))
      .catch(() => res.send(`Something failed`));
      
    });
    

    //TODO: Fix promise so it returns an array representing the results of the course saves.
    function saveUploadedCourses(jsonCourses){
      return new Promise ((resolve, reject) => {
        let arrayCourseUploads = [];
        for(let i = 0; i < jsonCourses.length; i++){
          const newCourse = new Course(jsonCourses[i]);
          newCourse.save()
            .then((doc) => {
              
              (arrayCourseUploads.push( `Saved ${jsonCourses[i].courseTitle} with id ${doc._id}`))
            })
          }
        
        resolve(arrayCourseUploads)
      })
      
    }
    
    
    function saveNewCourse(courseData){
      const newCourse = new Course(courseData);
      newCourse.save(function(err, doc){
        if(err){console.error(err)}
        else(console.log(`Saved ${courseData.courseTitle}`))
      })
    }
    
    
    /* 
    //for loading test data
    let sampleCourses = [
      {
        "uniqueId": 856143841,
        "semester": "9909",
        "unit": "99",
        "subject": "999",
        "course": "990",
        "section": "99",
        "index": "10000",
        "courseTitle": "BRAIN SCI FNDTS I",
        "assignedInstructor": "Smartypants, Jone",
        "day": "T",
        "startTime": "08:00",
        "endTime": "10:50",
        "building": "ABC",
        "room": "100",
        "program": "Doctoral",
        "level": "1st Year",
        "examsoft": true,
        "final": true,
        "enrollment": 87,
        "sectionNickname": "BRAIN99"
      },
      {
        "uniqueId": 856143842,
        "semester": "9909",
        "unit": "99",
        "subject": "999",
        "course": "991",
        "section": "99",
        "index": "10001",
        "courseTitle": "BRAIN SCI FNDTS II",
        "assignedInstructor": "Cranium, John",
        "day": "H",
        "startTime": "08:00",
        "endTime": "10:50",
        "building": "ABC",
        "room": "200",
        "program": "Doctoral",
        "level": "1st Year",
        "examsoft": true,
        "final": true,
        "enrollment": 55,
        "sectionNickname": "BRAIN102-99"
      },
      {
        "uniqueId": 856143843,
        "semester": "9909",
        "unit": "99",
        "subject": "999",
        "course": "992",
        "section": "99",
        "index": "10002",
        "courseTitle": "NEUROLOGY 4 BABIES",
        "assignedInstructor": "Up, Harry",
        "day": "W",
        "startTime": "14:00",
        "endTime": "16:50",
        "building": "ABC",
        "room": "205",
        "program": "Doctoral",
        "level": "2nd Year",
        "examsoft": true,
        "final": true,
        "enrollment": 99,
        "sectionNickname": "BRAIN99"
      }
    ]
    
    */
    
  }
  
  
  