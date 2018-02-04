/* global describe, it, before, after */
const request = require('supertest');
const package = require('../package.json');
const test_routes = require('./test_routes.js');

let app, agent;

// global before and afters
before((done) => {
  app = require('../app.js').run(package, {'/': test_routes});
  app.on('listening', () => {
    agent = request.agent(app);
    done();
  });
});

after((done) => {
  app.close(() => {
    console.log('killed the server');
    done();
  });
});


describe('service', () => {

  describe('GET', () => {
    it('should GET routes', (done) => {
      agent
        .get('/test')
        .expect(200)
        .end(done);
    });
  });

  describe('404', () => {
    it('should 404 with no routes', (done) => {
      agent
        .get('/does_not_exist')
        .expect(404)
        .end(() => {
          done();
        });
    });
  });

  describe('500', () => {
    it('should 500 in a sane way', (done) => {
      agent
        .get('/500')
        .expect(500)
        .end(done);
    });
  });

  describe('Custom error', () => {
    it('return custom error codes', (done) => {
      agent
        .get('/555')
        .expect(555)
        .end(done);
    });
  });
});
