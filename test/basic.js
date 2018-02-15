/* global describe, it, before, after */
const request = require('supertest');
const test_routes = require('./test_routes');
const service = require('../app');

describe('service.basic', () => {

  let app, agent;

  before(async () => {
    app = await service.run({
      routes: {
        '/': test_routes
      }
    });
    agent = request.agent(app);
  });

  after((done) => {
    app.close(() => {
      done();
    });
  });


  describe('GET', () => {
    it('should GET routes', () => {
      return agent.get('/test').expect(200);
    });
  });

  describe('404', () => {
    it('should 404 with no routes', () => {
      return agent.get('/does_not_exist').expect(404);
    });
  });

  describe('500', () => {
    it('should 500 in a sane way', () => {
      return agent.get('/500').expect(500);
    });
  });

  describe('Custom error', () => {
    it('return custom error codes', () => {
      return agent.get('/555').expect(555);
    });
  });
});
