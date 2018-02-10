/* global describe, it, before, after */
const request = require('supertest');
const package = require('../package.json');
const test_routes = require('./test_routes');
const service = require('../app');

describe('service.complex', () => {

  let app, agent;

  before(async () => {
    app = await service.run(package, {
      routes: {
        '/': [test_routes]
      },
      passport: {
        initialize: () => {
          return (req, res, next) => { next(); };
        }
      },
      view_path: 'foo/bar',
      static: ['public/']
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
