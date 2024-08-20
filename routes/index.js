//All Routers Exports

const express = require('express');
const app = express();
const router = express.Router();

//TodoRouter
const TodoRouter = require('./todo');

//Refactoring
router.use('/todo', TodoRouter); // http://localhost:3000/todo 로 라우팅

module.exports = router;
