const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


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
function examRoutes () {
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
        res.send(`/api/exam GET route worked!`)
    })
}
exports.examSchema = examSchema;
exports.Exam = Exam;
exports.examRoutes = examRoutes;
