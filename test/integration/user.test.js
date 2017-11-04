const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const db = require('../../server/models');
const seed = require('../../server/seeders');

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

  it('Sends an empty list if the user is not yet a member of any crews', function(done) {
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
        expect(res.body.leader).to.equal(0);
        done();
      })
      .catch(err => done(err));
  });
});