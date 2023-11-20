const express = require('express');
const { getAllTopics } = require('./controllers/topics-controller');

const { handle404, handleCustomErrors, handleServerErrors, handlePsqlErrors } = require('./errors/error-handlers');
const { getEndpoints } = require('./controllers/endpoint-controller');
const { getArticleById } = require('./controllers/ariticles-controller');



const app = express()

app.use(express.json())
app.get('/api/topics', getAllTopics)
app.get('/api', getEndpoints)
app.get('/api/articles/:article_id', getArticleById)

app.all("*", handle404);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;