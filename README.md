@537/service
===

A 'set and forget' opinionated implementation of express. Useful for stateless apis.

```
const service = require('@537/service');
const pck = require('./package.json');
const index_routes = require('routes/index');
const user_routes = require('routes/user');

// sets up all the routes and middleware
const app = service.bootstrap(pck, {
  '/': index_routes,
  '/user': user_routes
});

// do any extra config here....

// binds the express app to a port and starts listening
const server = service.start(app);

// alternatively:

// set up routes and listen on the port right away
const server = service.run(pck, {
  '/': index_routes,
  '/user': user_routes
});

```

License
===

MIT
