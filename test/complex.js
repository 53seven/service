/* global describe, it, before, after */
const request = require('supertest');
const test_routes = require('./test_routes');
const service = require('../app');
const herodotus = require('herodotus');

describe('service.complex', () => {

  let app, agent;

  before(async () => {
    let logger = herodotus();
    app = await service.run({
      routes: {
        '/': [test_routes]
      },
      passport: {
        initialize: () => {
          return (req, res, next) => { next(); };
        }
      },
      view_path: 'foo/bar',
      static: ['public/'],
      logger
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

});
