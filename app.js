const express = require('express');
const app = express();
const routes = require('./routes/routes');
const cors = require('cors');
const { handle404, handleCustomErrors, handleServerErrors, handlePsqlErrors } = require('./errors/error-handlers');
app.use(cors());

app.use(express.json());


app.use('/api', routes);


app.all('*', handle404);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;