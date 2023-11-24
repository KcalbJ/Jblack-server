const express = require('express');
const router = express.Router();

const { getAllTopics } = require('../controllers/topics-controller');


const { getEndpoints } = require('../controllers/endpoint-controller');
const { getArticleById, getAllArticles, patchArticleById } = require('../controllers/ariticles-controller');
const { getCommentsByArticleId, postCommentByArticleId, deleteComment, patchCommentVotes } = require('../controllers/comments-controller');
const { getAllUsers, getUserByName } = require('../controllers/users-controller');



/**
 * Endpoint
 */

router.get('/', getEndpoints);

/**
 * Topics
 */
router.get('/topics', getAllTopics);

/**
 * Articles
 */
router.get('/articles/:article_id', getArticleById);
router.get('/articles', getAllArticles);
router.patch('/articles/:article_id', patchArticleById);

/**
 * Comments
 */
router.get('/articles/:article_id/comments', getCommentsByArticleId);
router.post('/articles/:article_id/comments', postCommentByArticleId);
router.delete('/comments/:comment_id', deleteComment);
router.patch('/comments/:comment_id', patchCommentVotes);

/**
 * users
 */

router.get('/users', getAllUsers)
router.get('/users/:username', getUserByName);

module.exports = router;
