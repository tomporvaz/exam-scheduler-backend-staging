const mongoose = require('mongoose');
const { Exam, arrFlattenExam } = require('./exams');
const moment = require('moment');


function exportExams(app){
  app.get('/api/export-exams', function(req, res){
    Exam.find({examSemester: req.query.semester})
    .populate('courseId')
    .sort({'examStart': 'ascending'})
    .exec(
      function(err, doc){
        if(err){console.error(err)}
        else{
          let flattenedExams = doc.map(exam => arrFlattenExam(exam));
          let examsWithReadableTimes = flattenedExams.map(exam => {
            let newExam = {...exam};
            newExam.examStart = moment(exam.examStart).format("MMMM Do YYYY, h:mm:ss a");
            newExam.examEnd = moment(exam.examEnd).format("MMMM Do YYYY, h:mm:ss a");
            
            return(newExam);
          })
          
          res.json(examsWithReadableTimes);   

        }
      })
    })
  }
  
exports.exportExams = exportExams;