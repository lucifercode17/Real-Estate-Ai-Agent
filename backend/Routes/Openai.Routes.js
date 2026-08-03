const express = require('express')
const openaicontroller = require('../Controllers/openai.Controller')
const OpenAIRouter = express.Router();

OpenAIRouter.post('/',openaicontroller.PostReply);

module.exports = OpenAIRouter;

