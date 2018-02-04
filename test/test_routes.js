// test_routes.js
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({foo: 'bar'});
});

router.get('/500', (req, res, next) => {
  next(new Error('your mother'));
});

router.get('/555', (req, res, next) => {
  let err = new Error('you can be Hoju');
  err.status = 555;
  next(err);
});


module.exports = router;
