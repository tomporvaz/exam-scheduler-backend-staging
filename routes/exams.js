const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


//exam schema and model
const examSchema = new Schema({
  courseId: {type: ObjectId, required: true, ref: 'Course'},
  examName: {type: String, required: true},
  examStart: {type: Date},
  examEnd: {type: Date},
  examSoftware: {type: String},
  examSemester: {type: String, required: true},
  examDuration: {type: Number},
  emailFaculty: {type: Boolean},
  facultyConfirmed: {type: Boolean},
  examBuilding: {type: String},
  examRoom: {type: String},
  examNotes: {type: String},
  supportPerson: {type: String},
  approved: {type: Boolean}
})

const Exam = mongoose.model('Exam', examSchema);
function examRoutes (app) {
  app.route('/api/exams')
  
  .post(function (req, res) {
    const newExam = new Exam({
      courseId: req.body.courseId,
      examName: req.body.examName,
      examStart: req.body.examStart,
      examEnd: req.body.examEnd,
      examSoftware: req.body.examSoftware,
      examSemester: req.body.examSemester,
      emailFaculty: req.body.emailFaculty,
      facultyConfirmed: req.body.facultyConfirmed,
      examBuildin: req.body.examBuilding,
      examRoom: req.body.examRoom,
      examNotes: req.body.examNotes,
      supportPerson: req.body.supportPerson,
      approved: req.body.approved
    })
    
    newExam.save(function (err, doc){
      if(err){console.error(err)}
      else{
        doc.populate('courseId').execPopulate(
          (err, popDoc) => {
            console.log(popDoc);
            res.json(arrFlattenExam(popDoc));
          }
        )
        }
      })
    })
    
    .get(function (req, res) {
      Exam.find({examSemester: req.query.semester})
      .populate('courseId')
      .exec(
        function(err, doc){
          if(err){console.error(err)}
          else{
            
            res.json(doc.map(exam => arrFlattenExam(exam)));   
          }
        })
      })
      .put(function(req, res){
        
        let updateObj = {};
        
        
        if(req.body.courseId){updateObj.courseId = req.body.courseId};
        if(req.body.examName){updateObj.examName = req.body.examName};
        if(req.body.examStart){updateObj.examStart = req.body.examStart};
        if(req.body.examEnd){updateObj.examEnd = req.body.examEnd};
        if(req.body.examSoftware){updateObj.examSoftware = req.body.examSoftware};
        if(req.body.examSemester){updateObj.examSemester = req.body.examSemester};
        if(req.body.emailFaculty){updateObj.emailFaculty = req.body.emailFaculty};
        if(req.body.facultyConfirmed){updateObj.facultyConfirmed = req.body.facultyConfirmed};
        if(req.body.examBuilding){updateObj.examBuilding = req.body.examBuilding};
        if(req.body.examRoom){updateObj.examRoom = req.body.examRoom};
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
      
      //flatten course data forEach exam into itself and update _id to examId
      function arrFlattenExam (exam) {
        
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
        
      }
      
      exports.examSchema = examSchema;
      exports.Exam = Exam;
      exports.examRoutes = examRoutes;
      