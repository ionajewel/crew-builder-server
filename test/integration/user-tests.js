const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const db = require('../../models');

describe('user creation page', function () {
  before(function () {
    return db.sequelize.sync();
  });

  beforeEach(function () {
    this.models = db;

    return Promise.all([
      this.models.Task.destroy({ truncate: true }),
      this.models.User.destroy({ truncate: true }),
      this.models.Crew.destroy({ truncate: true }),
    ]);
  });

  it('Responds with 200 at localhost', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
});