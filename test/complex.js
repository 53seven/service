/* global describe, it, before, after */
const request = require('supertest');
const test_routes = require('./test_routes');
const service = require('../app');
const herodotus = require('herodotus');

const id = 'this_is_an_alnum_id_1234567890';

describe('service.complex', () => {

  let app, agent;

  before(async () => {
    let logger = herodotus();
    app = await service.run({
      routes: {
        '/': [test_routes]
      },
      auth: true,
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

    it('should 200 if valid auth token provided', () => {
      return agent.get(`/needs_auth?apikey=${id}`).expect(200);
    });

    it('should 401 if invalid auth token provided', () => {
      return agent.get('/needs_auth?apikey=not_a_token').expect(401);
    });
  });

});
