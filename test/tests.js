var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

describe('/api/exams', function() {
  let testExamId = '';
  describe('GET', function() {
    it('should respond with list of exams', function(done) {
      chai.request(server)
      .get('/api/exams') //GET exams list from test set of Fall 1999, ie. 9909
      .query({semester: 9909})
      .end(function (err, res) {
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'examId');
          assert.property(res.body[0], 'courseId');
          assert.property(res.body[0], 'examName');
          assert.property(res.body[0], 'examDate');
          assert.property(res.body[0], 'examStart');
          assert.property(res.body[0], 'examEnd');
          assert.property(res.body[0], 'examSoftware');
          assert.property(res.body[0], 'examSemester');
          assert.equal(res.body[0].examSemester, 9909);
          assert.property(res.body[0], 'examDuration');
          assert.property(res.body[0], 'emailFaculty');
          assert.property(res.body[0], 'facultyConfirmed');
          assert.property(res.body[0], 'building');
          assert.property(res.body[0], 'room');
          assert.property(res.body[0], 'examNotes');
          assert.property(res.body[0], 'supportPerson');
          assert.property(res.body[0], 'approved');
          done();
        }    
      })
    });
  });
  describe('POST', function() {
    it('add new exam to exams collection', function(done){
      chai.request(server)
      .post('/api/exams')
      .send({
        courseId: "5e1d05233193f6172406f0e8",  //test data needs to include course with this uniqueId
        examName: 'Exam 1',
        examDate: '9/9/1999',
        examStart: "0800",
        examEnd: "0930",
        examSoftware: 'examsoft',
        examSemester: "9909",
        examDuration: "90",
        emailFaculty: false,
        facultyConfirmed: false,
        building: 'cns',
        room: '101',
        examNotes: "",
        supportPerson: "",
        approved: null
      })
      .end(function(err, res) {
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);

          assert.equal(res.body.courseId, "5e1d05233193f6172406f0e8");
          assert.equal(res.body.examName, 'Exam 1');
          assert.equal(res.body.examDate, '9/9/1999');
          assert.equal(res.body.examStart, 0800);
          assert.equal(res.body.examEnd, 0930);
          assert.equal(res.body.examSoftware, 'examsoft');
          assert.equal(res.body.examSemester, '9909');
          assert.equal(res.body.examDuration, 90);
          assert.equal(res.body.emailFaculty, false);
          assert.equal(res.body.facultyConfirmed, false);
          assert.equal(res.body.building, 'cns');
          assert.equal(res.body.room, '101');
          assert.equal(res.body.examNotes, "");
          assert.equal(res.body.supportPerson, "");
          assert.equal(res.body.approved, null);
          
          assert.isOk(res.body.examId);
          testExamId = res.body.examId;
          
          done();
        }
      })
    })
  })
  describe('PUT', function () {
    it('update existing exam', function (done) {
      chai.request(server)
      .put(`/api/exams?examId=${testExamId}`)
      .send({
        examDate: '10/1/1999',
        examStart: 0930,
        examEnd: 1050,
        facultyConfirmed: true,
        building: 'law',
        room: '204',
        examNotes: "Test note for testing purposes.",
        supportPerson: "Grittwald Grittington"
        
      })
      .end(function(err, res) {
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);
          assert.equal(res.body.examDate, '10/1/1999');
          assert.equal(res.body.examStart, 0930);
          assert.equal(res.body.examEnd, 1050);
          assert.equal(res.body.facultyConfirmed, true);
          assert.equal(res.body.building, 'law');
          assert.equal(res.body.room, '204');
          assert.equal(res.body.examNotes, "Test note for testing purposes.");
          assert.equal(res.body.supportPerson, "Grittwald Grittington");
          assert.equal(res.body.examId, testExamId);
          
          done()
        }
      })
    })    
  })
});


describe('/api/courses?semester=####', function (){
  describe('GET', function (){
    it('response with JSON of courses in semester', function (done){
      chai.request(server)
      .get('/api/courses')
      .query({
        semester: 9909
      })
      .end( function(err, res) {
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'semester');
          assert.equal(res.body[0].semester, 9909);
          assert.property(res.body[0], 'unit');
          assert.property(res.body[0], 'subject');
          assert.property(res.body[0], 'course');
          assert.property(res.body[0], 'section');
          assert.property(res.body[0], 'index');
          assert.property(res.body[0], 'courseTitle');
          assert.property(res.body[0], 'assignedInstructor');
          assert.property(res.body[0], 'day');
          assert.property(res.body[0], 'courseStartTime');
          assert.property(res.body[0], 'courseEndTime');
          assert.property(res.body[0], 'building');
          assert.property(res.body[0], 'room');
          assert.property(res.body[0], 'program');
          assert.property(res.body[0], 'level');
          assert.property(res.body[0], 'uniqueId');
          assert.property(res.body[0], 'examsoft');
          assert.property(res.body[0], 'final');
          assert.property(res.body[0], 'enrollment');
          assert.property(res.body[0], 'sectionNickname');
          
          done();
        }
      })
    })
  })
  
  
  describe('POST', function(){
    it('upload/add a set of courses', function(done){
      chai.request(server)
      .post('/api/courses?semester=9909')
      /*
      TODO:
      attach sample file using ".attach(field, file, attachment)",
      e.g. .attach('imageField', fs.readFileSync('avatar.png'), 'avatar.png')
      THEN remove courses after tests using Mocha methods.
      */
      .end(function (err, res){
        if(err){
          done(err)
        } else {
          //insert assertion tests here
          assert.fail("upload file attachment test not setup yet.")
          done();
        }
      })
    })
  })
})


describe('api/courses?uniqueId=########', function(){
  describe('GET', function(){
    it('get full course object', function(done){
      chai.request(server)
      .get('/api/courses?uniqueId=000001')
      .end(function(err, res){
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'semester');
          assert.equal(res.body[0].semester, 9909);
          assert.property(res.body, 'unit');
          assert.property(res.body, 'subject');
          assert.property(res.body, 'course');
          assert.property(res.body, 'section');
          assert.property(res.body, 'index');
          assert.property(res.body, 'courseTitle');
          assert.property(res.body, 'assignedInstructor');
          assert.property(res.body, 'day');
          assert.property(res.body, 'courseStartTime');
          assert.property(res.body, 'courseEndTime');
          assert.property(res.body, 'building');
          assert.property(res.body, 'room');
          assert.property(res.body, 'program');
          assert.property(res.body, 'level');
          assert.property(res.body, 'uniqueId');
          assert.property(res.body, 'examsoft');
          assert.property(res.body, 'final');
          assert.property(res.body, 'enrollment');
          assert.property(res.body, 'sectionNickname');

          done();
        }
      })
    })
  })

  describe('PUT', function(){
    it('update details about course without changing uniqueId', function(done){
      chai.request(server)
      .put('/api/courses?uniqueId=000001')
      .send({
        assignedInstructor: "Professor X",
        buidling: "atg",
        room: "231",
        examsoft: true
      })
      .end(function(err, res){
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);
          assert.equal(res.body.uniqueId, 000001);
          assert.equal(res.body.assignedInstructor, "Professor X");
          assert.equal(res.body.building, "atg");
          assert.equal(res.body.room, "231");
          assert.equal(res.body.examsoft, true);

          done();
        }
      })
    })
  })
})


describe('/api/exam-warnings', function(){
  describe('?semester=#### GET', function(){
    it('responds with JSON of all of semesters warnings', function(done){
      chai.request(server)
      .get('/api/exam-warnings?semester=9909')
      .end(function(err, res){
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'conflictId');
          assert.property(res.body[0], 'examsInConflict');
          assert.isArray(res.body[0].examsInConflict);
          assert.property(res.body[0], 'conflictLevel');
          assert.property(res.body[0], 'conflictIgnored');

          done();
        }
      })
    })
  })

  describe('?conflictId=####### PUT', function(){
    it('update ignored boolean by conflictId', function(done){
      chai.request(server)
      .put('/api/exam-warnings?conflictId=0000001') //test data needs to include this conflictId
      .send({
        conflictIgnored: true
      })
      .end(function(err, res){
        if(err){done(err)}
        else{
          assert.equal(res.status, 200);
          assert.equal(res.body.conflictId, 0000001);
          assert.equal(res.body.conflictIgnored, true);

          done();
        }
      })
    })
  })
})