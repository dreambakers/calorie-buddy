const express = require('express');
const routes = require('./routes/routes');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
app.use(express.static('public'))

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'x-auth,Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'x-auth,Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', routes);

// basic food GET API can be accessed at <api_url>/food

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app }