var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

describe('/api/exams route tests', function() {
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
          assert.property(res.body[0], 'uniqueId');
          assert.property(res.body[0], 'examName');
          assert.property(res.body[0], 'examDate');
          assert.property(res.body[0], 'examStart');
          assert.property(res.body[0], 'examEnd');
          assert.property(res.body[0], 'examSoftware');
          assert.property(res.body[0], 'examSemester');
          assert.property(res.body[0], 'examDuration');
          assert.property(res.body[0], 'emailFaculty');
          assert.property(res.body[0], 'facultyConfirmed');
          assert.property(res.body[0], 'building');
          assert.property(res.body[0], 'room');
          assert.property(res.body[0], 'examNotes');
          assert.property(res.body[0], 'supportPerson');
          assert.property(res.body[0], 'approved');
          assert.property(res.body[0], 'semester');
          assert.equal(res.body[0].semester, 9909);
          done();
        }    
      })
      
    });
  });
});