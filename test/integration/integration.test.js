const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../../app');
const db = require('../../server/models');
const seed = require('../../server/seeders');
chai.use(require('chai-moment'));

describe('user creation page', function () {

  beforeEach(function (done) {
    seed(db).then(() => done());
  });

  it('connects to the test database', function() {
    return db.sequelize.authenticate();
  });

  it('Responds with 200 at localhost', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .then(() => done())
      .catch(err => done(err));
  });

  it('Responds with a user\'s crews as { leader: [ ], member: [ ]}', function(done) {
    request(app)
      .get('/api/user/crews?user_id=1')
      .expect(200)
      .then(res => {
        expect(res.body.leader.length).to.equal(1);
        expect(res.body.member.length).to.equal(14);
        done();
      })
      .catch(err => done(err));
  });

  it('Responds with an empty list if the user is not yet a member of any crews', function(done) {
    db.User
      .create()
      .then(user => {
        let id = user.id;
        return request(app)
          .get(`/api/user/crews?user_id=${id}`);
      })
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.body.member.length).to.equal(0);
        expect(res.body.leader.length).to.equal(0);
        done();
      })
      .catch(err => done(err));
  });

  it('Responds with lists of users tasks in progress and tasks not yet claimed', function(done) {
    request(app)
      .get('/api/user/tasks?user_id=1&crew_id=4')
      .expect(200)
      .then(res => {
        expect(res.body.tasksInProgress.length).to.equal(0);
        expect(res.body.tasksAvailable.length).to.equal(16);
        done();
      })
      .catch(err => done(err));
  });

  it('Responds with a list of tasks belonging to a crew', function(done) {
    request(app)
      .get('/api/crew/tasks?crew_id=4')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.equal(17);
        done();
      })
      .catch(err => done(err));
  });

  it('Responds with a list of all crews when no search query is sent', function(done) {
    request(app)
      .get('/api/crews')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.equal(15);
        done();
      })
      .catch(err => done(err));
  });

  it('Responds with a list of matching crews when a search query is sent', function(done) {
    request(app)
      .get('/api/crews?qs=community')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.equal(7);
        done();
      })
      .catch(err => done(err));
  });

  it('Responds with all the members of a given crew', function(done) {
    request(app)
      .get('/api/leader/members?crew_id=4')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.equal(14);
        done();
      })
      .catch(err => done(err));
  });

  it('Responds with a list of unverified tasks for a crew leader', function(done) {
    request(app)
      .get('/api/leader/tasks?crew_id=13')
      .expect(200)
      .then(res => {
        expect(res.body.length).to.equal(1);
        expect(res.body[0].task_name).to.equal('Tweet a link to our SoundCloud');
        done();
      })
      .catch(err => done(err));
  });

  it('Creates a new task', function(done) {
    let expiry = new Date();
    let task = {
      task_name: 'Task 1',
      task_description: 'Task 1 added',
      points: 55,
      limit: 3,
      expiry: expiry,
      task_url: 'task_url',
      crew_id: 4
    };

    request(app)
      .post('/api/task')
      .send(task)
      .expect(201)
      .then(res => {
        expect(res.body.id).to.equal(177);
        expect(res.body.task_name).to.equal('Task 1');
        expect(res.body.task_description).to.equal('Task 1 added');
        expect(res.body.points).to.equal(55);
        expect(res.body.limit).to.equal(3);
        expect(res.body.expiry).to.be.sameMoment(expiry);
        expect(res.body.task_url).to.equal('task_url');
        expect(res.body.crew_id).to.equal(4);
        done();
      })
      .catch(err => done(err));
  });
});