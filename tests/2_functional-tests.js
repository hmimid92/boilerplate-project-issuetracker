const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('POST tests', function () {
    test('issue with every field', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/:project')
        .send({
          "assigned_to": "great",
          "status_text": "good",
          "issue_title": "blocking", 
          "issue_text": "bug 2", 
          "created_by": "ahmed"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.assigned_to, 'great');
          assert.equal(res.body.status_text, 'good');
          assert.equal(res.body.issue_title, 'blocking');
          assert.equal(res.body.issue_text, 'bug 2');
          assert.equal(res.body.created_by, 'ahmed');
          done();
        });
    });

    test('issue with only required fields', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/:project')
        .send({
          "issue_title": "blocking", 
          "issue_text": "bug 2", 
          "created_by": "ahmed"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.issue_title, 'blocking');
          assert.equal(res.body.issue_text, 'bug 2');
          assert.equal(res.body.created_by, 'ahmed');
          done();
        });
    });

    test('issue with missing required fields', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/:project')
        .send({
          "created_by": "ahmed"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type,'application/json');
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });

  });
  
  suite('GET tests', function () {
    test('View issues', function (done) {
      chai
      .request(server)
      .keepOpen()
      .get('/api/issues/:project')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });

    test('View issues on a project with one filter', function (done) {
      chai
      .request(server)
      .keepOpen()
      .get('/api/issues/:project')
      .query({open: false})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });

    test('View issues on a project with one filter', function (done) {
      chai
      .request(server)
      .keepOpen()
      .get('/api/issues/:project')
      .query(
        {open: false,
         assigned_to: "f",
         created_by: "f"
       })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
    });

  });
  
  suite('PUT tests', function () {
    test('Update one field', function (done) {
      chai
      .request(server)
      .keepOpen()
      .put('/api/issues/:project')
      .send({
        "_id": "6744d1f9f5871f8437f8fc33",
        "issue_title": "blockings"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
    });

    test('Update multiple fields', function (done) {
      chai
      .request(server)
      .keepOpen()
      .put('/api/issues/:project')
      .send({
        "_id": "6744d1f9f5871f8437f8fc33",
        "issue_title": "blockings",
        "issue_text": "bug 25",
        "created_by": "mhammed"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.result, 'successfully updated');
        done();
      });
    });

    test('Update an issue with missing id', function (done) {
      chai
      .request(server)
      .keepOpen()
      .put('/api/issues/:project')
      .send({
        "issue_title": "blockings",
        "issue_text": "bug 25",
        "created_by": "mhammed"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });

    test('Update an issue with no fields', function (done) {
      chai
      .request(server)
      .keepOpen()
      .put('/api/issues/:project')
      .send({
        "_id": "674463be7e056b5df25cfb38"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
    });


    test('Update an issue with an invalid _id', function (done) {
      chai
      .request(server)
      .keepOpen()
      .put('/api/issues/:project')
      .send({
        "_id": "674463be7e056b5df25cfbh8",
        "issue_title": "blockings",
        "issue_text": "bug 25",
        "created_by": "mhammed"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.error, 'could not update');
        done();
      });
    });
    
  });

  suite('DELETE tests', function () {
    test('Delete an issue', function (done) {
      chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/:project')
      .send({
        "_id": "6744d1f9f5871f8437f8fc33"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.result, 'successfully deleted');
        done();
      });
    });

    test('Delete an issue with an invalid _id', function (done) {
      chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/:project')
      .send({
        "_id": "674463c47e056b5df25cfo41"
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.error, 'could not delete');
        done();
      });
    });

    test('Delete an issue with missing _id', function (done) {
      chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/:project')
      .send({
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type,'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });

  });

});
