const mongoose = require('mongoose');
const exams = require('./exams.js');

//Exam model from exams.js
const Exam = exams.Exam;

//list of filterGroups
const filterGroups = ['level', 'assignedInstructor', 'courseTitle', 'examSoftware']


function filters (app) {
    app.route('/api/filters')
    
    .post(function (req, res) {
      //the post route should update a persistent record of which filterGroups should be included in query and GET response
      res.send("This route is not configured yet.  Filter query params are hard coded in filters route.")
      })
      
      .get(function (req, res) {
        let findExamList = Exam.find({examSemester: req.query.semester})
        .populate('courseId')
        .exec(
          function(err, doc){
            if(err){console.error(err)}
            else{
              //flatten course data forEach exam into itself and update _id to examId
              let arrFlatExams = doc.map((exam) => {
                let newExam = {...exam._doc};
                
                //change exam._id to examId
                newExam.examId = newExam._id;
                delete newExam._id;
                
                //spread newExam and courseId to flatten course
                newExam = {...newExam, ...newExam.courseId._doc}
                
                //change courseId._id to courseId
                newExam.courseId = newExam.courseId._id;
                
                delete newExam._id;
                delete newExam.__v
                
                return newExam;
              })
              //console.log(`Found flat array of exams:`);
              //console.log(arrFlatExams);

              //loop though exams to pull out a set of filters on each filterGroup
              let filters = {};
              filterGroups.forEach(filterGroup => {
                let tempFilterArr = arrFlatExams.map(exam => exam[filterGroup]);
                let tempFilterSet = new Set(tempFilterArr);
                tempFilterArr = [...tempFilterSet];
                filters[filterGroup] = tempFilterArr;
              })
              console.log(`Found filters: `)
              console.log(filters);
              res.json(filters);
            }
          })
        })
        
        .put(function(req, res){
          
          let updateObj = {};
          
          
          if(req.body.courseId){updateObj.courseId = req.body.courseId};
          if(req.body.examDate){updateObj.examDate = req.body.examDate};
          if(req.body.examName){updateObj.examName = req.body.examName};
          if(req.body.examStart){updateObj.examStart = req.body.examStart};
          if(req.body.examEnd){updateObj.examEnd = req.body.examEnd};
          if(req.body.examSoftware){updateObj.examSoftware = req.body.examSoftware};
          if(req.body.examSemester){updateObj.examSemester = req.body.examSemester};
          if(req.body.examDuration){updateObj.examDuration = req.body.examDuration};
          if(req.body.emailFaculty){updateObj.emailFaculty = req.body.emailFaculty};
          if(req.body.facultyConfirmed){updateObj.facultyConfirmed = req.body.facultyConfirmed};
          if(req.body.building){updateObj.building = req.body.building};
          if(req.body.room){updateObj.room = req.body.room};
          if(req.body.examNotes){updateObj.examNotes = req.body.examNotes};
          if(req.body.supportPerson){updateObj.supportPerson = req.body.supportPerson};
          if(req.body.approved){updateObj.approved = req.body.approved};
          
          Exam.findByIdAndUpdate(req.query.examId, updateObj,{new: true}, 
            function(err, doc){
              if(err){console.error(err)}
              else{
                //convert _id to examId
                doc._doc.examId = doc._doc._id;
                delete doc._doc._id;
  
                //send new doc
                res.json(doc);
              }
            } )
            
          })
        }
        exports.filters = filters;
        