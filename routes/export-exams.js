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
          
          res.json(doc.map(exam => arrFlattenExam(exam)));   
        }
      })
    })
  }
  
exports.exportExams = exportExams;