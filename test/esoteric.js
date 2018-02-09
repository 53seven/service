/* global describe, it, before, after */
const request = require('supertest');
const expect = require('chai').expect;
const package = require('../package.json');
const service = require('../app');

describe('service.esoteric', () => {
  describe('no_routes', () => {
    let app, agent;

    before(async () => {
      app = await service.run(package);
      agent = request.agent(app);
    });

    after((done) => {
      app.close(() => {
        done();
      });
    });

    describe('404', () => {
      it('should 404 with no routes', () => {
        return agent.get('/').expect(404);
      });
    });
  });

  describe('EADDRINUSE', () => {
    let app;
    before(async () => {
      app = await service.run(package);
    });

    after((done) => {
      app.close(() => {
        done();
      });
    });

    let err;
    it('should throw an error if address is already in use', async () => {
      try {
        await service.run(package);
      } catch(_err) {
        err = _err;
      }

      expect(err).to.be.an('error');
    });
  });
});