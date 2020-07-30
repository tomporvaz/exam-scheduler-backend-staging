const mongoose = require('mongoose');
const { Exam, arrFlattenExam } = require('./exams');


function exportExams(app){
  app.get('/api/exportExams', function(req, res){
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
            newExam.startTime = moment(exam.examStart).format("dddd, MMMM Do YYYY, h:mm:ss a");
            newExam.endTime = moment(exam.examEnd).format("dddd, MMMM Do YYYY, h:mm:ss a");
            
            return(newEaxm);
          })
          
          res.json(examsWithReadableTimes);   

        }
      })
    })
  }
  
exports.exportExams = exportExams;