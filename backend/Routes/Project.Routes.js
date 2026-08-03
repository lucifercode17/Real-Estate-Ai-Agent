const express = require('express');
const project = require('../data/Project');


const Router = express();

Router.get("/",(req,res) =>{
  res.status(200).json(project);
})

module.exports = Router;