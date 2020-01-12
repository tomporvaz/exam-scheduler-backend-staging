const mongoose = require('mongoose');
const exams = require('../routes/exams.js'); 
const Exam = exams.Exam; 

module.exports = function loadExams (examJson) {
    
    examJson.forEach((examData) => {
        const newExam = new Exam({
            courseId: mongoose.Types.ObjectId(examData.courseId),
            examName: examData.examName,
            examDate: examData.examDate,
            examStart: examData.examStart,
            examEnd: examData.examEnd,
            examSoftware: examData.examSoftware,
            examSemester: examData.examSemester,
            examDuration: examData.examDuration,
            emailFaculty: examData.emailFaculty,
            facultyConfirmed: examData.facultyConfirmed,
            building: examData.building,
            room: examData.room,
            examNotes: examData.examNotes,
            supportPerson: examData.supportPerson,
            approved: examData.approved
        })
        
        newExam.save(function (err, doc){
            if(err){console.error(err)}
            else{console.log(`Sucess, ${newExam.examName} saved!`)}
        }) 
    })
    
    
    
}