const express = require('express');
const { getAllTopics } = require('./controllers/topics-controller');
const { handle404, handleCustomErrors, handleServerErrors, handlePsqlErrors } = require('./errors/error-handlers');



const app = express()

app.use(express.json())
app.get('/api/topics', getAllTopics)


app.all("*", handle404);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use(handleCustomErrors);

module.exports = app;